import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Room1 from './room1';
import { Text, View, Button, Modal, StyleSheet, Pressable, TouchableWithoutFeedback, ScrollView, PermissionsAndroid, Platform, Vibration, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
const Tab = createBottomTabNavigator();
const tTab = createMaterialTopTabNavigator();
import CButton from '../../components/Button';
import Room from './Room';
import { useLogin } from '../../context/LoginProvider';
import client from '../../api/client';
import UserProfile from '../auth/UserProfile';
import { Screen } from 'react-native-screens';
import { useNavigation } from '@react-navigation/native';
import messaging from "@react-native-firebase/messaging";
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import CookieManager from '@react-native-cookies/cookies';


function NotificationsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Notifications!</Text>
        </View>
    );
}

const TopTabNavigator = ({ home, hindex, room }) => {
    const [troom, setRoom] = useState(undefined);

    useLayoutEffect(() => {

    }, [])


    return (
        // <ScrollView horizontal={true}>
        // <View style={{ flex: 1 }}>
        <tTab.Navigator screenOptions={{
            tabBarItemStyle: { width: 160 },
            tabBarScrollEnabled: true,
            tabBarStyle: { backgroundColor: 'none' },
            tabBarAndroidRipple: { borderless: false },
            tabBarIconStyle: { backgroundColor: 'red' }
        }}>

            {
                room ? room.map((item, index) => {
                    return <tTab.Screen name={item.room_name} key={index} options={{}}>
                        {() => <Room room={item} />}
                    </tTab.Screen>
                }) : <tTab.Screen name='k cos phong' component={NotificationsScreen} />
            }


        </tTab.Navigator>
        // </View>
        // {/* </ScrollView> */}

    );
};

function Home({ callbackChange, route }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [hmodalVisible, sethModalVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [change, setChange] = useState(false);
    const [roomlist, setRoomList] = useState([]);
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log('lo', value);
    }, [value])
    const [items, setItems] = useState([]);
    const navigation = useNavigation();

    const { profile, lohome, setLoHome, isLoggedIn } = useLogin();
    var warningSound



    callbackChange = (flag) => {

        console.log('fl', flag);
        // if (flag == 'delete') 
        //     setIndex(index - 1);
        // }
        // if (flag == 'creat') {
        //     setIndex(index + 1);
        // }
        setChange(!change);
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            // console.warn(err);
        }
    };



    // async function smartconfigtest() {
    //   Smartconfig.start({
    //     type: 'esptouch', //or airkiss, now doesn't not effect
    //     ssid: 'wifi-network-ssid',
    //     bssid: 'filter-device', //"" if not need to filter (don't use null)
    //     password: 'wifi-password',
    //     timeout: 50000 //now doesn't not effect
    //   }).then(function (results) {
    //     //Array of device success do smartconfig
    //     console.log(results);
    //     /*[
    //       {
    //         'bssid': 'device-bssi1', //device bssid
    //         'ipv4': '192.168.1.11' //local ip address
    //       },
    //       {
    //         'bssid': 'device-bssi2', //device bssid
    //         'ipv4': '192.168.1.12' //local ip address
    //       },
    //       ...
    //     ]*/
    //   }).catch(function (error) {

    //   });

    //   Smartconfig.stop(); //interrupt task
    // }


    parentMethod = () => {
        setModalVisible(!modalVisible);
    }
    hparentMethod = () => {
        sethModalVisible(!hmodalVisible);
    }
    hHandleparentMethod = (index) => {
        setIndex(index);
    }
    useEffect(() => {
        console.log('callback')
        setChange(!change)
    }, [route.params])


    useEffect(() => {
        let res = 0;
        let rres = 0
        let rlist = [];

        let getHome = async () => {
            res = await client.get('/home/' + profile._id, {});
            // console.log('???',);

        }
        let getRoom = async (res) => {



            if (res) {
                for (let i = 0; i < res.length; i++) {
                    // console.log('res', res[]);
                    // console.log('/home/' + res[i]._id + '/room');
                    try {
                        rres = await client.get('/home/' + res[i]._id + '/room');
                        if (rres.errCode == 0) {
                            rlist[i] = rres.room;
                        }
                    } catch (error) {
                        console.log('cc', error);
                        if (error.response) {
                            console.log(error.response.status) // 401
                            console.log(error.response.data)
                            if (error.response.status == 401) {
                                rlist[i] = undefined;
                            }
                        }
                    }

                }
                console.log(rlist)
            }
        }
        getHome().then(() => {
            // setHome(res)
            setLoHome(res)
            getRoom(res).then(
                () => {
                    setRoomList(rlist);

                }
            );

        }
        );

    }, [change])

    useEffect(() => {
        if (lohome[0]) {
            let data = []
            for (let i = 0; i < lohome.length; i++) {
                data.push({ label: lohome[i].home_name, value: i })
            }
            setItems(data)
        } else {
            setItems([])
        }

    }, [lohome])

    // useEffect(() => {
    //     CookieManager.get('http://192.168.10.102')
    //         .then((cookies) => {
    //             console.log('CookieManager.geta =>', cookies['accessToken'].value);
    //         });
    //     // CookieManager.flush()
    //     //     .then((success) => {
    //     //         console.log('CookieManager.flush =>', success);
    //     //     });
    // }, [])

    return (


        <Tab.Navigator
            initialRouteName="Room1"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                headerTitle: '',

            }}
        >

            <Tab.Screen name="Home"
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Text name="home" color={color} size={size} ><Icon name="home" color={color} size={30} /> </Text>
                    ),

                    headerLeft: () => (
                        <>
                            {/* <Button
                                onPress={() => sethModalVisible(!hmodalVisible)}
                                title= ""
                            color="#fff"
                            /> */}
                            {/* <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => sethModalVisible(!hmodalVisible)}><Text>{lohome[index] && lohome[index].home_name}</Text></TouchableOpacity> */}
                            {/* {home ? () => */}
                            <DropDownPicker
                                value={value}
                                items={items}
                                open={open}
                                setValue={setValue}
                                setItems={setItems}
                                setOpen={setOpen}
                                style={{ width: 250, borderWidth: 0 }}
                                onSelectItem={async (item) => {
                                    // console.log(item);
                                    // await hparentCallback();
                                    setIndex(item.value)
                                    // hHandleparentMethod(item.value);
                                }}
                            />
                            {/* : () => <></>} */}
                        </>

                    ),
                }}
            >
                {lohome[0] ? roomlist[index] ? () => <TopTabNavigator home={lohome[index]} hindex={index} room={roomlist[index]} />
                    : () => { return <View><Text style={{ marginTop: 100, marginLeft: 130 }}>Chưa có phòng nào</Text></View> }
                    : () => { return <View style={{ marginTop: 100, marginLeft: 130 }}><Text>Chưa có ngôi nhà nào</Text></View> }}
            </Tab.Screen>

            <Tab.Screen
                name="Profile"
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Text name="account" color={color} size={size} ><Icon name="user" color={color} size={30} /> </Text>

                    ),
                    headerTitle: 'Hồ sơ người dùng'
                }}
            >
                {() => {
                    return <UserProfile navigation={navigation} key={change}></UserProfile>
                }}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default Home

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        // marginLeft: 220,
        left: 110,
        alignItems: 'center',
        marginTop: 22,
        position: 'relative'

    },
    hcenteredView: {
        flex: 0.5,
        // marginLeft: 220,
        right: 50,
        alignItems: 'center',
        marginTop: 22,
        position: 'relative',
        width: 300

    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    hmodalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        // color: 'red',
        // width: 30,
        padding: 20,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});