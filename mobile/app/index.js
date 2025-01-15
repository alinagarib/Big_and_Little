import { View, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.body}>
        <Title />
        <StyledButton text="Log In" onClick={login} />
        <StyledButton text="Create Account" onClick={register} />
      </View>
    </View>
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
  }
});
