import { Stack } from 'expo-router';
import React from 'react';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="create-org" options={{ title: "Create Organization" }} />
    </Stack>  );
}
