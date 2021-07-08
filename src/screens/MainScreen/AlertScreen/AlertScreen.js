import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../../styles/login';
import { firebase } from '../../../firebase/config'

export default function AlertScreen({ navigation }) {

    console.log('alert page');

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Welcome! <Text style={styles.headerLink}>to Alert!</Text></Text>
            </View>
        </View>
    )
}