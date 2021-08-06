# LAMBDA FUNCTION
This document provides brief description for each lambda functions

1. push_notification 
- Send push notification to mobile device via Expo SDK using Expo Push Notification Token

2. user_express_application
- Handle Create, Update, Edit operations of [users_table]

3. get_alert_history
- Return a list of alert logs that exists in the past 30 days from [alerts_table] 

4. get_current_history
- Return the current location information of the senior citizen based on gateway's mac address of the last BLE raw data entry in [raw_data_acc] 

5. push_sos_notification
- Invoke "push_notification" Lambda function to send SOS alert.

6. raw_data_analyse
- n: the number of seconds when Raspberry Pi MQTT BLE raw data to AWS IOT Core
- Analyse the BLE raw data in the past n+1 seconds to identify whether fall event occurs.
- If fall event is detected, invoke "push_notification" Lambda function to send fall alert.

