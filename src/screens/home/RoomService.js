//React Native Switch
//https://aboutreact.com/react-native-switch/

//import React in our code
import React, { useState, useEffect } from 'react';

//import all the components we are going to use
import { Switch, View, Text, SafeAreaView, StyleSheet, Button, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native';
import CustomSwitch from './CustomSwitch';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormInput from '../../components/FormInput';
import { useLogin } from '../../context/LoginProvider';
import client from '../../api/client';
// function CusModal({ tiltle }) {
//     const [modalVisible, setModalVisible] = useState(false);

//     return (

//     )
// }

export default function RoomService({ route, navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [room, setRoom] = useState({});
    const [room_name, setRomeName] = useState('');

    const { profile, lohome, setLoHome } = useLogin();

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { index, roomIndex } = route.params;
    // useEffect(() => {
    //     let getRoom = async () => {
    //         // console.log('home', home[]);
    //         // console.log('/home/' + home[i]._id + '/room');
    //         try {
    //             rres = await client.get('/home/' + lohome[index]._id + '/room');
    //             console.log('lỗi', rres)
    //             if (rres.errCode == 0) {
    //                 setRoom(rres.room)
    //                 setRomeName(room[roomIndex].room_name)
    //             }

    //         } catch (error) {
    //             console.log(error.response.status) // 401
    //             console.log(error.response.data)
    //             if (error.response.status == 401) {
    //             }
    //             // console.log(error)
    //         }

    //     }
    //     getRoom();
    // }, [lohome])
    useEffect(() => {
        let getRoom = async () => {
            // console.log('home', home[]);
            // console.log('/home/' + home[i]._id + '/room');
            try {
                rres = await client.get('/home/' + lohome[index]._id + '/room');
                console.log('lỗi', rres)
                if (rres.errCode == 0) {
                    // const prom = Promise((resolve, reject) => {
                    setRoom(rres.room)
                    // })
                    // prom.then(() => {
                    //     setRomeName(room[roomIndex].room_name)
                    // })

                }

            } catch (error) {
                // console.log(error.response.status) // 401
                // console.log(error.response.data)
                // if (error.response.status == 401) {
                // }
                console.log(error)
            }

        }
        getRoom();


    }, [lohome])
    useEffect(() => {
        if (room[roomIndex]) {
            setRomeName(room[roomIndex].room_name)
        }
    }, [room[roomIndex]])
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );
        if (room[roomIndex]) {
            setRomeName(room[roomIndex].room_name)
        }
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    // useEffect(() => {
    //     setRomeName(room.room_name)
    // }, [])






    // const backtoHomeService = () => {
    //     navigation.goBack()
    // }

    const handleOnChangeText = (value, fieldName) => {
        setRomeName(value);
    };



    const updateRoom = async () => {
        try {
            if (room_name != "") {
                let res = await client.put('/home/' + lohome[index]._id + '/room/edit/' + room[roomIndex]._id, { room_name: room_name });
                console.log('nnn', res);
                if (res.errCode == 0) {
                    Alert.alert("Thông báo", "Sửa thành công");
                    let ress = [];
                    let getHome = async () => {
                        ress = await client.get('/home/' + profile._id, {});
                    }
                    getHome().then(async () => {

                        setLoHome(ress);
                        // backtoHomeService();
                    })
                }
                else {
                    Alert.alert("Thông báo", res.errMessaging);
                }
            } else {
                Alert.alert("Thông báo", "Bạn chưa nhập thông tin")
            }

        } catch (error) {
            console.log(error.response.data);
        }
    }

    const handleCancelUpdateHomeName = () => {
        setModalVisible(!modalVisible);
        setRomeName(room[roomIndex].room_name)
    }


    const deleteRoom = async () => {
        // console.log('cl', ho)
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this room?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {

                        try {
                            let res = await client.delete('/home/' + lohome[index]._id + '/room/delete/' + room[roomIndex]._id);
                            if (res.errCode == 0) {
                                Alert.alert("Thông báo", "Xóa thành công");
                                // callbackChange('delete');
                                let ress = [];
                                let getHome = async () => {
                                    ress = await client.get('/home/' + profile._id, {});
                                }
                                // let re = async () => {
                                // }
                                getHome().then(async () => {
                                    // setFHome(res)
                                    let t = new Promise(async (resolve, reject) => {

                                        resolve(true)
                                    })
                                    t.then(() => {
                                        handleBackToManageHome();
                                        setLoHome(ress);

                                        // re().then(() => {

                                        // })
                                    })

                                })
                            } else {
                                Alert.alert("Thông báo", res.errMessaging);
                            }


                        } catch (error) {
                            console.log(error);
                            // if (error.response.status == 404) {

                            console.log(error.response.data);
                            // }
                        }
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );

    }

    const handleBackToManageHome = () => {
        navigation.goBack();
    }

    const toDeviceManage = () => {
        navigation.push('Quản lý thiết bị', {
            index: index,
            roomIndex
        })
    }
    return (
        <View style={styles.container}

        >
            {/* Modal sửa tên phòng */}
            <Modal
                // animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleCancelUpdateHomeName}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Đặt tên phòng</Text>
                                <TextInput
                                    editable
                                    // multiline
                                    // numberOfLines={4}
                                    maxLength={40}
                                    value={room_name}
                                    onChangeText={value => handleOnChangeText(value, 'user_name')}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelUpdateHomeName}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={updateRoom}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>

            {/* <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalAddVisible(true)}>
                <Text style={styles.textStyle}>{ }</Text>
            </Pressable> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Tên phòng
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                    {room[roomIndex] && <Text style={styles.button}>{room[roomIndex].room_name} <Icon name="chevron-right" color="white" /></Text>}
                </TouchableOpacity>
            </View>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Tổng số thiết bị
                </Text>
                <TouchableOpacity>
                    <Text style={styles.buttonv2}>Số thiết bị</Text>
                </TouchableOpacity>
            </View> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Quản lý thiết bị
                </Text>
                <TouchableOpacity onPress={toDeviceManage}>
                    <Text style={styles.button}><Icon name="chevron-right" color="white" /> </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonx} onPress={deleteRoom} >
                <Text>Xóa phòng</Text>
            </TouchableOpacity>
        </View >


    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: '#ecf0f1',
    },
    content: {
        // marginHorizontal: 20,
        fontSize: 15,
        // marginVertical: 15,
        margin: 15,

    },
    buttonx: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        width: 390,
        padding: 10,
        // marginTop: 16
    },
    button: {
        fontSize: 15,
        // marginVertical: 15,
        margin: 15,
        // marginLeft: 150
    },
    centeredView: {
        // display: 'none',
        // flex: 1,
        // justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: 1000
        // alignItems: 'center',
        // marginTop: 22,
        // backgroundColor: 'red'

    },
    modalView: {
        marginTop: 595,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent: 'space-between',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewv2: {
        marginTop: 340,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent: 'space-between',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalAddView: {
        marginTop: 545,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent: 'space-between',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalAddViewv2: {
        marginTop: 290,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        justifyContent: 'space-between',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonv2: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },

    buttonOK: {
        width: 120,
        height: 40,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange'
    },
    buttonCC: {
        width: 120,
        height: 40,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey'
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
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
        width: 300
    }
});
