import { Text } from 'react-native';
import { Redirect, useLocalSearchParams, Stack } from 'expo-router';

import useAuth from '@context/useAuth';
import { useSession } from '@context/ctx';

export default function OrganizationsLayout() {
  const { session, isLoading } = useSession();
  
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // User is not logged in
  if (!session) {
    return <Redirect href="/" />;
  }

  // User is logged in, but not in the organization
  const { _, profiles } = useAuth();
  const { org } = useLocalSearchParams();
  if (!profiles.some(profile => profile.organizationId === org)) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}
