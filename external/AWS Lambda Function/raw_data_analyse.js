const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});
const lambda = new AWS.Lambda({region: 'ap-southeast-1'});

exports.handler = async(event, context) => {
    const data = event; 
    
    // const scan_time = 15 // Raspberry Pi will push the data every 15 seconds, add 1 second [so scanning is continuous]
    /* The time which Raspberry Pi will push the data in seconds */
    const scan_time = 5;  // 5 seconds

    /* Get the last timestamp from detect.json */
    const end_ts = data.ts;

    /* Calculate the start time condition for querying the BLE raw data, 
    an extra 1 second of data will be included to ensure continuous data analytics */
    const start_ts = end_ts - scan_time - 1;
    
    try {
        /* Query for 3 raw data sets where ts >= start_ts && ts <= end_ts */
        const params = {
            TableName: "raw_data_acc",
            IndexName: "beacon_mac_addr-ts-index",
            Key: {
                "beacon_mac_addr": data.beacon
            }, 
            KeyConditionExpression: 'beacon_mac_addr = :mac_addr AND ts BETWEEN :st AND :et',
            ExpressionAttributeValues: {
                ':mac_addr': data.beacon,
                ':st': start_ts,
                ':et': end_ts,
            },
            ScanIndexForward: true, 
        };
        const result =  await docClient.query(params).promise();
        const items = result.Items;
        
        /* Calculate the resultant force of each BLE raw data returned */
        for (var i = 0; i < items.length; i++){
            const item = items[i];
            const x = item['beacon_acc_x'];
            const y = item['beacon_acc_y'];
            const z = item['beacon_acc_z'];
            
            const resultant_force = Math.sqrt(Math.pow(x,2)
                + Math.pow(y,2)
                + Math.pow(z,2)
            );
            
            /* Check if the resultant force < 0.5, if true then invoke push_notification Lambda function */
            const fall_threshold = 0.5;
            if(resultant_force < fall_threshold){
                
                const beacon = item.beacon_mac_addr.replace(/:/g, "").toUpperCase();
                const gateway = item.gateway_mac_addr.replace(/:/g, "").toUpperCase();
    
                /* Query user where beacon = data.beacon */
                const params = {
                    TableName: "users_table",
                    IndexName: "beacon-index",
                    Key: {
                        "beacon": beacon
                    }, 
                    KeyConditionExpression: 'beacon = :b',
                    ExpressionAttributeValues: {
                        ':b': beacon
                    },
                    Limit: 1,
                };
                
                const result =  await docClient.query(params).promise();
                const user = result.Items[0];
                
                /* Save alert log into alerts_table */
                const date_obj = new Date(item.ts*1000); //convert Unix ts to js ts;
                const date = date_obj.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
                const time = date_obj.toLocaleTimeString('en-US', { timeZone: 'Asia/Kuala_Lumpur' });
                
                const locs = user.info.location;
                const loc = (locs[0].gateway == gateway ? locs[0].tag : locs[1].tag);
                
                const params_insert = {
                    TableName: "alerts_table",
                    Item:{
                        "ts": item.ts,
                        "date": date,
                        "time": time,
                        "type": "fall",
                        "location": loc,
                        "beacon": user.beacon
                    }
                };
                
                const result_insert = await docClient.put(params_insert).promise();
                
                /* Push notification via invoking another lambda function */
                const msg = `@ Location: ${loc}`;
                
                const payload = {
                  "recipients": [
                    user.expoToken
                  ],
                  "sound": "default",
                  "title": "Fall Detected!",
                  "body": msg,
                  "data": {
                    "alert": "fall",
                    "location": loc,
                    "ts": item.ts,
                  }
                };
                
                const push_params = {
                    FunctionName: 'push_notification', 
                    InvocationType: 'RequestResponse', 
                    LogType: 'Tail',
                    Payload: JSON.stringify(payload)
                };

                return await lambda.invoke(push_params).promise();
            }
        }
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'No fall detected.' })
        }
        return response
        
    } catch (e) {
        console.error(e);
        const response = {
            statusCode: 400,
            body: JSON.stringify({ message: "Error occurs!", error: e })
        }
        return response
    }
}


