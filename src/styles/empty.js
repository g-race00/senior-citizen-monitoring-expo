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
        borderRadius: 10,
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
    bottomButton: {
        flex: 1,
        flexDirection:'row',
        position:'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#5C6BC0",
        borderRadius: 60,
        shadowOpacity: 0.5,
        shadowRadius: 1
    },
})