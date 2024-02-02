import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Button, Modal, Alert } from 'react-native';
import { useLogin } from '../../context/LoginProvider';
import { TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ManageHome from '../home/ManageHome';
import client from '../../api/client';
import messaging from "@react-native-firebase/messaging";

const UserProfile = ({ navigation }) => {
    const { profile, setIsLoggedIn } = useLogin();
    const [modalVisible, setModalVisible] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const toManageHome = () => {
        navigation.push('Trình quản lý nhà', {

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
        // setHomeInfor({ ...homeInfor, 'uid': profile._id });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };

    }, []);

    const logOut = async () => {
        let deleteFbToken = async () => {
            let resp = await client.put(`/auth/updatefirebasetoken/${profile._id}`, { firebase_token: '' });
            if (!resp.errCode) {
                console.log('Xóa Firebase Token thành công');
            } else {
                console.log('Cập nhật lỗi', resp.response.data.message);
            }
        }
        deleteFbToken();
        setIsLoggedIn(false);
        let res = await client.post('/auth/logout');
        console.log('logout', res);
    }

    const handleChangePassword = async () => {
        try {
            let res = await client.put(`auth/editPassword/${profile._id}`, password)
            if (res == 'Update Successfully') {
                console.log(res.response);
                Alert.alert('Thông báo', "Đổi mật khẩu thành công")
                handleCancelChangePass();
            } else {
                Alert.alert('Thông báo', res.response.data.error)
            }
        } catch (error) {
            if (res.response) {
                Alert.alert('Thông báo', res.response.data.error);
            }
        }
    }

    const handleCancelChangePass = () => {
        setModalVisible(false);
    }

    const handleOnChangeText = async (value, fieldName) => {
        setPassword({ ...password, [fieldName]: value });
    }

    return (
        <View style={{ alignItems: "center" }}>
            <Modal
                // animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleCancelChangePass}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Đổi mật khẩu</Text>
                                <TextInput
                                    editable
                                    placeholder='mật khẩu cũ'
                                    maxLength={40}
                                    onChangeText={value => handleOnChangeText(value, 'oldPassword')}
                                    style={styles.input}
                                    secureTextEntry

                                />
                                <TextInput
                                    editable
                                    placeholder='mật khẩu mới'
                                    onChangeText={value => handleOnChangeText(value, 'newPassword')}
                                    style={styles.input}
                                    secureTextEntry
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelChangePass}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={handleChangePassword}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>

            <Text style={{ fontWeight: "bold", fontSize: 25 }}>user name: {profile.user_name}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>ID: {profile._id}</Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >
                <TouchableOpacity style={styles.button} onPress={toManageHome} >
                    <Text >Quản lý nhà riêng</Text>
                </TouchableOpacity>

            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} >
                    <Text >Thay đổi mật khẩu</Text>
                </TouchableOpacity>

            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 450,
                }}
            >
                <TouchableOpacity style={styles.button} onPress={logOut} >
                    <Text >Log out</Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        width: 390,
        padding: 10,
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
        height: 350
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
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
        width: 300
    }
});

export default UserProfile;
