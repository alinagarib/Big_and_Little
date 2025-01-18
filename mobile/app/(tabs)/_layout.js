import { Text, TouchableOpacity } from 'react-native';
import { Redirect, Tabs, useRouter } from 'expo-router';

import { useSession } from '@context/ctx';

export default function TabLayout() {
  const { session, signOut, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!session) {
    return <Redirect href="/" />;
  }

  const router = useRouter();

  return (
    <Tabs 
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => { 
              signOut();
              if (router.canDismiss()) {
                router.dismiss();
              } else {
                router.navigate('/');
              }
            }}>
              <Text style={{ marginLeft: 10 }}>Logout</Text>
            </TouchableOpacity>
          )
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: () => <Text>🏠</Text>
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: () => <Text>💖</Text>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <Text>👤</Text>
        }}
      />
    </Tabs>
  )
}
