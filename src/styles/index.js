import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    personContainer: {
        margin: 20,
        marginBottom: 0,
        elevation: 1,
        borderRadius: 25,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        height: 65,
        width: 65,
        margin: 25, 
        marginLeft:50,
        marginRight:0,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    status: {
        backgroundColor: '#E6F4F1',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headerView: {
        flex: 1,
        marginRight: 25,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
    },
    headerName: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
    },
    headerContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
    },
    headerBeacon: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: "normal",
        color: "grey",
    },
    bottomButton: {
        flex: 1,
        elevation: 1,
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
    floorplanContainer: {
        marginTop: 25,
        flexDirection: 'row'
    },
    floorplan: {
        flex: 1,
        height: 250,
        transform: [{ scale: 0.90 }]
    },
    pointerLocOne: {
        position: 'absolute',
        left: 285,
        bottom: 75,
    },
    pointerLocTwo: {
        position: 'absolute',
        left: 45,
        top: 85
    },
    liveContainer: {
        marginLeft: 25,
        flexDirection: 'row',
        justifyContent:"flex-start",
        alignItems: "center",
    },
    onlineText:{
        color: 'green'
    },
    offlineText:{
        color: '#BD4C55'
    },
    listContainer: {
        // flex: 1,
        elevation: 1,
        padding: 15,
        borderRadius: 25,
        margin:20,
        backgroundColor: 'white'
    },
    listFlexContainer: {
        flex: 1,
        elevation: 1,
        padding: 15,
        borderRadius: 25,
        margin:20,
        backgroundColor: 'white'
    },
    itemBorder: {
        // backgroundColor: 'white',
        padding: 10,
        borderBottomColor: '#DFDFE6',
        borderBottomWidth: 2,
        borderRadius: 5,
    },
    itemNoBorder: {
        padding: 10,
        borderRadius: 5,
    },
    itemGroup: {
        flexDirection: 'row',
        justifyContent:"flex-start",
        alignItems: "center",
    },
    itemDatetime: {
        paddingTop: 5,
        fontSize:18,
        color: '#454555'
    },
    item: {
        marginLeft: 5,
        fontSize: 15,
        color: '#AAAABC'
    },
    alertContainer: {
        margin: 20,
        marginBottom: -10,
        elevation: 1,
        borderRadius: 25,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    alertGroup: {
        flexDirection: 'row'
    },
    alertIcon: {
        margin: 20,
        marginRight: 0 ,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertInfoGroup: {
        flexDirection: 'column',
        margin: 25,
        marginLeft: 15
    },
    alertType: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
    },
    alertInfo:{
        fontSize: 15,
        // fontWeight: "bold",
        color: "grey",
    },
    button: {
        padding:8,
        flexDirection: 'row',
        marginRight:10,
        alignItems: "center",
        justifyContent: 'center'
    },
})