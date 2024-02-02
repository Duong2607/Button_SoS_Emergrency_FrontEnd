import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
// import { Entypo } from "@expo/vector-icons";
import {
    Block,
    Mute,
    Follow,
    Why,
    Question,
    NotInterested,
} from "./CustomContents";

const Divider = () => <View style={styles.divider} />;
const CustomMenu = () => {

    return (
        <MenuProvider style={styles.container}>
            <Menu>
                <MenuTrigger
                    customStyles={{
                        triggerWrapper: {
                            top: -20,
                        },
                    }}
                >
                    {/* <Entypo name="dots-three-horizontal" size={24} color="black" /> */}
                    <Entypo name="plus" size={35} color="black" />

                </MenuTrigger>
                <MenuOptions
                    customStyles={{
                        optionsContainer: {
                            borderRadius: 10,
                            marginVertical: 0,
                            // marginLeft: 100,
                            // marginHorizontal: ,
                            // display: "flex"
                        },
                    }}
                >
                    <NotInterested
                        text="Thêm thiết bị"
                        value="Not Interested"
                        iconName="emoji-sad"
                    />
                    <Divider />
                    <Block text="Block" value="Block" iconName="block" />
                    <Divider />
                    <Mute text="Mute" value="Mute" iconName="sound-mute" />
                    <Divider />
                    <Follow text="Follow" value="Follow" iconName="user-follow" />
                    <Divider />
                    <Why text="Why this ad?" value="why this ad" iconName="question" />
                    <Divider />
                    <Question
                        text="Report this ad"
                        value="Report this ad"
                        iconName="flag"
                    />
                </MenuOptions>
            </Menu>
        </MenuProvider>
    );
};

export default CustomMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "black",
        marginVertical: 350,
        // marginHorizontal: 100,
        height: 100,
        width: 370,
        // display: "none"
        // zIndex: 100000,
        left: 330,
        // right: 100,
        top: 370
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#7F8487",
    },
});