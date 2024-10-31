import React, { useState } from 'react';
import { Alert, View, Text, Pressable, StyleSheet } from 'react-native';

import { Link, router } from 'expo-router';
import Constants from "expo-constants";

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput';
import StyledButton from '@components/StyledButton';

/*
  Route: /register

  Prompts user to create their account
*/
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const registerUser = () => {
    /* if (password !== confirmPassword) {
      Alert.alert('', 'Passwords must match.', [{
        text: 'OK',
        style: 'cancel'
      }]);

      return;
    } */

    const payload = {
      username: username,
      email: email,
      password: password
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    // Get IP that Expo server is using to host app, allows to connect with the backend
    const URI = Constants.expoConfig.hostUri.split(':').shift();
    
    // POST to /register with payload
    fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/register`, requestOptions)
      .then(res => {
        if (!res.ok) { // Registration failed
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
          setUsername('');
          setEmail('');
          setPassword('');
        });
      } else {
        /*
          Registration successful, navigate to /home page
          TODO: Create /home page
        */
        Alert.alert('', 'Registration successful', [{
          text: 'OK',
          style: 'cancel'
        }]);

        router.navigate('/home');
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Title />
      </View>
      <View style={styles.form}>
        <StyledTextInput
          field="Username"
          value={username}
          setText={setUsername}
          placeholder="albert"
          autoComplete="username"
          autoCorrect={false} />
        <StyledTextInput
          field="Email"
          value={email}
          setText={setEmail}
          placeholder="albert@ufl.edu"
          autoComplete="email"
          autoCorrect={false} />
        <StyledTextInput
          field="Password"
          value={password}
          setText={setPassword}
          placeholder="supersecretpassword"
          autoComplete="current-password"
          autoCorrect={false} />
        <StyledButton text="Sign Up" onClick={registerUser} />
        <View style={styles.bottom}>
          <Link href='/login' style={styles.create}>Already have an account? Login</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    paddingVertical: 80,
  },
  titleSection: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    flex: 1,
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
