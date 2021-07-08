import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styles from '../../../styles/empty';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyScreen({ navigation }) {

    const onAddButtonPress = () => {
        navigation.navigate('Create')
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="podium" color="#788eec" size={65} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.msgText}>
                    No information found!
                    {"\n"}
                    Please add target and location! 
                </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
    )
}