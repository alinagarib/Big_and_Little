import React, { useState, useRef } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert, View, Text, Pressable, StyleSheet } from 'react-native';

import { Link, router } from 'expo-router';
import Constants from "expo-constants";

import Title from '@components/Title';
import StyledTextInput from '@components/StyledTextInput';
import StyledButton from '@components/StyledButton';

export default function Home() {
    return (
        <View style={styles.titleSection}>
            <Link href='/view-profile'>View Profile</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      paddingTop: 40
    },
    titleSection: {
      height: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    form: {
      height: '50%',
      borderTopWidth: 1,
      borderTopColor: 'lightgrey',
      borderRadius: 4,
      padding: 20,
      gap: 30
    },
    bottom: {
      marginTop: -10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    forgot: {
      textDecorationLine: 'underline',
      fontSize: 15
    },
    create: {
      textDecorationLine: 'underline',
      fontSize: 15
    }
  });