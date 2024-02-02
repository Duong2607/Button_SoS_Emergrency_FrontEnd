//React Native Switch
//https://aboutreact.com/react-native-switch/

//import React in our code
import React, { useState, useEffect } from 'react';

//import all the components we are going to use
import { Switch, View, Text, SafeAreaView, StyleSheet, Button, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import CustomSwitch from './CustomSwitch';
import { Pressable } from 'react-native';
import { useLogin } from '../../context/LoginProvider';
import client from '../../api/client';
import Icon from 'react-native-vector-icons/FontAwesome';

const myIcon = <Icon name="rocket" size={30} color="#900" />;
// function CusModal({ tiltle }) {
//     const [modalVisible, setModalVisible] = useState(false);

//     return (

//     )
// }

export default function ManageRoom({ route, navigation }) {
    const { profile, lohome, setLoHome } = useLogin();
    const [modalVisible, setModalVisible] = useState(false);
    const [room, setRoom] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [newRoom, setNewRoom] = useState('');
    const { hid, callbackChange, index } = route.params;
    const toRoomService = (roomIndex) => {
        navigation.navigate("Chỉnh sửa phòng", {
            index: index,
            roomIndex
        })
    }

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

    }, [])

    useEffect(() => {
        let getRoom = async () => {
            // console.log('home', home[]);
            // console.log('/home/' + home[i]._id + '/room');
            try {
                rres = await client.get('/home/' + lohome[index]._id + '/room');
                console.log('lỗi', rres)
                if (rres.errCode == 0) {
                    setRoom(rres.room)
                }

            } catch (error) {

                if (error.response) {
                    console.log(error.response.status) // 401
                    console.log(error.response.data)
                }
                setRoom([])
                // console.log(error)
            }

        }
        getRoom();
    }, [lohome])

    const addNewRoom = async () => {

        try {
            if (newRoom != '') {
                let res = await client.post("home/" + lohome[index]._id + "/room/creat", { home_id: lohome[index]._id, room_name: newRoom })
                if (res == "Create room successfully") {
                    Alert.alert("Thông báo", "Tạo thành công");
                    let ress = [];
                    let getHome = async () => {
                        ress = await client.get('/home/' + profile._id, {});
                    }
                    getHome().then(async () => {
                        setLoHome(ress);
                        // backtoHomeService();
                    })
                    setModalVisible(!modalVisible);
                } else {
                    console.log(res)
                }
            } else {
                Alert.alert("Thông báo", "Bạn nhập thiếu thông tin");

            }


        } catch (error) {
            console.log(error.response.data)
        }
    }

    const handleCancelAddRoom = () => {
        setModalVisible(!modalVisible);
        setNewRoom('');
    }

    const handleOnChangeText = (value, fieldName) => {
        // setHomeInfor({ ...homeInfor, [fieldName]: value });
        setNewRoom(value);
    };
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
                <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Tạo phòng mới</Text>
                                <TextInput
                                    editable
                                    placeholder='tên phòng'
                                    maxLength={40}
                                    onChangeText={value => handleOnChangeText(value)}
                                    style={styles.input}
                                />

                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={() => setModalVisible(!modalVisible)}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={() => { addNewRoom() }}>
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
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>{ }</Text>
            </Pressable> */}

            {room.map((item, index) => {
                return <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }} key={item._id}>
                    <Text style={styles.content}>
                        {item.room_name}
                    </Text>
                    <TouchableOpacity onPress={() => toRoomService(index)}>
                        <Text style={styles.button}><Icon name="chevron-right" color="white" /> </Text>
                    </TouchableOpacity>
                </View>
            })}
            <TouchableOpacity style={styles.buttonx} onPress={() => setModalVisible(true)} >
                <Text  >Thêm phòng mới</Text>
            </TouchableOpacity>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: '#ecf0f1',
    },
    buttonx: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        width: 390,
        padding: 10,
    },
    content: {
        // marginHorizontal: 20,
        fontSize: 15,
        // marginVertical: 15,
        margin: 15,

    },
    button: {
        fontSize: 15,
        // marginVertical: 15,
        margin: 15,
        marginLeft: 150
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
