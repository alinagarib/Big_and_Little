import React, { useState } from 'react';
import { Pressable, Image, Text, View, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import StyledButton from './StyledButton';

/* 
  Styled Picture Input Component - Displays picture input with field header

  props: {
    
  }
*/
export default function StyledPictureInput(props) {
  // States for invalid file input
  const [invalid, setInvalid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const pickImage = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            selectionLimit: 5
        });

        const maxMB = 5; // arbitrary 5MB limit on image file size
        const maxSize = maxMB * 1024 * 1024;

        for (let i = 0; i < result.assets.length; i++) {
            if (result.assets[i].fileSize > maxSize) {
                Alert.alert('Max image size exceeded!', `Please select an image up to ${maxMB}MB.`)
            }
        }
        

        if (!result.canceled) {
            setSelectedFiles(result.assets);
        }
    }
    catch (err) {

    }
  };

  const uploadFile = () => {

  };

  return (
    <>
        {(!props.disabled) && (
        <View>
            <Text style={styles.field}>Add Profile Pictures</Text>
            <Pressable onPress={pickImage} disabled={props.disabled}>
              <Image
                source={require('../assets/picture-icon-200x200.png')}
                style={{flex: 1, resizeMode: 'contain', width: 100, height: 100}}/>
            </Pressable>
            <Text style={styles.helperText}>
                Maximum 5 images
            </Text>
            {selectedFiles && <Text style={styles.input}> Selected Files: {selectedFiles.map((image, index) => (
                <Text key={index}>
                    {image.fileName}{' '}
                </Text>
            ))}</Text>}
        </View>
        )}
    </>
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
  },
  helperText: {
    color: 'grey'
  },
  invalidInput: {
    borderColor: 'red'
  },
  invalidText: {
    color: 'red'
  }
});