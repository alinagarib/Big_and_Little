import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import StyledTextInput from '@components/StyledTextInput'
import StyledButton from '@components/StyledButton';
import Title from '@components/Title';
//import {validateUsername, validatePassword} from '../../../server/middleware/userValidaition';

/*
  Route: /register

  Prompts user to create their account

  CURRENTLY A PLACEHOLDER
  Incorrect import of userValidation
*/
export default function Login() {
  // States for text inputs
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Email and password validation/return errors
  //const emailValidation = validateEmail(email);
  //const passwordValidation = validatePasswords(password);
  return (
    
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Title />
      </View>
      <View style={styles.form}>
        <StyledTextInput
          field="Name"
          value={name}
          setText={setName}
          placeholder="Enter your name"
          autocorrect={false}/>
        <StyledTextInput
          field="Year"
          value={year}
          setText={setYear}
          placeholder="Enter your year"
          autocorrect={false}/>
        <StyledTextInput
          field="Email"
          value={email}
          setText={setEmail}
          placeholder="Enter your email address"
          autocorrect={false}/>
        <Text style={styles.errors}> 
          Invalid email error
        </Text>
        <StyledTextInput
          field="Password"
          value={password}
          setText={setPassword}
          placeholder="Enter your password"
          autocorrect={false}/>
        <Text style={styles.errors}> 
          Invalid password error
        </Text>
        <StyledButton text="Create Account" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'Inter',
    paddingVertical:80,
  },
  titleSection: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    flex: 1,
    padding: 20,
    gap: 15
  },
  errors: {
    color: 'red',
    marginTop: -15
  }
});