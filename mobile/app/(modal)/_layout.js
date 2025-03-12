import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function ModalLayout() {
  const router = useRouter();
  
  return (
    <Stack screenOptions={{ 
      headerTitleAlign: 'center',
      headerLeft: () => <TouchableOpacity onPress={router.back}><Text>Back</Text></TouchableOpacity>
    }}>
      <Stack.Screen 
        name="create-org" 
        options={{ 
          headerTitle: "Create Organization",
          presentation: 'card'  // Instead of modal presentation
        }} 
      />
      <Stack.Screen 
        name="join-org" 
        options={{ 
          headerTitle: "Join Organization",
          presentation: 'card'  // Instead of modal presentation
        }} 
      />
    </Stack>  );
}
