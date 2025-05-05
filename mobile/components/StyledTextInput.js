import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";

/* 
  Styled Text Input Component - Displays text input with field header

  props: {
    field: Name of field for text input
    setText: Parent's useState updater 
    value: Parent's useState state
    placeholder: Placeholder for text input
    autoComplete: Should text input autocomplete
    autoCorrect: Should text input autocorrect
    helperText: Helper text for text input
    validate: Function used to validate input
    required: If field is required
    editable: If field can actively be edited
    multiline: If field can span multiple lines
    numberOfLines: Number of lines to span (if multiline)
    secureTextEntry: If text input should be obscured (passwords)
    reset: Used to trigger reset of text input
  }
  (See https://reactnative.dev/docs/textinput)
*/
export default function StyledTextInput(props) {
  // States for invalid text input
  const [invalid, setInvalid] = useState(false);
  const [reason, setReason] = useState('');

  // Input handler
  const onChangeText = (text) => {
    // Validate text, if provided
    if (props.validate) {
      const validateText = props.validate(text);
      if (!validateText.valid) {
        setReason(validateText.reason);
      }
      setInvalid(!validateText.valid);
    } else if (props.required) {
      if (text === "") {
        setReason(`${props.field} is required.`);
      }
      setInvalid(text === "");
    }

    // Update text of input
    props.setText(text);
  }

  useEffect(() => {
    if (props.value === "" || !props.validate) return;
    const validateText = props.validate(props.value);
    if (!validateText.valid) {
      props.setText("");
    }
  }, [props.reset]);

  return (
    <View style={styles.container}>
      <Text style={[styles.field, (invalid && styles.invalidText)]}>{props.field}</Text>
      <TextInput
        style={[styles.input, (invalid && styles.invalidInput)]}
        onChangeText={(text) => onChangeText(text)}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        autoCorrect={props.autoCorrect} 
        editable={props.editable}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        secureTextEntry={props.secureTextEntry}/>
      {(props.helperText || invalid) && (
        invalid ? 
          <Text style={styles.invalidText}>{reason}</Text> :
          <Text style={styles.helperText}>{props.helperText}</Text>
      )}
    </View>
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
    padding: 5,
    fontFamily: 'Inter'
  },
  helperText: {
    marginTop: -5,
    color: 'grey'
  },
  invalidInput: {
    borderColor: 'red'
  },
  invalidText: {
    color: 'red'
  }
});