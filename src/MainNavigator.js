import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Button, Modal, StyleSheet, Pressable, TouchableWithoutFeedback, ScrollView, PermissionsAndroid, Platform, Vibration, Alert } from 'react-native';

import AppForm from './screens/auth/AppForm';
// import ImageUpload from './components/ImageUpload';
import UserProfile from './screens/auth/UserProfile';
import { useLogin } from './context/LoginProvider';
// import DrawerNavigator from './DrawerNaviagtor';
import Home from './screens/home/Home';
import ManageHome from './screens/home/ManageHome';
import ManageRoom from './screens/home/ManageRoom';
import RoomService from './screens/home/RoomService';
import HoomService from './screens/home/HomeService';
import UserService from './screens/home/UserService';
import DeviceManage from './screens/home/device/DeviceManage';
import DeviceService from './screens/home/device/DeviceService';
import DetailsProfile from './screens/home/DetailsProfile';
import messaging from "@react-native-firebase/messaging";
import client from './api/client';
import CookieManager from '@react-native-cookies/cookies';
import { useCallback } from 'react';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
const Stack = createNativeStackNavigator();
const LoginStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen component={AppForm} name='AppForm' options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const HomeStackNavigation = ({ callbackChange }) => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name='Trang chủ' options={{ headerShown: false }} >
                {() => { return <Home callbackChange={callbackChange}></Home> }}
            </Stack.Screen> */}
            <Stack.Screen component={Home} name='Trang chủ' options={{ headerShown: false }} />

            {/* <Stack.Screen component={UserProfile} name='UserProfile' options={{ headerShown: false }} /> */}
            <Stack.Screen component={HoomService} name='Trình quản lý nhà' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={ManageHome} name='Trình quản lý nhà riêng' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={ManageRoom} name='Trình quản lý phòng' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={RoomService} name='Chỉnh sửa phòng' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={UserService} name='Quản lý người nhà' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={DeviceManage} name='Quản lý thiết bị' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={DeviceService} name='Chỉnh sửa thiết bị' screenOptions={{ headerShown: true }} />
            <Stack.Screen component={DetailsProfile} name='Thông tin người nhà' screenOptions={{ headerShown: true }} />

            {/* <Stack.Screen component={UserProfile} name='Quản lý người nhà' screenOptions={{ headerShown: true }} /> */}

        </Stack.Navigator>
    );
}

const MainNavigator = ({ callbackChange }) => {

    const { isLoggedIn, setIsLoggedIn, profile } = useLogin();
    const [data, setData] = useState();
    var warningSound
    const playSound = () => {

        warningSound = new Sound('beepwarning.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            } else {
                console.log('hello');
            }
            // loaded successfully
            console.log('duration in seconds: ' + warningSound.getDuration() + 'number of channels: ' + warningSound.getNumberOfChannels());
            warningSound.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
            // Play the sound with an onEnd callback
            warningSound.setNumberOfLoops(-1);


        });
        // 

        // warningSound.stop(() => {
        // Note: If you want to play a sound after stopping and rewinding it,
        // it is important to call play() in a callback.
        // });
    }

    useEffect(() => {
        let updateFbToken = async () => {
            if (isLoggedIn) {
                let fcmToken = await messaging().getToken();
                let res = await client.put(`/auth/updatefirebasetoken/${profile._id}`, { firebase_token: fcmToken });
                if (!res.errCode) {
                    console.log('Cập nhật firebasetoken thành công');
                } else {
                    console.log('Cập nhật lỗi', res.response.data.message);
                }
            }
        }
        updateFbToken();
    }, [isLoggedIn])
    useEffect(() => {


        // messaging().getInitialNotification((e) => {
        //     console.log('lllllll', e);
        // });
        let getmess = async () => {
            const message = await messaging().getInitialNotification();
            if (message) {
                Vibration.vibrate([100, 243, 541, 1000, 534], true);
                playSound();
                Alert.alert(message.notification.title, message.notification.body,
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                // playSound(false);
                                warningSound.stop();
                                // sound.stop();
                                Vibration.cancel();

                            }

                        }]);
            }
        }
        getmess()
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            setData(remoteMessage);
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            Vibration.vibrate([100, 243, 541, 1000, 534], true);
            playSound();

        });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('kkk');
            Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body,
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            // playSound(false);
                            warningSound.stop();
                            // sound.stop();
                            Vibration.cancel();

                        }

                    }]);
        })

    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            console.log('data', data);
            playSound();
            Vibration.vibrate([100, 243, 541, 1000, 534], true);
            Alert.alert(data.notification.title, data.notification.body,
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            // playSound(false);
                            warningSound.stop();
                            // sound.stop();
                            Vibration.cancel();

                        }

                    }]);
            warningSound.stop();
        }
    }, [data])
    // if()
    return isLoggedIn ? <HomeStackNavigation callbackChange={callbackChange} /> : <LoginStackNavigator />
    // return <StackNavigator />;

};
export default MainNavigator;
