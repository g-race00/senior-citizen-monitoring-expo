import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import styles from '../../../styles/index';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../../context/UserContext';
import { awsDbAPI } from '../../../aws/api';
import BlinkIcon from './BlinkIcon';

export default function IndexScreen({navigation}) {

    const { user, setUser } = useContext(UserContext);
    const [ locOne, setLocOne] = useState(null);
    const [ locTwo, setLocTwo] = useState(null);
    const [ fallTime, setFallTime ] = useState(null);
    const [ sosTime, setSosTime ] = useState(null);

    const path = (user.info.gender == 'male' ? require('../../../../assets/old-man-icon.png'): require('../../../../assets/old-lady-icon.png'));

    const onEditButtonPress = () => {
        navigation.navigate('Edit');
    }

    function alertLocOne(){
        Alert.alert('Location #1', user.info.location[0].tag);
    }

    function alertLocTwo(){
        Alert.alert('Location #2', user.info.location[1].tag);
    }

    /* Get current location of target every 1 minute */
    useEffect(()=>{
        getCurLoc(user);
        calc_fall_time(user);
        calc_sos_time(user);
        const interval = setInterval(() => {
            getCurLoc(user);
            calc_fall_time(user);
            calc_sos_time(user);
        }, 60000); 
        return () => { clearInterval(interval) }
    }, [user])

    function renderListItem(item){
        /* If last list item, style no border*/
        const itemStyle = (item.index == '1' ? styles.itemNoBorder : styles.itemBorder)
        
        return (
            <View style={itemStyle}>
                <Text style={styles.itemDatetime}>{item.tag}</Text>
                <View style={styles.itemGroup}>
                    <Ionicons name="wifi" color="#AAAABC" size={18} />
                    <Text style={styles.item}>{item.gateway}</Text>
                </View>
            </View>
        )
    }

    function ListView(){
        const items = user.info.location;
        for(var i = 0; i < items.length; i++){
            items[i]['index'] = i;
        }
        return (
            <View style={ [(user.notif.fall && user.notif.sos) ? styles.listFlexContainer : styles.listContainer, {marginTop:(user.notif.fall || user.notif.sos ? 10:20)}]}>
                <FlatList
                
                    data={items}
                    renderItem={({item}) => renderListItem(item)}
                    keyExtractor={(item) => item.index.toString()}
                />    
            </View>
        )
    }

    function clearFallNotif(){
        user.notif.fall = ""
        setUser({...user})
        setFallTime(null)
    }

    function clearSosNotif(){
        user.notif.sos = ""
        setUser({...user})
        setSosTime(null)
    }

    function calc_fall_time(user){
        if(user.notif.fall !== null && user.notif.fall !== ''){
            const ts = user.notif.fall.ts;
            const current = new Date().getTime() / 1000;
            const diff = (current - ts);
            const d = Math.floor(diff / (3600*24));
            const h = Math.floor(diff % (3600*24) / 3600);
            const m = Math.floor(diff % 3600 / 60);
            const s = Math.floor(diff % 60);
    
            if(d == 0 && h == 0 && m == 0 && s > 0){
                setFallTime("Now")
            } else {
                console.log(m);
                const days = (d < 1 ? "" : d + "d ");
                const hours = (h < 1 ? "" : d + "hr ");
                const minutes = (m < 1 ? "" : m + "ms ");
                setFallTime(days + hours + minutes + 'ago')
            }
        }

    }

    function calc_sos_time(user){
        if(user.notif.sos !== null && user.notif.sos !== ''){
            const ts = user.notif.sos.ts;
            const current = new Date().getTime() / 1000;
            const diff = (current - ts);
            const d = Math.floor(diff / (3600*24));
            const h = Math.floor(diff % (3600*24) / 3600);
            const m = Math.floor(diff % 3600 / 60);
            const s = Math.floor(diff % 60);
    
            if(d == 0 && h == 0 && m == 0 && s > 0){
                setSosTime("Now")
            } else {
                console.log(m);
                const days = (d < 1 ? "" : d + "d ");
                const hours = (h < 1 ? "" : d + "hr ");
                const minutes = (m < 1 ? "" : m + "ms ");
                setSosTime(days + hours + minutes + 'ago')
            }
        }

    }

    function FallView(){
        return (
            <View style={styles.alertContainer}>
                <View style={styles.alertGroup}>
                    <View style={styles.alertIcon}>
                        <Ionicons name="alert-circle" color="orange" size={30} />
                    </View>
                    <View style={styles.alertInfoGroup}>
                        <Text style={styles.alertType}>{user.notif.fall.alert.toUpperCase()} Detected!</Text>
                        <Text style={styles.alertInfo}>@ {user.notif.fall.location}  |  {fallTime }</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={clearFallNotif}>
                    <Ionicons name="close" color="#AAAABC" size={20} />
                </TouchableOpacity>
            </View>
        )
    }

    function SosView(){
        return (
            <View style={styles.alertContainer}>
                <View style={styles.alertGroup}>
                    <View style={styles.alertIcon}>
                        <Ionicons name="alert-circle" color="#BD4C55" size={30} />
                    </View>
                    <View style={styles.alertInfoGroup}>
                        <Text style={styles.alertType}>{user.notif.sos.alert.toUpperCase()} Detected!</Text>
                        <Text style={styles.alertInfo}>@ {user.notif.sos.location}  |  {sosTime }</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={clearSosNotif}>
                    <Ionicons name="close" color="#AAAABC" size={20} />
                </TouchableOpacity>
            </View>
        )
    }

    function renderAlertListItem(item){
        
        return (item.alert == "fall" ? <FallView/> : <SosView/>)
    }

    function AlertListView(){
        const fall = user.notif.fall;
        const sos = user.notif.sos;
        var items = [];

        if(fall !== null && fall !== "" && sos !== null && sos !== ""){
            items = [fall, sos].sort((a, b) => b.ts - a.ts);
        } else if (fall !== null && fall !== ""){
            items = [fall];
        } else {
            items = [sos];
        }

        for(var i = 0; i < items.length; i++){
            items[i]['index'] = i;
        }

        return (
            <View style={styles.alertListContainer}>
                <FlatList
                    data={items}
                    renderItem={({item}) => renderAlertListItem(item)}
                    keyExtractor={(item) => item.index.toString()}
                />    
            </View>
        )
    }

    /* Get current location API request */
    const getCurLoc = async(user) => {
        let params = {
            beacon: user.beacon
        }
        if(user !== null && user !== ''){
            if('beacon' in user){
                if(user.beacon !== null && user.beacon !== ''){
                    await fetch(awsDbAPI.curLoc, {
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
                            const item = json.items[0];
                            const gateway = item.gateway_mac_addr.replace(/:/g, "").toUpperCase();

                            if(gateway == user.info.location[0].gateway){
                                setLocOne(true);
                                setLocTwo(null);
                            } else {
                                setLocOne(null);
                                setLocTwo(true);
                            }
                        } else {
                            setLocOne(null)
                            setLocTwo(null)
                        }
                    })
                    .catch(error => console.error(error));
                }
            }
        }
    }

    function FloorplanView(){
        const icon = <Ionicons name="location" color="yellow" size={45} />;
        const iconLocOne = (locOne ? <BlinkIcon duration={500}>{icon}</BlinkIcon> : icon);
        const iconLocTwo = (locTwo ? <BlinkIcon duration={500}>{icon}</BlinkIcon> : icon);

        return (
            <View style={styles.floorplanContainer}>
                <ImageBackground
                    style={styles.floorplan}
                    source={require('../../../../assets/floorplan.png')}
                >
                    <TouchableOpacity style={styles.pointerLocOne} onPress={alertLocOne}>
                        {iconLocOne}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pointerLocTwo} onPress={alertLocTwo}>
                        {iconLocTwo}
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }
    
    function LiveView(){
        const icon = <Ionicons name={(locOne || locTwo) ? 'checkmark-circle': 'close-circle'} color={(locOne || locTwo) ? 'green': '#BD4C55'} size={18} />;
        const text = (locOne || locTwo ? "Online": "Offline")
        const textGroup = <Text style={(locOne || locTwo) ? styles.onlineText : styles.offlineText}>{icon} {text}</Text>;

        return (
            <View style={styles.liveContainer}>
                {textGroup}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.personContainer}>
                <ImageBackground
                    style={styles.logo}
                    source={path}
                >
                    <View style={styles.status}>
                        <Ionicons name={(locOne || locTwo) ? 'checkmark-circle': 'close-circle'} color={(locOne || locTwo) ? 'green': '#BD4C55'} size={18} />
                    </View>
                </ImageBackground>
                <View style={styles.headerView}>
                    <Text style={styles.headerName}>{user.info.person.toUpperCase()}</Text>
                    <View style={styles.headerContainer}>
                        <Ionicons name="headset-outline" color="grey" size={18} />
                        <Text style={styles.headerBeacon}>{user.beacon.toUpperCase()}</Text>
                    </View>
                </View>
            </View>
            <FloorplanView/>
            <LiveView />
            {user.notif.sos || user.notif.fall ? <AlertListView/> : <></>}
            <ListView />
            <TouchableOpacity style={styles.bottomButton} onPress={onEditButtonPress}>
                <Ionicons name="pencil" color="white" size={25} />
            </TouchableOpacity>
        </View>
    )

}