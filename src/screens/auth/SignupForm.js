import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Modal, Keyboard, Alert } from 'react-native';
import client from '../../api/client';
import { useLogin } from '../../context/LoginProvider';
import { isValidEmail, isValidObjField, updateError } from '../../utils/methods';

import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import FormSubmitButton from '../../components/FormSubmitButton';

const SignUpForm = () => {
  const { setIsLoggedIn, setProfile } = useLogin();
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    password: '',
    confirmPassword: '',
    email,
    nickname: '',
    phone_number
  });

  const [error, setError] = useState('');
  const [checkOtp, setCheckOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { user_name, password, confirmPassword, email, nickname, phone_number } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };


  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError('Required all fields!', setError);

    if (!isValidEmail(email))
      return updateError('Invalid email!', setError);

    if (password !== confirmPassword)
      return updateError('Password does not match!', setError);
    return true;
  };

  const signup = async () => {
    if (isValidForm()) {
      try {
        const res = await client.post('/auth/register', { ...userInfo });
        console.log(res)
        if (res == "Successfully") {
          updateError("Tạo tài khoản thành công", setError);
        } else {
          updateError(res.response.data.message.toString(), setError);
        }

      } catch (error) {
        console.log('eee', error.response.data);
        updateError(error.response.data, setError);
      }
    }
  };


  return (
    <FormContainer>

      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      <FormInput
        value={email}
        onChangeText={value => handleOnChangeText(value, 'email')}
        label='Email'
        placeholder='example@email.com'
        autoCapitalize='none'
      />
      <FormInput
        value={phone_number}
        onChangeText={value => handleOnChangeText(value, 'phone_number')}
        label='Điện thoại'
        placeholder='0123456789'
        autoCapitalize='none'
      />

      <FormInput
        value={user_name}
        onChangeText={value => handleOnChangeText(value, 'user_name')}
        label='Tên đăng nhập'

        autoCapitalize='none'
      />
      <FormInput
        value={nickname}
        onChangeText={value => handleOnChangeText(value, 'nickname')}
        label='Biệt Danh'
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
      <FormInput
        value={confirmPassword}
        onChangeText={value => handleOnChangeText(value, 'confirmPassword')}
        label='Nhập lại mật khẩu'
        placeholder='********'
        autoCapitalize='none'
        secureTextEntry
      />
      <FormSubmitButton onPress={signup} title='Sign Up' />
    </FormContainer>

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

export default SignUpForm;
