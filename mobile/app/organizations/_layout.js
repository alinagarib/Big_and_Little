import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '@context/ctx';

export default function OrganizationsLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="[org]/(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
