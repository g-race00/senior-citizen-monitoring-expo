const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

// Get User endpoint
app.get('/users/:userId', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {userId, email, expoToken, info, beacon} = result.Item;
      res.json({ userId, email, expoToken, info, beacon });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
})

// Create User endpoint
app.post('/users', function (req, res) {
  const { userId, email, expoToken, info, beacon } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof email !== 'string') {
    res.status(400).json({ error: '"email" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      email: email,
      expoToken: expoToken,
      info: info,
      beacon : beacon
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, email, expoToken, info, beacon });
  });
})

// Edit User endpoint
app.post('/users/edit/:userId', function (req, res) {
  const { userId, expoToken, info, beacon } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Key:{
        userId: userId,
    },
    UpdateExpression: "set expoToken = :e, info = :i, beacon = :b",
    ExpressionAttributeValues:{
        ":e" : expoToken,
        ":i": info,
        ":b": beacon
    },
    ReturnValues:"UPDATED_NEW"
  };

  dynamoDb.update(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not update user' });
    }
    res.json({ userId, expoToken, info, beacon });
  });

  
})

// Edit User Token endpoint
app.post('/users/token/:userId', function (req, res) {
  const { userId, expoToken } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Key:{
        userId: userId,
    },
    UpdateExpression: "set expoToken = :e",
    ExpressionAttributeValues:{
        ":e" : expoToken,
    },
    ReturnValues:"UPDATED_NEW"
  };

  dynamoDb.update(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not update user' });
    }
    res.json({ userId, expoToken });
  });
})
module.exports.handler = serverless(app);