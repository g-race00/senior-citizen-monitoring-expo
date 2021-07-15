import 'react-native-gesture-handler';
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, RegistrationScreen, MainScreen } from './src/screens'
import { firebase } from './src/firebase/config'
import { awsDbAPI } from './src/aws/api';

import { AuthContext } from './src/context/AuthContext'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

// Ignore AlarmManager in Timing in Android [Caused by API subscription, for both AWS n Google]
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['expo-permissions']);
LogBox.ignoreLogs(['Unable to activate keep awake']);

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
            registerForPushNotificationsAsync(userData);
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });

    registerForPushNotificationsAsync(user);
    return () => {}
  }, [])

  const registerForPushNotificationsAsync = async (user) => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (token) {
      if(user !== null && user !== ''){
        const res = await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({token}, {merge: true})
        user.token = token;
        setUser({ ...user })

        let params = {
          userId: user.id,
          expoToken: token,
        };
    
        await fetch(awsDbAPI.userToken + user.id, {
            credentials: 'include',
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((response) => response.json())
        .then((json) => {
            user.token = json.expoToken
            setUser({ ...user })
        })
        .catch((error)=> console.error(error));
      }
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  const authContext = useMemo( () => ({
    signIn: async data => {
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then((response) => {
          const uid = response.user.uid
          const usersRef = firebase.firestore().collection('users')
          usersRef
            .doc(uid)
            .get()
            .then(firestoreDocument => {
              if (!firestoreDocument.exists) {
                alert("User does not exist anymore.")
                return;
              }
              const userData = firestoreDocument.data()
              setUser(userData)
              registerForPushNotificationsAsync(userData)
            })
            .catch(error => {
              alert(error)
            });
        })
        .catch(error => {
          alert(error)
        })
    },
    signOut: () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          setUser(null)
        })
        .catch((error) => {
          alert(error)
        })
    },
    signUp: async data => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((response) => {
          const uid = response.user.uid
          const userData = {
            id: uid,
            email: data.email,
            fullName: data.fullName,
          };
          const usersRef = firebase.firestore().collection('users')
          usersRef
            .doc(uid)
            .set(userData)
            .then(() => {
              setUser(userData)
              registerForPushNotificationsAsync(userData)
            })
            .catch((error) => {
              alert(error)
            });
        })
        .catch((error) => {
          alert(error)
        });
    },
  }),[]);

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          { user ? (
            <Stack.Screen name="Main">
              {props => <MainScreen {...props} extraData={user} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen}/>
              <Stack.Screen name="Registration" component={RegistrationScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}