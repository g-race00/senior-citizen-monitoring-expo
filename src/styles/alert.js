import { StyleSheet } from 'react-native';
import { max } from 'react-native-reanimated';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'flex-start',
        // backgroundColor: 'white',
        // alignItems: ''
    },
    infoContainer: {
        // margin: 20,
        marginBottom: 10,
        // borderBottomWidth: 2,
        // borderRadius: 25,
        padding: 20,
        elevation: 1,
        backgroundColor: 'white',
        borderColor: '#454555',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerView: {
        flex: 1,
        marginRight: 25,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
    },
    headerInfo: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: "normal",
        color: "grey",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    statsGroup: {
        margin: 25,
        marginTop: 10,
        marginBottom: 0,
        alignItems: "center"
    },
    statsNum: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#5C6BC0",
    },
    statsInfo: {
        fontWeight: "200" ,
        color: "grey",
    },
    listContainer: {
        flex: 1,
        backgroundColor: 'white',
        // borderRadius: 25,
        paddingTop: 10,
        paddingLeft: 15,
    },
    itemBorder: {
        padding: 10,
        borderBottomColor: '#DFDFE6',
        borderBottomWidth: 2,
        borderRadius: 5,
    },
    itemNoBorder: {
        padding: 10,
        borderRadius: 5,
    },
    itemDatetime: {
        paddingTop: 5,
        fontSize:18,
        color: '#454555'
    },
    item: {
        fontSize: 15,
        color: '#AAAABC'
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        marginTop: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    msgText:{
        fontSize: 15,
        fontWeight: "bold",
        color: "#AAAABC",
        textAlign: 'center',
    },
})