import { View, Text, Image, StyleSheet } from "react-native";

/*
  Title Component - Displays App name and logo
*/
export default function Title() {
  return (
    <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/BLLogo.png')}></Image>   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  titleText: {
    fontSize: 70,
    lineHeight: 70,
    textAlign: 'center'
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain'
  }
});