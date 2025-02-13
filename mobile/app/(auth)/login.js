import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert, View, Text, Pressable, StyleSheet } from 'react-native';

import Constants from "expo-constants";
import { Link, router } from 'expo-router';

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput';
import StyledButton from '@components/StyledButton';

import { useSession } from '@context/ctx';

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

  const { signIn } = useSession();

  // Method to POST inputted data to /login server route
  const loginUser = async () => {
    console.log("login pressed");
    const payload = {
      userID: userID,
      password: password
    };
   
    const result = await signIn(payload);

    if (!result.success) {
      Alert.alert('', result.message, [{
        text: 'OK',
        style: 'cancel'
      }]);

      // Clear text inputs
      setUserID('');
      setPassword('');
    } else {
      router.navigate('/home');
    }
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
    paddingTop: 20
  },
  titleSection: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20
  },
  form: {
    height: '60%',
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