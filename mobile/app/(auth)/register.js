import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Alert, View, ScrollView, StyleSheet } from 'react-native';

import { router } from 'expo-router';
import Constants from "expo-constants";

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput'
import StyledButton from '@components/StyledButton';

import { validateYear, validateUsername, validateEmail, validatePassword } from '@middleware/userValidation';

/*
  Route: /register

  Prompts user to create their account
*/
export default function Register() {
  // States for text inputs
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Method to POST inputted data to /register server route
  const createUser = () => {
    const payload = {
      name: name,
      year: year,
      username: username,
      email: email,
      password: password
    }

    // Get IP that Expo server is using to host app, allows to connect with the backend
    const URI = Constants.expoConfig.hostUri.split(':').shift();

    // POST to /login with payload
    fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/register`, {
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
          setName('');
          setYear('');
          setEmail('');
          setUsername('');
          setPassword('');
        });
      } else {
        /*
          Register successful, navigate to /login page
        */
        router.navigate('/login');
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Title />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.form}>
          <StyledTextInput
            field="Name"
            value={name}
            setText={setName}
            placeholder="Albert Gator"
            autoComplete="name"
            autocorrect={false}
            required />
          <StyledTextInput
            field="Year"
            value={year}
            setText={setYear}
            placeholder="Freshman"
            autocorrect={false}
            validate={validateYear} />
          <StyledTextInput
            field="Email"
            value={email}
            setText={setEmail}
            placeholder="albert@ufl.edu"
            autoComplete="email"
            autocorrect={false}
            validate={validateEmail} />
          <StyledTextInput
            field="Username"
            value={username}
            setText={setUsername}
            placeholder="albert"
            autoComplete="username"
            autocorrect={false}
            validate={validateUsername} />
          <StyledTextInput
            field="Password"
            value={password}
            setText={setPassword}
            placeholder="supersecretpassword"
            autoComplete="current-password"
            autocorrect={false}
            helperText="Password must be at least 8 characters"
            validate={validatePassword} />
          <StyledButton text="Create Account" onClick={createUser} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    paddingTop: 80
  },
  titleSection: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContainer: {
    height: '60%',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    borderRadius: 4,
    padding: 20,
    gap: 30
  },
  form: {
    gap: 15,
    paddingBottom: 80
  }
});
