import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import CookieManager from '@react-native-cookies/cookies';
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
// const jwt = require("jsonwebtoken");

// import { Cookie } from '@react-native-cookies/cookies';
const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [test, setTest] = useState(false);
  const [lohome, setLoHome] = useState([]);


  // await CookieManager.get('http://192.168.10.102')
  // .then((cookies) => {

  //   console.log('CookieManager.getaaaaaa =>', cookies);
  //   if (cookies.accessToken.value) {
  //     // const token = "eyJ0eXAiO.../// jwt token";
  //     console.log('cook', cookies['accessToken'].value);
  //     const decoded = jwtDecode(cookies['accessToken'].value);

  useEffect(() => {
    const getCookie = async () => {
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NTRhZjEyZTdlYTg4Y2NhZmE4Y2M5YTMiLCJ1c2VyX25hbWUiOiJ0ZCIsImlhdCI6MTcwNjM2NjgxMywiZXhwIjoxNzA2MzY4NjEzfQ.IdZDv5fLSDJo8H0ZMc_yNJOpyCOt_PLfgxxMGLE1_TM';

      await CookieManager.get('http://192.168.1.64')
        .then((cookies) => {

          console.log('CookieManager.getaaaaaa =>', cookies.accessToken);
          if (cookies.accessToken)
            if (cookies.accessToken.value) {
              console.log(cookies.accessToken.value);
              // const token = "eyJ0eXAiO.../// jwt token";
              // console.log('cook', cookies.accessToken.value);
              const decoded = jwtDecode(cookies.accessToken.value);
              // console.log('ded', de);
              // const decoded = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NTRhZjEyZTdlYTg4Y2NhZmE4Y2M5YTMiLCJ1c2VyX25hbWUiOiJ0ZCIsImlhdCI6MTcwNjM2NjgxMywiZXhwIjoxNzA2MzY4NjEzfQ.IdZDv5fLSDJo8H0ZMc_yNJOpyCOt_PLfgxxMGLE1_TM';
              // jwt.verify(decoded, process.env.JWT_ACCESS_KEY, (err, user) => {
              //   if (err) {
              //     return res.status(403).json("Token is not valid");
              //   }
              //   console.log('uuu', user);

              //   // next();
              // });
              setProfile({ _id: decoded._id, user_name: decoded.user_name })
              // console.log('deco', decoded);
              // let res = 0;
              // let getHome = async () => {
              //   res = await client.get('/home/' + decoded._id, {});

              // }
              // getHome().then(() => {
              //   // setHome(res)
              //   setLoHome(res)
              // })
              setIsLoggedIn(true);

            } else {
              setIsLoggedIn(false);
            }
        })
        .catch((err) => {
          console.log('err', err);
        })
    }
    getCookie();

  }, [])
  // const allCookies = Cookies.get();
  // console.log('cook', allCookies);
  // useEffect(() => {
  //   console.log('checl')
  //   let res = [];
  //   let getHome = async () => {
  //     if (profile._id) {
  //       res = await client.get('/home/' + profile._id, {});
  //     }

  //   }
  //   getHome().then(() => {
  //     setHome(res)
  //     console.log('plessssssss', home)
  //   })
  // }, [profile])

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile, test, setTest, lohome, setLoHome }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
