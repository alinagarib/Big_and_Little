import React, { useState, useRef } from 'react';
import { Pressable, Image, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert, View, ScrollView, StyleSheet } from 'react-native';

import { Link, router } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router/build/hooks';
import Constants from "expo-constants";

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput';
import StyledButton from '@components/StyledButton';
import StyledPictureInput from '@components/StyledPictureInput';
import ProfilePicture from '@components/ProfilePicture';

/*
    route: /view-profile
    View existing profile (if exists)
*/
export default function ViewProfile() {
    const [interests, setInterests] = useState(['+']);
    const [major, setMajor] = useState('');
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const params = useGlobalSearchParams();
    
    // State for scroll fix
    const scrollFix = useRef(false);

    const toggleIsEditing = (edit) => {
        setIsEditing(edit);
    };

    /*
      TODO: add profile updating
      PUT profiles
    */
    const saveProfile = () => {
      toggleIsEditing(false);
    };

    /*
      TODO: get profile to display current information
      GET profiles
    */
    const getProfile = async () => {
      // await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/${params.userId}`);
    };

    const handlePressInterest = (index) => {
      if (!isEditing) return;

      if (index == 0) {
        addInterest();
      }
      else {
        removeInterest(index);
      }
    }

    const addInterest = () => {
      if (!isEditing) return;

      Alert.prompt(
        'Enter an interest',
        null,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Add',
            onPress: (interest) => setInterests((interests) => [...interests, interest])
          }
        ]
      );
    };

    const removeInterest = (index) => {
      if (!isEditing) return;

      interests.splice(index, 1)

      setInterests([...interests]);
    }

    // Workaround to not hide text input helper/error text
    const handleScroll = (event) => {
        if (scrollFix.current) {
            scrollFix.current = false;
        } 
        else if (Keyboard.isVisible()) {
            const height = event.nativeEvent.contentOffset.y;
            scrollFix.current = true;
            if (this.scrollView) {
              this.scrollView.scrollTo({
                x: 0,
                y: height + 50,
                animated: true
            });
            }
        }
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={[styles.horizontalContainer, {marginHorizontal: 20}]}>
            <ProfilePicture
              src={''}
              />
            <Text style={styles.profileText}>Profile Name</Text>
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              style={styles.scrollContainer}
              ref={ref => this.scrollView = ref}
              onMomentumScrollEnd={handleScroll}>
              <View onStartShouldSetResponder={() => true} style={styles.form}>
                <StyledPictureInput 
                  disabled={!isEditing} />
                <Text style={{fontSize: 20}}>Interests</Text>
                <View>
                  {interests && <View style={styles.horizontalContainer}>{interests.map((item, index) => (
                    <Pressable key={index} onPress={() => handlePressInterest(index)}>
                      <Text style={styles.interest}>
                        {item}
                      </Text>
                      
                    </Pressable>
                ))}</View>}
                </View>
                <StyledTextInput
                  field="Major"
                  value={major}
                  setText={setMajor}
                  placeholder="Your major"
                  autocorrect={false}
                  editable={isEditing}
                  required />
                <StyledTextInput
                  field="Description"
                  value={description}
                  setText={setDescription}
                  multiline
                  numberOfLines={4}
                  placeholder="Tell us about yourself"
                  autocorrect={false}
                  editable={isEditing}
                  required />
              </View>
              <View style={styles.buttonContainer}>
                <StyledButton text="Preview" />
                <StyledButton text="Edit" onClick={() => toggleIsEditing(true)} />
                <StyledButton text="Save" onClick={saveProfile} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    paddingTop: 80
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    gap: 10
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginVertical: 10
  },
  scrollContainer: {
    height: '80%',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    borderRadius: 4,
    padding: 20,
    gap: 30
  },
  interest: {
    borderRadius: 4,
    backgroundColor: 'lightgrey',
    overflow: 'hidden',
    fontSize: 20,
    paddingHorizontal: 5 
  },
  form: {
    gap: 15,
    paddingBottom: 80
  },
  profileText: {
    fontSize: 15,
  }
});