// import React from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
// } from '@react-navigation/drawer';

// import { Button } from 'react-native-elements';
// import Home from './components/Home';
// import Tasks from './components/Tasks';
// import { useLogin } from './context/LoginProvider';
// // import SimpleMenu from './components/PoPup';
// import CustomMenu from './screens/auth/PoPup';
// // import { MenuProvider } from 'react-native-popup-menu';
// const Drawer = createDrawerNavigator();

// const CustomDrawer = props => {

//   const { setIsLoggedIn, profile } = useLogin();
//   return (
//     <View style={{ flex: 1 }}>
//       <DrawerContentScrollView {...props}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: 20,
//             backgroundColor: '#f6f6f6',
//             marginBottom: 20,
//           }}
//         >
//           <View>
//             <Text>{profile.fullname}</Text>
//             <Text>{profile.email}</Text>
//           </View>
//           <Image
//             source={{
//               uri:
//                 profile.avatar ||
//                 'https://images.unsplash.com/photo-1624243225303-261cc3cd2fbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
//             }}
//             style={{ width: 60, height: 60, borderRadius: 30 }}
//           />
//         </View>
//         <DrawerItemList {...props} />
//       </DrawerContentScrollView>
//       <TouchableOpacity
//         style={{
//           position: 'absolute',
//           right: 0,
//           left: 0,
//           bottom: 50,
//           backgroundColor: '#f6f6f6',
//           padding: 20,
//         }}
//         onPress={() => setIsLoggedIn(false)}
//       >
//         <Text>Log Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const data = [
//   {
//     home: "Nhà 1"
//   },
//   {
//     home: "Nhà 2"
//   }

// ]
// const DrawerNavigator = () => {

//   return (
//     <Drawer.Navigator
//       options={{
//         headerShown: true,
//         headerStyle: {
//           backgroundColor: 'transparent',
//           elevation: 0,
//           shadowOpacity: 0,
//         },
//         headerTitle: '',

//       }}

//       drawerContent={props => <CustomDrawer {...props} />}
//     >
//       {
//         // console.log(data)
//         data.map(item => {
//           return <Drawer.Screen name={item.home}>
//             {() => <Home data={item.home} />}
//           </Drawer.Screen>
//         })
//       }
//       <Drawer.Screen component={Home} options={{

//         // headerRight: () => (
//         //   // <Button
//         //   //   onPress={() => alert('This is a button!')}
//         //   //   title="Open Modal"
//         //   //   color="#fff"
//         //   // />
//         //   <CustomMenu></CustomMenu>

//         // ),
//       }} name='Thêm nhà' />
//       <Drawer.Screen component={Tasks} options={{
//         headerRight: () => (
//           <Button
//             onPress={() => alert('This is a button!')}
//             title="Open Modal"
//             color="#fff"
//           />
//         ),
//       }} name='Hồ sơ' />
//     </Drawer.Navigator>
//   );
// };

// export default DrawerNavigator;
