
import React, { useEffect, useState } from 'react';
// import SplashScreen from './src/screens/splash';
import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SigninInScreen from './src/screens/auth';
import messaging from "@react-native-firebase/messaging";
import { Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, View, PermissionsAndroid, Platform, Vibration, RefreshControl } from 'react-native';
// import React from 'react';
import CookieManager from '@react-native-cookies/cookies';
import MainNavigator from './src/MainNavigator';
import LoginProvider from './src/context/LoginProvider';
import { jwtDecode } from "jwt-decode";
import { useLogin } from './src/context/LoginProvider';
import { refresh } from '@react-native-community/netinfo';
// var Sound = require('react-native-sound');
// Sound.setCategory('Playback');
// import { memo } from 'react';
const KeyboardAvoidingComponent = ({ children }) => {

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};



const App = () => {
  // const {getExpirationTime} = firebase.messaging();
  const [change, setChange] = useState(false);
  const [sound, setSound] = useState(false);
  // const { isLoggedIn, setIsLoggedIn } = useLogin();

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     // const owner = JSON.parse(remoteMessage.data.owner);
  //     // const user = JSON.parse(remoteMessage.data.user);
  //     // const picture = JSON.parse(remoteMessage.data.picture);
  //     if (isLoggedIn) {
  //       console.log(`The user`, remoteMessage);

  //     } else {
  //       console.log(`The userrrrr`, remoteMessage);

  //     }
  //   });

  //   return unsubscribe;
  // }, []);
  // var warningSound
  // const playSound = () => {

  //   warningSound = new Sound('beepwarning.mp3', Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log('failed to load the sound', error);
  //       return;
  //     } else {
  //       console.log('hello');
  //     }
  //     // loaded successfully
  //     console.log('duration in seconds: ' + warningSound.getDuration() + 'number of channels: ' + warningSound.getNumberOfChannels());
  //     warningSound.play((success) => {
  //       if (success) {
  //         console.log('successfully finished playing');
  //       } else {
  //         console.log('playback failed due to audio decoding errors');
  //       }
  //     });
  //     // Play the sound with an onEnd callback
  //     warningSound.setNumberOfLoops(-1);


  //   });
  //   // 

  //   // warningSound.stop(() => {
  //   // Note: If you want to play a sound after stopping and rewinding it,
  //   // it is important to call play() in a callback.
  //   // });
  // }


  // callbackChange = (flag) => {

  //   console.log('fl', flag);
  //   // if (flag == 'delete') 
  //   //     setIndex(index - 1);
  //   // }
  //   // if (flag == 'creat') {
  //   //     setIndex(index + 1);
  //   // }
  //   setChange(!change);
  // }

  // const requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: 'Cool Photo App Camera Permission',
  //         message:
  //           'Cool Photo App needs access to your camera ' +
  //           'so you can take awesome pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the camera');
  //     } else {
  //       console.log('Camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };


  // useEffect(() => {

  //   // requestCameraPermission();
  //   pushNotification();
  //   if (isLoggedIn) {
  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       console.log('FCM say: ', JSON.stringify(remoteMessage));
  //       playSound();
  //       Vibration.vibrate([100, 243, 541, 1000, 534], true);
  //       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage),
  //         [
  //           {
  //             text: 'OK',
  //             onPress: async () => {
  //               // playSound(false);
  //               warningSound.stop();
  //               // sound.stop();
  //               Vibration.cancel();

  //             }

  //           }]);
  //     });
  //     messaging().onNotificationOpenedApp(() => {
  //       warningSound.stop();
  //     })
  //     messaging().setBackgroundMessageHandler(async remoteMessage => {
  //       console.log('HEADLESS BACKGROUND: ' + JSON.stringify(remoteMessage));
  //       // while (true) {
  //       playSound();
  //       // }

  //     });

  //   }


  // }, [isLoggedIn]);

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

  // async function pushNotification() {
  //   let fcmToken = await messaging().getToken();

  //   if (fcmToken) {
  //     console.log('Thời gian tạo mã đăng ký FCM:', fcmToken);


  //     //   const tokenCreationTime = await messaging().getAPNSTokenCreationDate(fcmToken);
  //     console.log('Thời gian tạo mã đăng ký FCM:', fcmToken.expiresAt);
  //   }

  // }
  const [refresh, setRefresh] = useState(false);
  const pullSC = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false)
    }, 1000)
  }

  return (
    <LoginProvider >

      <KeyboardAvoidingComponent>


        <NavigationContainer key={change} >
          {/* <Stack.Navigator options={{ headerShown: false }} initialRouteName="Welcome">
          <Stack.Screen component={AppForm} name='AppForm' />
          <Stack.Screen component={ImageUpload} name='ImageUpload' />
          <Stack.Screen component={UserProfile} name='UserProfile' />
        </Stack.Navigator> */}

          <MainNavigator callbackChange={this.callbackChange}></MainNavigator>
        </NavigationContainer>

      </KeyboardAvoidingComponent>

    </LoginProvider >
  );
}

// useEffect(() => {
//   const checkNetworkStatus = async () => {
//     const state = await NetInfo.fetch();
//     if (state.isConnected) {
//       // Thực hiện ping tới các địa chỉ IP cụ thể ở đây
//       console.log('Mạng đã kết nối');
//     } else {
//       console.log('Mạng không kết nối');
//     }
//   };
//   checkNetworkStatus();
// }, []);

// return (
//   <View>
//     <Text>Check the console for network status.</Text>
//   </View>
// );

//   const [devices, setDevices] = useState([]);

//   useEffect(() => {
//     NetInfo.isConnected().then(isConnected => {
//       if (isConnected) {
//         // Ping đến tất cả các thiết bị trong mạng
//         NetInfo.getDevices().then(devices => {
//           setDevices(devices);
//         });
//       }
//     });
//   }, []);

//   return (
//     <div>
//       {devices.length > 0 &&
//         devices.map(device => (
//           <p key={device.address}>{device.address}</p>
//         ))}
//     </div>
//   );

// };

export default App;
