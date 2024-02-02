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
import client from '../../api/client';
import { useLogin } from '../../context/LoginProvider';
// function CusModal({ tiltle }) {
//     const [modalVisible, setModalVisible] = useState(false);

//     return (

//     )
// }

export default function ManageHome({ route, navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddressVisible, setModalAddressVisible] = useState(false);

    // const [home_name, setHomeName] = useState('');
    // const [address, setHomeAddress] = useState('');
    const [homeInfo, setHomeInfo] = useState({
        home_name: '',
        address: '',
    });
    const { home_name, address } = homeInfo
    const [room, setRoom] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { home, callbackChange, index } = route.params;
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
        let rres = 0
        setHomeInfo({ home_name: lohome[index].home_name, address: lohome[index].address });
        let getRoom = async () => {
            if (home) {
                // console.log('home', home[]);
                // console.log('/home/' + home[i]._id + '/room');
                try {
                    rres = await client.get('/home/' + home._id + '/room');
                    console.log('lỗi', rres)
                    if (rres.errCode == 0) {
                        setRoom(rres.room)
                    }
                } catch (error) {
                    if (error.response) {
                        console.log(error.response.status) // 401
                        console.log(error.response.data)
                    }

                }

            }
        }
        getRoom();
    }, []);
    const toManageRoom = () => {
        navigation.push('Trình quản lý phòng', {

            index: index

        })
    }
    const toUserService = () => {
        navigation.push('Quản lý người nhà', {
            index: index
        })
    }
    const backtoHome = () => {
        navigation.navigate("Trang chủ", { item: 'test' })
    }
    const backtoHomeService = () => {
        navigation.navigate("Trình quản lý nhà", { item: 'test' })
    }

    const handleOnChangeText = (value, fieldName) => {
        setHomeInfo({ ...homeInfo, [fieldName]: value });
    };

    const updateHome = async () => {
        try {
            if (home_name != '' && address != '') {
                let res = await client.put('/home/' + lohome[index]._id, { ...homeInfo });
                console.log('nnn', res);
                if (res.errCode == 0) {
                    // callbackChange('edit');
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
                    Alert.alert("Thông báo", res.response.data);

                }
            } else {
                Alert.alert("Thông báo", "Bạn chưa nhập thông tin")
            }
        } catch (error) {

            Alert.alert("Thông báo", error.response.data);
        }
    }

    const handleCancelUpdateHomeName = () => {
        setModalVisible(!modalVisible)
        setHomeInfo({ ...homeInfo, ['home_name']: lohome[index].home_name });

    }

    const handleCancelUpdateHomeAddress = () => {
        setModalAddressVisible(!modalAddressVisible)
        setHomeInfo({ ...homeInfo, ['address']: lohome[index].address });
    }

    const deleteHome = async () => {
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
                            let res = await client.delete('/home/delete/' + lohome[index]._id);
                            // if (res.status == 200)
                            if (res.errMessaging == "Successfully delete") {
                                Alert.alert("Thông báo", "Xóa thành công");
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
                                        backtoHomeService();
                                        setLoHome(ress)

                                        // re().then(() => {

                                        // })
                                    })

                                })
                            } else {
                                Alert.alert("Thông báo", res.response.data)
                            }
                            // callbackChange('delete');


                        } catch (error) {
                            console.log(error);
                            // if (error.response.status == 404) {
                            Alert.alert("Thông báo", error.response.data);

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

    const handleUserLeave = async () => {
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
                            let res = await client.delete('home/' + lohome[index]._id + '/remove-members/' + profile._id);
                            if (res.message == "Successfully removed user from home") {
                                Alert.alert("Thông báo", "Rời thành công");
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
                                        navigation.goBack();
                                        setLoHome(ress)

                                        // re().then(() => {

                                        // })
                                    })

                                })
                            } else {
                                Alert.alert("Thông báo", res.message);
                            }


                        } catch (error) {
                            console.log(error);
                            // if (error.response.status == 404) {
                            if (error.response) {
                                if (error.response.status == 403) {
                                    Alert.alert("Thông báo", error.response.data);
                                } else {
                                    Alert.alert("Thông báo", "Không thành công");
                                }
                            }

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
                <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Đặt tên nhà</Text>
                                <TextInput
                                    editable
                                    // multiline
                                    // numberOfLines={4}
                                    maxLength={40}
                                    value={home_name}
                                    onChangeText={value => handleOnChangeText(value, 'home_name')}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelUpdateHomeName}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={updateHome}>
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
                <TouchableWithoutFeedback onPress={() => setModalAddressVisible(!modalAddressVisible)}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Đặt địa chỉ nhà</Text>
                                <TextInput
                                    editable
                                    // multiline
                                    // numberOfLines={4}
                                    maxLength={40}
                                    value={address}
                                    onChangeText={value => handleOnChangeText(value, 'address')}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelUpdateHomeAddress}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={updateHome}>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Tên nhà riêng
                </Text>
                <TouchableOpacity>
                    <Text style={styles.buttonv2} onPress={() => setModalVisible(true)}>{lohome[index].home_name} <Icon name="chevron-right" color="white" /></Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Địa chỉ nhà riêng
                </Text>
                <TouchableOpacity>
                    <Text style={styles.buttonv2} onPress={() => setModalAddressVisible(true)}>{lohome[index].address} <Icon name="chevron-right" color="white" /></Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Quản lý các phòng
                </Text>
                <TouchableOpacity onPress={toManageRoom}>
                    <Text style={styles.button}><Icon name="chevron-right" color="white" /> </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Quản lý người nhà
                </Text>
                <TouchableOpacity onPress={toUserService}>
                    <Text style={styles.button}><Icon name="chevron-right" color="white" /> </Text>
                </TouchableOpacity>
            </View>
            {lohome[index].owner == profile._id ? '' : <TouchableOpacity style={styles.buttonle} onPress={handleUserLeave} >
                <Text  >Rời khỏi nhà</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={styles.buttonx} onPress={deleteHome} >
                <Text  >Xóa nhà</Text>
            </TouchableOpacity>

        </View>


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
        marginTop: 30
    },
    buttonle: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        width: 390,
        padding: 10,
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
