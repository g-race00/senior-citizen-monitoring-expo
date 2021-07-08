import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center'
    },
    personContainer: {
        margin: 25,
        marginBottom: 0,
        elevation: 1,
        borderRadius: 25,
        backgroundColor: '#E6F4F1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoContainer: {
        backgroundColor:'black',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        height: 100,
        width: 100,
        alignSelf: 'flex-start',
        margin: 30
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
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
    headerView: {
        flex: 1,
        marginRight: 25,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
    },
    headerName: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
    },
    headerBeacon: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: "normal",
        color: "grey",
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        padding:8,
        flexDirection: 'row',
        borderRadius: 5,
        marginBottom:10,
        marginRight:10,
        // backgroundColor: 'grey',
        alignSelf:"flex-start",
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        paddingLeft: 10,
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    }
})