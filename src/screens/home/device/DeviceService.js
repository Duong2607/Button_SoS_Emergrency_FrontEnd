//React Native Switch
//https://aboutreact.com/react-native-switch/

//import React in our code
import React, { useState, useEffect, cloneElement, useLayoutEffect } from 'react';

//import all the components we are going to use
import { Switch, View, Text, SafeAreaView, StyleSheet, Button, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import client from '../../../api/client';
import { useLogin } from '../../../context/LoginProvider';
import { Dropdown } from 'react-native-element-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';

// function CusModal({ tiltle }) {
//     const [modalVisible, setModalVisible] = useState(false);

//     return (

//     )


// }

export default function DeviceService({ route, navigation }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddressVisible, setModalAddressVisible] = useState(false);
    const [modalChRoomVisible, setModalChRoomVisible] = useState(false);
    const [newChRoom, setnewChRoom] = useState(null);
    const [items, setItems] = useState([]);

    // const [home_name, setHomeName] = useState('');
    // const [address, setHomeAddress] = useState('');
    const [deviceInfo, setDeviceInfo] = useState({
        rid: '',
        device_name: '',
        mac_address: '',
    });
    const { device_name, mac_address } = deviceInfo
    const [room, setRoom] = useState([]);
    const [device, setDevice] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { deviceIndex, index, roomIndex } = route.params;
    const { profile, lohome, setLoHome } = useLogin();

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

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {

        let getRoom = async () => {
            // console.log('home', home[]);
            // console.log('/home/' + home[i]._id + '/room');
            try {
                rres = await client.get('/home/' + lohome[index]._id + '/room');
                console.log('lỗi', rres)
                if (rres.errCode == 0) {
                    setRoom(rres.room)
                    // let cldata = [];

                    // setItems(cldata);
                }

            } catch (error) {
                if (error.response) {
                    console.log(error.response.status) // 401
                    console.log(error.response.data)
                    if (error.response.status == 401) {
                    }
                }

                // console.log(error)
            }

        }
        getRoom()
        // .then((e) => {

    }, [lohome])

    useEffect(() => {
        let getDevice = async () => {
            try {
                rres = await client.get('/device/' + room[roomIndex]._id);

                setDevice(rres)
                // }

            } catch (error) {
                if (error.response) {
                    console.log(error.response.status) // 401
                    console.log(error.response.data)
                    setDevice([]);
                }

                // if (error.response.status == 401) {
                // }
                // console.log(error)
            }
        }
        getDevice();

    }, [room[roomIndex]])

    // khởi tạo giá trị cho deviceinfo mỗi khi device thay đổi
    useEffect(() => {
        if (device[deviceIndex]) {
            console.log('dev', device);
            setDeviceInfo({ 'device_name': device[deviceIndex].device_name, 'mac_address': device[deviceIndex].mac_address, 'rid': room[roomIndex]._id });
        }
    }, [device[deviceIndex]])

    const handleBackToDeviceManage = () => {
        navigation.goBack();
    }

    const handleOnChangeText = (value, fieldName) => {
        setDeviceInfo({ ...deviceInfo, [fieldName]: value });
        console.log('log', deviceInfo);
    }

    useEffect(() => {
        // console.log('it', data)
        // console.log('clj', room);
        // console.log('obj', room.length)
        let cldata = [];
        let newObject;
        for (let i = 0; i < room.length; i++) {
            if (i != roomIndex) {
                newObject = { label: room[i].room_name, value: room[i]._id }
                cldata.push(newObject);
                console.log('obj', newObject)
            }
        }

        setItems(cldata);
        // console.log('vcc', data);
        //     // }
        // })
    }, [room[roomIndex]])


    const handleCancelUpdateDevice = () => {
        setModalVisible(false);
        setModalAddressVisible(false);
        setModalChRoomVisible(false);
        setDeviceInfo({ 'device_name': device[deviceIndex].device_name, 'mac_address': device[deviceIndex].mac_address, 'rid': room[roomIndex]._id });
    }

    const handleCancelUpdateHomeAddress = () => {
        setModalAddressVisible(!modalAddressVisible)
        setHomeInfo({ ...deviceInfo, ['address']: lohome[index].address });
    }

    const handleUpdateDevice = async (flag) => {
        try {
            if (device_name != "" && mac_address != "") {
                let res = await client.put('/device/' + device[deviceIndex]._id, { ...deviceInfo });
                if (res.message == 'Device updated successfully') {
                    Alert.alert("Thông báo", "Sửa thành công");
                } else {
                    Alert.alert("Thông báo", res.message);
                }
                let ress = [];
                let getHome = async () => {
                    ress = await client.get('/home/' + profile._id, {});

                }
                getHome().then(async () => {
                    setLoHome(ress);
                    setModalVisible(false);
                    setModalAddressVisible(false);
                    setModalChRoomVisible(false);
                    if (flag == 'rid') {
                        handleBackToDeviceManage();
                    }
                    // backtoHomeService();
                })
            } else {
                Alert.alert("Thông báo", "Bạn chưa nhập thông tin")

            }


        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteDevice = async () => {
        // console.log('cl', ho)
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this home?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            let res = await client.delete('/device/delete/' + device[deviceIndex]._id);
                            // if (res.status == 200)
                            Alert.alert("Thông báo", "Xóa thành công");
                            // callbackChange('delete');
                            let ress = [];
                            let getHome = async () => {
                                ress = await client.get('/home/' + profile._id, {});

                            }
                            getHome().then(async () => {
                                handleBackToDeviceManage();
                                setLoHome(ress);
                            })

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
    return (

        <View style={styles.container}

        >

            <Modal
                // animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleCancelUpdateDevice}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Đặt tên thiết bị</Text>
                                <TextInput
                                    editable
                                    // multiline
                                    // numberOfLines={4}
                                    maxLength={40}
                                    value={device_name}
                                    onChangeText={value => handleOnChangeText(value, 'device_name')}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelUpdateDevice}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={() => handleUpdateDevice('device_name')}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>
            <Modal
                // animationType="slide"
                transparent={true}
                visible={modalAddressVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalAddressVisible(!modalAddressVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleCancelUpdateDevice}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Đặt địa chỉ Mac</Text>
                                <TextInput
                                    editable
                                    // multiline
                                    // numberOfLines={4}
                                    maxLength={40}
                                    value={mac_address}
                                    onChangeText={value => handleOnChangeText(value, 'mac_address')}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelUpdateDevice}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={() => handleUpdateDevice('mac_address')}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>
            <Modal
                // animationType="slide"
                transparent={true}
                visible={modalChRoomVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalAddressVisible(!modalChRoomVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleCancelUpdateDevice}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalViewChRo}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20, }}>Đổi phòng</Text>
                                {/* {data.map((item) => {
                                    console.log("itt", item);
                                    return <Text>như lồn</Text>
                                })} */}
                                {/* <View style={{ flexDirection: 'row' }}>
                                    {room && room.map((item) => {

                                        return <TouchableOpacity onPress={() => handleOnChangeText(item._id, 'rid')} style={{ borderWidth: 1, borderColor: 'black', }}>
                                            <Text>{item.room_name}</Text>
                                        </TouchableOpacity>
                                    })}
                                </View> */}
                                {items && <DropDownPicker
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
                                        handleOnChangeText(item.value, 'rid')
                                    }
                                        // hHandleparentMethod(item.value);
                                    }
                                />}

                                {/* <TextInput
                                    onChangeText={(value) => { handleOnChangeText(value, 'rid') }}
                                    placeholder='Nhập tên phòng'
                                ></TextInput> */}
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelUpdateDevice}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={() => handleUpdateDevice('rid')}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback >

            </Modal >
            {/* <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>{ }</Text>
            </Pressable> */}
            <View View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }
            }>
                <Text style={styles.content}>
                    Tên nhà thiết bị
                </Text>
                <TouchableOpacity>
                    {device[deviceIndex] && <Text style={styles.buttonv2} onPress={() => setModalVisible(true)}>{device[deviceIndex].device_name} <Icon name="chevron-right" color="white" /></Text>}
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Địa chỉ Mac
                </Text>
                <TouchableOpacity>
                    {device[deviceIndex] && <Text style={styles.buttonv2} onPress={() => setModalAddressVisible(true)}>{device[deviceIndex].mac_address} <Icon name="chevron-right" color="white" /></Text>}

                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonx} onPress={() => setModalChRoomVisible(!modalChRoomVisible)}>
                <Text>Thay đổi phòng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonx} onPress={handleDeleteDevice}>
                <Text  >Xóa thiết bị</Text>
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
        marginTop: 20
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
    modalViewChRo: {
        // height: 500,
        marginTop: 50,
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
    modalView: {
        // height: 500,
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
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        width: 300
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});











