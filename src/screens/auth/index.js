import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";


export default function SigninInScreen() {
    return (
        <View style={{flex: 1}}>
            <View style={{flex: 0.5}}>
                <Image source={require('../../assets/signinscreen.jpg')}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                resizeMode="cover"/>
            </View>
        </View>
    ) 
}  