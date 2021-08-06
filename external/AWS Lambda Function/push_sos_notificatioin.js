const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});
const lambda = new AWS.Lambda({region: 'ap-southeast-1'});

exports.handler = async (event) => {
    
    const data = event;
    try {
        const beacon = data.beacon_mac_addr.replace(/:/g, "").toUpperCase();
        const gateway = data.gateway_mac_addr.replace(/:/g, "").toUpperCase();

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
        const date_obj = new Date(data.ts*1000); //convert Unix ts to js ts;
        const date = date_obj.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
        const time = date_obj.toLocaleTimeString('en-US', { timeZone: 'Asia/Kuala_Lumpur' });
        
        const locs = user.info.location;
        const loc = (locs[0].gateway == gateway ? locs[0].tag : locs[1].tag);
        
        const params_insert = {
            TableName: "alerts_table",
            Item:{
                "ts": data.ts,
                "date": date,
                "time": time,
                "type": "sos",
                "location": loc,
                "beacon": user.beacon
            }
        };
        
        const result_insert = await docClient.put(params_insert).promise();
        
        /* Push notification via invoking another lambda function */
        const msg = `@ Location: ${loc}! Immediate action required!`;
        
        const payload = {
          "recipients": [
            user.expoToken
          ],
          "sound": "default",
          "title": "SOS Detected!",
          "body": msg,
          "data": {
            "alert": "sos",
            "location": loc,
            "ts": data.ts,
          }
        };
        
        const push_params = {
            FunctionName: 'push_notification', 
            InvocationType: 'RequestResponse', 
            LogType: 'Tail',
            Payload: JSON.stringify(payload)
        };

        console.log("sos detected");
        
        return await lambda.invoke(push_params).promise();
    } catch (e) {
        console.error(e);
        const response = {
            statusCode: 400,
            body: JSON.stringify({ message: "Error occurs!", error: e })
        }
        return response
    }

};
