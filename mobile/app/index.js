import { View, StyleSheet, KeyboardAvoidingView, Image } from 'react-native';

import { router } from 'expo-router';

import Title from '@components/Title';
import StyledButton from '@components/StyledButton';

// Create button onClick methods
const login = () => {
  router.navigate('/login');
}

const register = () => {
  router.navigate('/register');
}

/*
  Route: / (Entry Point)

  Displays login and create account buttons
*/
export default function Index() {
  return (
    <KeyboardAvoidingView style={styles.container}>
     <Title></Title>
      <View style={styles.body}>
        <StyledButton text="Log In" onClick={login} />
        <StyledButton text="Create Account" onClick={register} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter',
    paddingVertical: 80,
  },
  body: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }
});
