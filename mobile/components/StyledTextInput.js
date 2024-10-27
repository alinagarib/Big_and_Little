import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, Text, TextInput, StyleSheet } from "react-native";

/* 
  Styled Text Input Component - Displays text input with field header

  props: {
    field: Name of field for text input
    setText: Parent's useState updater 
    value: Parent's useState state
    placeholder: Placeholder for text input
    autoComplete: Should text input autocomplete
    autoCorrect: Should text input autocorrect
    inputMode: Input mode for text input
  }
  (See https://reactnative.dev/docs/textinput)

  TODO: Implement validation and display below helper text
*/
export default function StyledTextInput(props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.field}>{props.field}</Text>
      <TextInput
        style={styles.input}
        onChangeText={props.setText}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        autoCorrect={props.autoCorrect}
        inputMode={props.inputMode} />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  field: {
    fontSize: 20
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 4,
    fontSize: 20,
    padding: 5
  }
});