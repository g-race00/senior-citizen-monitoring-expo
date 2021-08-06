# Python Scripts used in Raspberry Pi
- This document provides brief description for each python scripts
- Sensitive credentials such as AWS endpoints and AWS SDK credentials were hidden
- The scripts will only provide the codes and logic flow without the sensitive credentials

1. app_example.py
- Scan the BLE signals every 5 seconds, then store the data into DynamoDB via AWS IOT Core using MQTT
- If SOS is detected, the trigger "push_sos_notification" Lambda function by make API POST request to the "sos" endpoint.

2. aws_mqtt_example.py
- Handles MQTT task 


