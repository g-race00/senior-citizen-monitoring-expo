const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});

exports.handler = async (event, context) => {
    const beacon = event.beacon.toLowerCase().match(/.{1,2}/g).join(':');

    /* Query last entry of raw_data_acc where beacon_mac_addr = beacon */
    try {
        const params = {
            TableName: "raw_data_acc",
            IndexName: "beacon_mac_addr-ts-index",
            Key: {
                "beacon_mac_addr": beacon
            }, 
            KeyConditionExpression: 'beacon_mac_addr = :b',
            ExpressionAttributeValues: {
                ':b': beacon,
            },
            ScanIndexForward: false, 
            Limit: 1
        }
        
        const result =  await docClient.query(params).promise();
        const items = result.Items;
        
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

