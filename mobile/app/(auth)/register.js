import React, { useState, useRef } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert, View, ScrollView, StyleSheet, Image } from 'react-native';

import { router } from 'expo-router';
import Constants from "expo-constants";

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput'
import StyledButton from '@components/StyledButton';

import { Picker } from '@react-native-picker/picker';

import { validateUsername, validateEmail, validatePassword } from '@middleware/userValidation';

/*
  Route: /register

  Prompts user to create their account
*/
export default function Register() {
  // States for text inputs
  const [name, setName] = useState('');
  const [year, setYear] = useState('Freshman');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for scroll fix
  const scrollViewRef = useRef(null);
  const scrollFix = useRef(false);

  // State for clearing text inputs
  const [reset, setReset] = useState(false);

  //State for Logo size
  const [logoSize, setLogoSize] = useState(150);
  const scrollThrottle = useRef(false);

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
          Alert.alert('', text, [{
            text: 'OK',
            style: 'cancel'
          }]);

          // Clear text inputs
          setReset(!reset);
        });
      } else {
        /*
          Register successful, navigate to /login page
        */
        router.push('/login');
      }
    }).catch(err => console.log(err));
  }

  // Workaround to not hide text input helper/error text
  const handleScroll = (event) => {
    if (scrollViewRef.current === undefined) return;
    if (scrollFix.current) {
      scrollFix.current = false;
    } else if (Keyboard.isVisible()) {
      const height = event.nativeEvent.contentOffset.y;
      scrollFix.current = true;
      scrollViewRef.current.scrollTo({
        x: 0,
        y: height + 50,
        animated: true
      });
    }
  }
  // Logo resizing 
  const handleScrollResize = (event) => {
    if (scrollThrottle.current) return;
    event.persist();
    scrollThrottle.current = true;
    const scrollY = event.nativeEvent.contentOffset.y;
    
    if (scrollY < 0) {
      setLogoSize(150); 
    } else if (scrollY < 80) {
      setLogoSize(Math.max(70, 150 - scrollY)); 
    } else {
      setLogoSize(70); 
    }
  
    setTimeout(() => {
      scrollThrottle.current = false;
    }, 100);
  };
  const titleSectionHeight = logoSize + 20;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={[styles.titleSection, {height: titleSectionHeight}]}>
        <Image style={[styles.logo, {height: logoSize, width: logoSize}]} source={require('@assets/BLLogo.png')}></Image>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <ScrollView
            style={styles.scrollContainer}
            ref={scrollViewRef}
            onMomentumScrollEnd={handleScroll}
            onScroll={handleScrollResize}
            scrollEventThrottle={16}>
            <View onStartShouldSetResponder={() => true} style={styles.form}>
          
              <StyledTextInput
                field="Name"
                value={name}
                setText={setName}
                placeholder="Albert Gator"
                autoComplete="name"
                autocorrect={false}
                required />
              
              <Picker
                style={styles.picker}
                selectedValue={year}
                onValueChange={(itemValue) =>
                  setYear(itemValue)
              }>
                <Picker.Item label="Freshman" value="Freshman" />
                <Picker.Item label="Sophomore" value="Sophomore" />
                <Picker.Item label="Junior" value="Junior" />
                <Picker.Item label="Senior" value="Senior" />
              </Picker>

              <StyledTextInput
                field="Email"
                value={email}
                setText={setEmail}
                placeholder="albert@ufl.edu"
                autoComplete="email"
                autocorrect={false}
                validate={validateEmail}
                reset={reset} />
              <StyledTextInput
                field="Username"
                value={username}
                setText={setUsername}
                placeholder="albert"
                autoComplete="username"
                autocorrect={false}
                validate={validateUsername}
                reset={reset} />
              <StyledTextInput
                field="Password"
                value={password}
                setText={setPassword}
                placeholder="supersecretpassword"
                autoComplete="current-password"
                autocorrect={false}
                helperText="Password must be at least 8 characters"
                validate={validatePassword}
                secureTextEntry={true}
                reset={reset} />
            </View>
            <View style={styles.buttonContainer}>
              <StyledButton text="Create Account" onClick={createUser} />
          </View>
          </ScrollView>
          
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter'
  },
  titleSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logo: {
    resizeMode: 'contain'
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
  },
  picker: {
    marginVertical: -15
  },
  buttonContainer: {
    marginTop: 45,  
    justifyContent: 'center',
    alignItems: 'center',
  }
});
