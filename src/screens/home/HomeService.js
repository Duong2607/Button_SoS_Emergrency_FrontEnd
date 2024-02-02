//React Native Switch
//https://aboutreact.com/react-native-switch/

//import React in our code
import React, { useState, useEffect, useLayoutEffect } from 'react';

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

export default function HomeService({ route, navigation }) {
    const { profile, lohome, setLoHome } = useLogin();
    const [modalVisible, setModalVisible] = useState(false);
    const [home_name, setHomeName] = useState('');
    const [fhome, setFHome] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { fullhome, callbackChange, item } = route.params;
    const [change, setChange] = useState(false);
    const [items, setItems] = useState([]);

    const [homeInfor, setHomeInfor] = useState({
        address: '',
        home_name: '',
        uid: '',
    });
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
        setHomeInfor({ ...homeInfor, 'uid': profile._id });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };

    }, []);
    useEffect(() => {

        setItems(lohome);
    }, [lohome])
    // useLayoutEffect(() => {
    //     let res = [];
    //     let getHome = async () => {
    //         res = await client.get('/home/' + profile._id, {});

    //     }
    //     getHome().then(() => {
    //         // setFHome(res)
    //         setLoHome(res);
    //         console.log('servic', lohome);
    //     })
    // }, [route.params])
    // useEffect(() => {
    //     // console.log('lohome', lohome);
    //     // let res = [];
    //     // let getHome = async () => {
    //     //     res = await client.get('/home/' + profile._id, {});

    //     // }
    //     // getHome().then(() => {
    //     //     setFHome(res)
    //     // })
    //     setChange(!change);
    // }, [lohome])
    const toManageHoom = (data, index) => {
        navigation.navigate('Trình quản lý nhà riêng', {
            home: data,
            callbackChange: callbackChange,
            index: index
        })
    }

    const toHoom = (data) => {
        navigation.push('Trang chủ', {
            item: 'test'
        })
    }
    const handleOnChangeText = (value, fieldName) => {
        setHomeInfor({ ...homeInfor, [fieldName]: value });

    };

    const addNewHome = async (uid) => {
        if (homeInfor.home_name != '' && homeInfor.uid != '' && homeInfor.address != '') {
            console.log('hnam', homeInfor.home_name)
            let res = await client.post('/home/create-home', homeInfor);
            if (res.errCode == 0) {
                Alert.alert("Thông báo", "Thành công");
                // callbackChange('creat');
                setModalVisible(!modalVisible);
                setChange(!change);
                // toHoom();
                // setHome(fhome);
                let getHome = async () => {
                    res = await client.get('/home/' + profile._id, {});

                }
                getHome().then(() => {
                    // setFHome(res)
                    setLoHome(res);

                })
            } else {
                Alert.alert("Thông báo", "Thất bại");
                setModalVisible(!modalVisible)
            }


        }
        else {
            Alert.alert("Thông báo", "Bạn nhập thiếu thông tin");
        }


    }
    const handleCancelCreatHome = () => {
        setModalVisible(false);
        setHomeInfor({ address: '', home_name: '' })
    }

    // const toUserService = () => {
    //     navigation.push('Quản lý người nhà', {
    //         room: room
    //     })
    // }

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
                <TouchableWithoutFeedback onPress={handleCancelCreatHome}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Tạo nhà mới</Text>
                                <TextInput
                                    editable
                                    placeholder='address'
                                    maxLength={40}
                                    onChangeText={value => handleOnChangeText(value, 'address')}
                                    style={styles.input}
                                />
                                <TextInput
                                    editable
                                    placeholder='tên nhà'
                                    onChangeText={value => handleOnChangeText(value, 'home_name')}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelCreatHome}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={() => { addNewHome(profile._id) }}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>
            {
                lohome.map((item, index) => {
                    // useEffect(() => {
                    //     setItems(item);
                    // }, [index])
                    return <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }} key={item._id}>
                        <Text style={styles.content}>
                            {item.home_name}
                        </Text>
                        <TouchableOpacity onPress={() => toManageHoom(items[index], index)} >
                            <Text style={styles.button} ><Icon name="chevron-right" color="white" /></Text>
                        </TouchableOpacity>
                    </View>
                })
            }
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Tên nhà riên
                </Text>
                <TouchableOpacity>
                    <Text style={styles.buttonv2} onPress={() => setModalVisible(true)}>{home.home_name} <Icon name="chevron-right" color="white" /></Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 22, borderBottomWidth: 1, borderBlockColor: 'grey' }}>
                <Text style={styles.content}>
                    Tổng số thiết bị
                </Text>
                <TouchableOpacity>
                    <Text style={styles.buttonv2}>Số thiết bị</Text>
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
                    Quản lý thiết bị
                </Text>
                <TouchableOpacity>
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
            </View> */}
            <TouchableOpacity style={styles.buttonx} onPress={() => setModalVisible(true)} >
                <Text  >Thêm nhà mới</Text>
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
    modalViewv2: {
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
