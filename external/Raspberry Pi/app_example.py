from bluepy.btle import Scanner, DefaultDelegate
import requests
import json
import sys
import os
import time
from time import sleep
import schedule
import subprocess
from aws_mqtt import aws_mqtt

data = []
seconds = 5
macAddr = 'b8:27:eb:a1:77:50'
beaconMacAddr = 'ac:23:3f:a5:13:81'
API_ENDPOINT = "https://{...}/data-analyse"

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)
    
    def handleDiscovery(self, dev, isNewDev, isNewData):
        if isNewDev:
            print("Disccovered Device", dev.addr)
        elif isNewData:
            print("Received New Data from", dev.addr)

class SOS:
    def __init__(self):
        self.found = False
    
def beacon_scan(data, sos):
    detected_time = time.time()
    scanner = Scanner().withDelegate(ScanDelegate())
    devices = scanner.scan(0.2)
    beacons_dict = {}
    sos_dict = {}
    
    for dev in devices:
        if (dev.addr == beaconMacAddr):

            print("Device %s (%s), RSSI=%d dB" % (dev.addr, dev.addrType, dev.rssi))
            for (adtype, desc, value) in dev.getScanData():
                print("%s = %s" % (desc, value))
                if(value[0:10] == "e1ffa10364"):    # Accelerometer
                    beacons_dict["ts"] = detected_time
                    beacons_dict["location"] = "living_room"
                    beacons_dict["gateway_mac_addr"] = macAddr
                    beacons_dict["beacon_mac_addr"] = dev.addr
                    beacons_dict["beacon_rssi"] = dev.rssi
                    beacons_dict["beacon_acc_x"] = twos_complement_hex(value[10:14])/256
                    beacons_dict["beacon_acc_y"] = twos_complement_hex(value[14:18])/256
                    beacons_dict["beacon_acc_z"] = twos_complement_hex(value[18:22])/256
                    print("found acc data")
                    print(value)
                
                if(not sos.found):
                    if(value[0:8] == "aafe00e8"):   # Eddystone-UID
                        sos_dict["ts"] = detected_time
                        sos_dict["location"] = "living_room"
                        sos_dict["gateway_mac_addr"] = macAddr
                        sos_dict["beacon_mac_addr"] = dev.addr
                        sos_trigger(sos_dict);
                        sos.found = True
                        print("found eddystone uid")
                        print(value)
                    
            print('\n')
            data.append(beacons_dict);
    

def twos_complement_hex(hexval):
    bits = 16
    val = int(hexval, bits);
    if val & (1 << (bits-1)):
        val -= 1 << bits
    return val

def sos_flag():
    global sos
    val

def sos_trigger(sos_dict):
    try:
        print('inside sos')
        SOS_ENDPOINT = "https://{...}/sos"
        
        params = sos_dict;
        headers = {
            'Content-type':'application/json',
            'Accept': 'application/json'
        }
        
        r = requests.post(url = SOS_ENDPOINT, json = params, headers = headers)
        json = r.json()
        if 'Payload' in json:
            print(json['Payload'])
        else:
            print(json)
            
    except Exception as e:
        print(e)
        print("Error sending")
        sys.exit(0)
        
def event_trigger(data):
    try:
        data = [doc for doc in data if doc]
        last = data[-1]
        params = {"ts": last['ts'], "beacon": last['beacon_mac_addr']}
        
        headers = {
            'Content-type':'application/json',
            'Accept': 'application/json'
        }
        
        r = requests.post(url = API_ENDPOINT, json = params, headers = headers)
        json = r.json()
        if 'Payload' in json:
            print(json['Payload'])
        else:
            print(json)
    
    except Exception as e:
        print(e)
        print("Error sending")


if __name__=="__main__":
    
    try:
        print("Cleared JSON file")
        print("Initializing reader...")
        print("##########################################")
        print("BLE Program running")

        while(True):
            schedule.run_pending()
            sos = SOS()
            for _ in range(int(seconds/0.2)): # 25*0.2s = 5s
                beacon_scan(data, sos)
            
            aws_mqtt(data)
            event_trigger(data)
            
            data.clear()
#             sys.exit(0)    #for testing        

    except Exception as e:
        print(e)
        print("Error to run reader")
        sys.exit(0)
