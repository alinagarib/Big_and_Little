import { View, Text, StyleSheet } from 'react-native';

/*
  Route: /register

  Prompts user to create their account

  CURRENTLY A PLACEHOLDER
*/
export default function Login() {
  return (
    <View style={styles.container}>
      <Text>Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});