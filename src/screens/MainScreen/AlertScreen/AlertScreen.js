import React, { useEffect, useState, useContext } from 'react'
import { FlatList, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/alert';
import { UserContext } from '../../../context/UserContext';
import { awsDbAPI } from '../../../aws/api';

export default function AlertScreen({ navigation }) {
    const [ alerts, setAlerts ] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(()=>{
        getAlerts(user)
        return () => {}
    }, [user])

    const getAlerts = async(user) => {
        let params = {
            beacon: user.beacon
        }
        if(user !== null && user !== ''){
            if('beacon' in user){
                if(user.beacon !== null && user.beacon !== ''){
                    await fetch(awsDbAPI.alertsHist, {
                        credentials: 'include',
                        method: 'POST', 
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    }).then(response => response.json())
                    .then((json) => {
                        if(json.items.length > 0){
                            setAlerts(json.items)
                        } else {
                            setAlerts(null)
                        }
                    })
                    .catch(error => console.error(error));
                }
            }
        }
    }

    function renderListItem(item){
        /* If last list item, style no border*/
        const itemStyle = (item.index == '-1' ? styles.itemNoBorder : styles.itemBorder)
        
        const date = item.date.substring(0,5); // dd/MM
        const length = item.time.length;
        const time = (length < 11 ? item.time.substring(0,4) : item.time.substring(0,5));
        const clock = (length < 11 ? item.time.substring(8,10) : item.time.substring(9,11));
        
        return (
            <View style={itemStyle}>
                <Text style={styles.itemDatetime}>{date} {time} {clock}</Text>
                <Text style={styles.item}>{item.type.toUpperCase()} | {item.location}</Text>
            </View>
        )
    }

    function ListView(){
        return (
            <View style={styles.listContainer}>
                <FlatList
                    data={alerts}
                    renderItem={({item}) => renderListItem(item)}
                    keyExtractor={(item) => item.index.toString()}
                />    
            </View>
        )
    }

    function EmptyView(){
        return(
            <View style={styles.emptyContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="notifications-off-circle-outline" color="#AAAABC" size={65} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.msgText}>
                        No alerts found
                        {"\n"}
                        in the past 30 days.
                    </Text>
                </View>
            </View>
        )
    }

    function calc_fall(){
        var num = 0;
        for (var i = 0; i < alerts.length; i++){
            if(alerts[i].type == "fall"){
                num += 1;
            }
        }
        return num;
    }

    function calc_sos(){
        var num = 0;
        for (var i = 0; i < alerts.length; i++){
            if(alerts[i].type == "sos"){
                num += 1;
            }
        }
        return num;
    }

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.headerView}>
                    <View style={styles.headerContainer}>
                        <Ionicons name="information-circle-outline" color="#BD4C55" size={18} />
                        <Text style={styles.headerInfo}>Only show records for the last 30 days</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsGroup}>    
                            <Text style={styles.statsNum}>{alerts ? calc_fall(): 0}</Text>
                            <Text style={styles.statsInfo}>Total Falls</Text>
                            {/* <Text style={styles.statsInfo}>Fall</Text> */}
                        </View>
                        <View style={styles.statsGroup}>
                            <Text style={styles.statsNum}>{alerts ? calc_sos(): 0}</Text>
                            <Text style={styles.statsInfo}>Total SOS</Text>
                            {/* <Text style={styles.statsInfo}>SOS</Text> */}
                        </View>
                        <View style={styles.statsGroup}>
                            <Text style={styles.statsNum}>{alerts ? alerts.length: 0}</Text>
                            <Text style={styles.statsInfo}>Total Alerts</Text>
                            {/* <Text style={styles.statsInfo}>Alerts</Text> */}
                        </View>
                    </View>
                </View>
            </View>
            {alerts ? <ListView /> : <EmptyView />}
        </View>
    )
}