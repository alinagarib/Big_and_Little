import { useLocalSearchParams, Stack } from 'expo-router';

import useAuth from '@context/useAuth';

export default function AdminLayout() {
  // User is not an admin of the organization
  const { _, profiles } = useAuth();
  const { org } = useLocalSearchParams();

  if (!profiles.find(profile => profile.organizationId === org).isOwner) {
    return <Redirect href={`/organizations/${org}`} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
