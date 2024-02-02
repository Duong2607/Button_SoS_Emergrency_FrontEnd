//React Native Switch
//https://aboutreact.com/react-native-switch/

//import React in our code
import React, { useEffect, useState } from 'react';

//import all the components we are going to use
import { Switch, View, Text, SafeAreaView, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import CustomSwitch from './CustomSwitch';
import { useLogin } from '../../context/LoginProvider';
import client from '../../api/client';
export default function Room({ room }) {
    const { lohome } = useLogin();
    const [device, setDevice] = useState([]);
    useEffect(() => {
        let getDevice = async () => {
            try {
                rres = await client.get('/device/' + room._id);

                setDevice(rres)
                console.log('llala', rres);
                // }

            } catch (error) {
                if (error.response) {
                    console.log(error.response.status) // 401
                    console.log(error.response.data)
                    setDevice(null);
                }

                // if (error.response.status == 401) {
                // }
                // console.log(error)
            }
        }
        getDevice();
    }, [room])

    return (
        <View style={styles.container}>


            {device[0] ? device.map((item) => {
                return <View style={styles.header} key={item._id}>
                    <TouchableOpacity>
                        <Text style={styles.paragraph}>
                            Thiết bị {item.device_name}

                        </Text>
                    </TouchableOpacity>

                </View >
            }) : <View style={styles.header}><Text style={styles.paragraph}>Chưa có thiết bị nào</Text></View>

            }




        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',

    },
    header: {
        marginTop: 20,
        flex: 0.1,
        backgroundColor: 'pink',
        justifyContent: 'center',
        borderRadius: 15,
        marginHorizontal: 90,
    },
    box1: {

        marginTop: 20,
        flex: 0.11,
        backgroundColor: 'pink',
        justifyContent: 'center',
    },
    light: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        flex: 0.11,
        backgroundColor: 'pink',
        alignItems: 'center',
    },
    paragraph: {

        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',

    },
    text1: {

        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        color: 'white',
        marginLeft: 20,
    },
});
