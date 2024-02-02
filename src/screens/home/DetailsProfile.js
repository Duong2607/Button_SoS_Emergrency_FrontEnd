import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Button, Modal, Alert } from 'react-native';
import { useLogin } from '../../context/LoginProvider';
import { TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ManageHome from '../home/ManageHome';
import client from '../../api/client';

const DetailsProfile = ({ route, navigation }) => {
    const { profile, lohome, setLoHome } = useLogin();
    const [modalVisible, setModalVisible] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const { user, owner, index } = route.params;

    const handleBackToUserService = () => {
        navigation.goBack();
    }
    const handleDeleteUser = async () => {
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
                            let res = await client.delete('home/' + lohome[index]._id + '/members/' + user._id);
                            if (res.message == "Successfully removed user from home") {
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
                                        handleBackToUserService();
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
                            if (error.response.status == 403) {
                                Alert.alert("Thông báo", error.response.data);
                            } else {
                                Alert.alert("Thông báo", "Không thành công");
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
        <View style={{ alignItems: "center" }}>
            {/* <Image source={} /> */}
            {/* <Image
                source={{ uri: '../assets/signinscreen.jpg' }}
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    marginRight: 10,
                }}
            /> */}

            <Text style={{ fontWeight: "bold", fontSize: 25 }}>Tên: {user.nickname}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>email: {user.email}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>ID: {user._id}</Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >
                {owner._id == user._id ? '' : <TouchableOpacity style={styles.button} onPress={handleDeleteUser} >
                    <Text >Xóa khỏi nhà</Text>
                </TouchableOpacity>}
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >

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
        marginTop: 470,
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
        marginTop: 215,
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

export default DetailsProfile;
