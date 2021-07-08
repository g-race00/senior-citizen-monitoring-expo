import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../../styles/login';
import { firebase } from '../../../firebase/config'

export default function HistoryScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Welcome! <Text style={styles.headerLink}>to History!</Text></Text>
            </View>
        </View>
    )
}