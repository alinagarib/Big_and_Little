import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert, View, Text, Pressable, StyleSheet } from 'react-native';

import { Link, router } from 'expo-router';
import Constants from "expo-constants";

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput';
import StyledButton from '@components/StyledButton';

/*
  Route: /login

  Prompts user to login
*/
export default function Login() {
  // Used for styling forgot password
  const [forgotPressed, setForgotPressed] = useState(false);
  // States for text inputs
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  // Method to POST inputted data to /login server route
  const loginUser = () => {
    const payload = {
      userID: userID,
      password: password
    }

    // Get IP that Expo server is using to host app, allows to connect with the backend
    const URI = Constants.expoConfig.hostUri.split(':').shift();

    // POST to /login with payload
    fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      if (!res.ok) { // Login failed
        res.text().then(text => {
          /*
            Display alert to user with error message
            TODO: Create custom styled alert?
          */
          Alert.alert('', text, [{
            text: 'OK',
            style: 'cancel'
          }]);

          // Clear text inputs
          setUserID('');
          setPassword('');
        });
      } else {
        /*
          Login successful, navigate to /home page
          TODO: Create /home page
        */
        router.navigate('/home');
      }
    });
  }

  // TODO: Need to implement forgot password
  const forgotPassword = () => {

  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.titleSection}>
          <Title />
        </View>
        <View style={styles.form}>
          <StyledTextInput
            field="Username/Email"
            value={userID}
            setText={setUserID}
            placeholder="albert/albert@ufl.edu"
            autoComplete="username"
            autoCorrect={false}
            required />
          <StyledTextInput
            field="Password"
            value={password}
            setText={setPassword}
            placeholder="supersecretpassword"
            autoComplete="current-password"
            autoCorrect={false}
            required
            secureTextEntry={true} />
          <StyledButton text="Sign In" onClick={loginUser} />
          <View style={styles.bottom}>
            <Pressable
              style={forgotPressed && { backgroundColor: 'lightgrey' }}
              onPressIn={() => setForgotPressed(true)}
              onPressOut={() => setForgotPressed(false)}
              onPress={() => forgotPassword()}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>
            <Link href='/register' style={styles.create}>Create an account</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    paddingTop: 40
  },
  titleSection: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    height: '50%',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    borderRadius: 4,
    padding: 20,
    gap: 30
  },
  bottom: {
    marginTop: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgot: {
    textDecorationLine: 'underline',
    fontSize: 15
  },
  create: {
    textDecorationLine: 'underline',
    fontSize: 15
  }
});