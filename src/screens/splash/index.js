import { View, Text, ImageBackground } from "react-native";
import React from "react";

const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};

export default function SplashScreen({navigation}) {
    setTimeout(() => {
        navigation.navigate('SiginIn');
    },2000)
    return (
        <ImageBackground 
        source={image} 
        resizeMode="cover" 
        style={{flex: 1}}>
        <Text
        style={{
            fontSize: 25,
            color: 'white',
            fontWeight: 'bold'
        }}>Ecommerce App</Text>
        </ImageBackground>
    ) 
}  