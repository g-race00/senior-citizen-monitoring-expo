import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 20,
        marginTop: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        padding: 20,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    msgText:{
        fontSize: 15,
        fontWeight: "bold",
        color: "grey",
        textAlign: 'center',
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
})