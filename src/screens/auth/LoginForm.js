import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Modal, Keyboard, Alert, AppState } from 'react-native';
import client from '../../api/client';
import { useLogin } from '../../context/LoginProvider';
import { isValidEmail, isValidObjField, updateError } from '../../utils/methods';

import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import FormSubmitButton from '../../components/FormSubmitButton';

const LoginForm = () => {
    const { setIsLoggedIn, setProfile } = useLogin();
    const [userInfo, setUserInfo] = useState({
        user_name: '',
        password: '',
    });
    const [userChInfo, setUserChInfo] = useState({
        user_name: '',
        email: '',
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalChangeVisible, setModalChangeVisible] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [error, setError] = useState('');
    const [checkOtp, setCheckOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpTime, setOtpTime] = useState(120);

    const [newPassword, setNewPassword] = useState('');
    const { user_name, password } = userInfo;

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

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

    const isValidForm = () => {
        if (!isValidObjField(userInfo))
            return updateError('Required all fields!', setError);
        return true;
    };

    const submitForm = async () => {
        if (isValidForm()) {
            try {
                const res = await client.post('/auth/login', { ...userInfo });
                console.log(res)
                if (res.user) {
                    setUserInfo({ user_name: '', password: '' });
                    setProfile(res.user);
                    setIsLoggedIn(true);
                } else {
                    // console.log('e', res.response.data);
                    updateError(res.response.data, setError);
                }

                // console.log();
            } catch (error) {
                console.log('eee', error.response.data);
                updateError(error.response.data, setError);
            }
        }
    };

    const handleOnChangePasswordText = (value, fieldName) => {
        setUserChInfo({ ...userChInfo, [fieldName]: value });
    };

    const handleOnChangeSecPasswordText = (value, fieldName) => {
        setOtp(value);
    };

    const handleOnChangeFinPasswordText = (value, fieldName) => {
        setNewPassword(value);
    };

    const handleFirstChangePassword = async () => {
        try {
            let res = await client.post('/auth/preforgotpassword', { ...userChInfo })
            if (res.errMessaging == "Send Succesffuly") {

                setModalVisible(false);
                setModalChangeVisible(true);
            } else {
                console.log(res.response.data);
                Alert.alert("Thông báo", res.response.data.error);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleSecChangePassword = async () => {
        try {
            let res = await client.post('/auth/nextforgotpassword', { otp: otp })
            if (res.errMessaging == "Correct OTP") {
                setCheckOtp(true);

            } else {
                console.log(res.response.data);
                Alert.alert("Thông báo", res.response.data.errMessaging);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleFinChangePassword = async () => {
        try {
            let res = await client.post('/auth/finalforgotpassword', { newPassword })
            if (res.errMessaging == "Get Successfully Password") {
                Alert.alert("Thông báo", "Lấy mật khẩu thành công");
                handleCancelChangePass();

            } else {
                console.log(res.response.data);
                Alert.alert("Thông báo", res.response.data.errMessaging);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleCancelChangePass = async () => {
        setModalChangeVisible(false);
        setModalVisible(false);
        setUserChInfo([]);
        setCheckOtp(false);
        setOtp(0);
    }



    return (
        <FormContainer>

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
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Lấy lại mật khẩu</Text>

                                <TextInput
                                    editable
                                    placeholder='Tên đăng nhập'
                                    onChangeText={value => handleOnChangePasswordText(value, 'user_name')}

                                    // onChangeText={value => handleOnChangeText(value, 'home_name')}
                                    style={styles.input}
                                />
                                <TextInput
                                    editable
                                    placeholder='Email tài khoản'
                                    onChangeText={value => handleOnChangePasswordText(value, 'email')}

                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelChangePass}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={handleFirstChangePassword}>
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
                visible={modalChangeVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalChangeVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={handleCancelChangePass}>

                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={isKeyboardVisible ? styles.modalViewv2 : styles.modalView}>
                                <Text style={{ height: 30, fontSize: 22, marginBottom: 20 }}>Lấy lại mật khẩu</Text>
                                {checkOtp ? <TextInput
                                    editable
                                    placeholder='Mật khẩu mới'
                                    maxLength={40}
                                    onChangeText={value => handleOnChangeFinPasswordText(value, 'address')}
                                    style={styles.input}
                                    secureTextEntry
                                /> : <><Text>Kiểm tra Email để lấy mã xác nhận <></></Text>
                                    <TextInput
                                        editable
                                        placeholder='Mã xác nhận'
                                        onChangeText={value => handleOnChangeSecPasswordText(value, 'home_name')}
                                        style={styles.input}
                                    />
                                    <TouchableOpacity style={{ marginTop: 15 }} onPress={handleFirstChangePassword}><Text>Gửi lại OTP</Text></TouchableOpacity>
                                </>}

                                <View style={{ flexDirection: 'row', width: 300, height: 50, marginTop: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.buttonCC} onPress={handleCancelChangePass}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonOK} onPress={checkOtp ? handleFinChangePassword : handleSecChangePassword}>
                                        <Text>OK</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal >
            {
                error ? (
                    <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }} >
                        {error}
                    </Text >
                ) : null}
            <FormInput
                value={user_name}
                onChangeText={value => handleOnChangeText(value, 'user_name')}
                label='Tên đăng nhập'
                placeholder='tên đăng nhập của bạn'
                autoCapitalize='none'
            />
            <FormInput
                value={password}
                onChangeText={value => handleOnChangeText(value, 'password')}
                label='Password'
                placeholder='********'
                autoCapitalize='none'
                secureTextEntry
            />
            <TouchableOpacity style={{ marginBottom: 18 }} onPress={() => { setModalVisible(true) }}><Text>Quên mật khẩu?</Text></TouchableOpacity>
            <FormSubmitButton onPress={submitForm} title='Login' />
        </FormContainer >

    );
};

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

export default LoginForm;
