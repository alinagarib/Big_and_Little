import { View, Image, ActivityIndicator, StyleSheet } from "react-native";

/*
  Loading Component - Displays loading spinner and logo
*/
export default function Loading() {
  return (
    <View style={styles.container}>
      {/* Needs to be updated with our actual logo in assets/ */}
      <Image style={styles.logo} source={{uri: "https://static-00.iconduck.com/assets.00/figma-logo-icon-1404x2048-8gfy4r91.png"}}/>
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
    backgroundColor: 'rgba(240, 240, 240, 0.9)'
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain'
  }
});