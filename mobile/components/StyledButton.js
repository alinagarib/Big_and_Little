import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from "react-native";

/* 
  Styled Button Component - Displays button with text

  props: {
    text: Text to display on button
    onClick: Method to be called on button press
    disabled: If button is to be visible
  }
*/
export default function StyledButton(props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable 
      style={[styles.button, { backgroundColor: pressed ? 'grey' : 'black' }]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={props.onClick}
      disabled={props.disabled}>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    borderRadius: 4
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
});