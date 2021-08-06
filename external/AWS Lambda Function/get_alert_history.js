const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});

exports.handler = async (event, context) => {
    const beacon = event.beacon;
    try {
        /* Get today's 12.00am time in Kuala-Lumpur timezone, then convert to UTC*/
        var today = new Date(); // UTC
        if (today.getHours() < 16){
            today.setDate(today.getDate() - 1);
        }
        today.setHours(16);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        /* The the timestamp of 30 days before today */
        const ts = (today.getTime() / 1000) - 2592000;

        /* Query the alerts history where ts >= ts */
        const params = {
            TableName: "alerts_table",
            IndexName: "beacon-ts-index",
            Key: {
                "beacon": beacon
            }, 
            KeyConditionExpression: 'beacon = :b AND ts >= :t',
            ExpressionAttributeValues: {
                ':b': beacon,
                ':t' : ts,
            },
            ScanIndexForward: false, 
        }
        
        const result =  await docClient.query(params).promise();
        const items = result.Items;
        
        /* Label each query results with incremental index for UI puspose */
        for (var i = 0; i < items.length; i++){
            if(i == (items.length - 1)){
                items[i]['index'] = -1;
            } else {
                items[i]['index'] = i;
            }
        }
        
        const response = {
            statusCode: 200,
            items: items
        };
        return response;
    } catch (e) {
        console.error(e);
        const response = {
            statusCode: 400,
            body: JSON.stringify({ message: "Error occurs!", error: e })
        };
        return response;
    }
};
