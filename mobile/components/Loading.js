import { View, Image, ActivityIndicator, StyleSheet } from "react-native";

/*
  Loading Component - Displays loading spinner and logo
*/
export default function Loading() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@assets/BLLogo.png')}/>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
    gap: 10,
    padding: 10,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain'
  }
});