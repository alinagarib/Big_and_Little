import { Text, TouchableOpacity } from 'react-native';
import { Redirect, Tabs, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

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
        lazy: false,
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
          tabBarIcon: () => <AntDesign name="home" size={24} />
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: () => <AntDesign name="hearto" size={24} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <AntDesign name="profile" size={24} />
        }}
      />
    </Tabs>
  )
}
