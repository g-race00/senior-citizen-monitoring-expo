import React, { useContext, useState, useMemo, useEffect, useRef } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { AlertScreen, CreateScreen, EditScreen, EmptyScreen, IndexScreen } from './index';
import { View, TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { awsDbAPI } from '../../aws/api'
import { UserContext } from '../../context/UserContext'
import { AuthContext } from '../../context/AuthContext'
import * as Notifications from 'expo-notifications';

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});

const screenOptions = ({navigation}) => ({
    headerStyle: {
    backgroundColor: '#5C6BC0',
    },
    headerTintColor: '#fff',
    headerLeft: () => {
        return (
            <TouchableOpacity
                style={{paddingLeft: 20}}
                onPress={() => navigation.toggleDrawer()}>
                <Ionicons name="reorder-three" color="#FFF" size={25} />
            </TouchableOpacity>
        );
    },
})

function Home({ navigation }) {
    const { user } = useContext(UserContext);

    function HomeScreen({navigation}){
        return (user.info ? (<IndexScreen navigation={navigation}/>):(<EmptyScreen navigation={navigation}/>))
    }

    return (
        <Stack.Navigator screenOptions={screenOptions} initialRouteName="Home">
            <>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Create" component={CreateScreen} 
                    options={({navigation}) => ({
                        headerLeft: () => {
                            return (
                                <TouchableOpacity
                                    style={{paddingLeft: 20}}
                                    onPress={() => navigation.navigate("Home")}>
                                    <Ionicons name="arrow-back" color="#FFF" size={25} />
                                </TouchableOpacity>
                            )
                        },
                        headerTitle: "Add Information"
                    })}/>
                <Stack.Screen name="Edit" component={EditScreen} 
                    options={({navigation}) => ({
                        headerLeft: () => {
                            return (
                                <TouchableOpacity
                                    style={{paddingLeft: 20}}
                                    onPress={() => navigation.navigate("Home")}>
                                    <Ionicons name="arrow-back" color="#FFF" size={25} />
                                </TouchableOpacity>
                            )
                        },
                        headerTitle: "Edit Information"
                    })}/>
            </>
        </Stack.Navigator>
    )
}

function Alert({navigation}) {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Alert" component={AlertScreen} options={{ headerTitle: "Alert History"}}/>
        </Stack.Navigator>
    )
}

export default function MainScreen(props) {
    const { signOut } = useContext(AuthContext);
    const [ user, setUser ] = useState(props.extraData);
    
    const notificationListener = useRef();
    const responseListener = useRef();

    const onLogoutPress = () => {
        signOut(); 
    }

    const userContext = useMemo( () => (user,{
        user, setUser,
        updateUserInfo: async data => {
            let params = {
                userId: user.id,
                expoToken: user.token,
                info: data.info,
                beacon: data.beacon
              };
          
            await fetch(awsDbAPI.userUpdate + user.id, {
                credentials: 'include',
                method: 'POST', 
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            }).then((response) => response.json())
            .then((json) => {
                user.info = json.info;
                setUser({...user})
            }) 
            .catch((error)=> console.error(error));
        },
    }),[user]);

    const checkUser = async() => {
        console.log('checked')
        const addUser = async(user) => {
            let params = {
                userId: user.id,
                email: user.email,
                expoToken: user.token,
                info: "",
                beacon: "",
              };
          
            await fetch(awsDbAPI.userCreate, {
                credentials: 'include',
                method: 'POST', 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            }).then((response) => response.json())
            .then((json) => {
                user.info = json.info
                user.beacon = json.beacon
                setUser({ ...user })
            })
            .catch((error)=> console.error(error));
        }

        const updateUserToken = async(user) => {
            let params = {
                userId: user.id,
                expoToken: user.token,
                info: "",
                beacon: "",
              };
          
            await fetch(awsDbAPI.userUpdate + user.id, {
                credentials: 'include',
                method: 'POST', 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            }).then((response) => response.json())
            .then((json) => {
                console.log('updated')
                console.log(json)
                user.token = json.expoToken
                setUser({ ...user })
            })
            .catch((error)=> console.error(error));
        }

        await fetch(awsDbAPI.userGet + user.id, {
            credentials: 'include',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json', 
            },
        }).then(response => response.json())
        .then((json) => { 
            if(json.error){ //User not found
                addUser(user);
            } else {
                user.info = json.info
                user.beacon = json.beacon
                setUser({ ...user });
                if(json.expoToken !== user.token){
                    updateUserToken(user);
                }
            }
            })
        .catch(error => console.error(error));
    };

    useEffect(()=>{
        checkUser();
        if(!('notif' in user)){
            user.notif = {
                "fall": "",
                "sos": ""
            };
            setUser({ ...user })
        }
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            const data = notification.request.content.data;
            if('alert' in data){
                if(data.alert == "fall"){
                    user.notif.fall = data;
                } else {
                    user.notif.sos = data;
                }
                setUser({ ...user})
            }
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log(response.json());
            const data = response.notification.request.content.data;
            if('alert' in data){
                if(data.alert == "fall"){
                    user.notif.fall = data;
                } else {
                    user.notif.sos = data;
                }
                setUser({ ...user})
                props.navigation.navigate('Home')
            }
        });
        
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, [])

    

    function CustomDrawerContent(props) {
        return (
            <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{justifyContent: 'flex-start'}}>
                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-end', 
                            right: 0,
                            padding: 10,
                            paddingRight: 20
                        }}
                        onPress={() => props.navigation.toggleDrawer()}>
                        <Ionicons name="reorder-three" color="#5C6BC0" size={25} />
                    </TouchableOpacity>
                    <DrawerItemList {...props} />
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 0.5,
                        }}
                    />
                    <DrawerItem label="Logout" onPress={onLogoutPress} 
                        icon={({focused, color, size}) => (
                            <Ionicons size={20} color={color} name={focused ? 'log-out' : 'log-out-outline'} />
                        )} />

                </View>
            </DrawerContentScrollView>
        );
    }

    return (
        <UserContext.Provider value={userContext}>
            <Drawer.Navigator 
                initialRouteName="Home"
                // initialRouteName="Alert" //Tempt
                drawerContent={props => <CustomDrawerContent {...props} />}
                drawerContentOptions={{
                    activeTintColor: '#e91e63',
                }}
            >
                <Drawer.Screen 
                    name="Home" component={Home}
                    options={{
                        drawerIcon: ({focused, color, size}) => (
                            <Ionicons size={20} color={color} name={focused ? 'home' : 'home-outline'} />
                        )
                    }}
                />
                { user.info !== null && user.info !== "" ? (
                    <Drawer.Screen name="Alert" component={Alert} 
                        options={{
                            drawerIcon: ({focused, color, size}) => (
                                <Ionicons size={20} color={color} name={focused ? 'alert-circle' : 'alert-circle-outline'} />
                            ), 
                            title: "Alert History"
                        }}
                    />
                ):(<></>)}
            </Drawer.Navigator>
        </UserContext.Provider>
    )
}