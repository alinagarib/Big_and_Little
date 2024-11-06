import { View, Text, Image, StyleSheet } from "react-native";

/*
  Title Component - Displays App name and logo
*/
export default function Title() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titleText}>Big &</Text>
        <Text style={styles.titleText}>Little</Text>
      </View>
      {/* Needs to be updated with our actual logo in assets/ */}
      <Image style={styles.logo} source={{uri: "https://static-00.iconduck.com/assets.00/figma-logo-icon-1404x2048-8gfy4r91.png"}}/>
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
    width: 70,
    height: 70,
    resizeMode: 'contain'
  }
});