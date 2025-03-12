import { Text, TouchableOpacity } from 'react-native';
import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import useAuth from '@context/useAuth';

export default function OrgLayout() {
  const router = useRouter();

  const { org } = useLocalSearchParams();
  const { _, profiles } = useAuth();

  const isAdmin = profiles.find(profile => profile.organizationId === org).isOwner;

  return (
    <Tabs 
      screenOptions={{
        lazy: false,
        headerTitleAlign: 'center',
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => { 
              if (router.canDismiss()) {
                router.dismiss();
              } else {
                router.replace('/');
              }
            }}>
              <Text style={{ marginLeft: 10 }}>Back</Text>
            </TouchableOpacity>
          )
        }
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <AntDesign name="user" size={24} />
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
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: () => <AntDesign name="database" size={24} />,
          ...(!isAdmin && {href: null})
        }}
      />
    </Tabs>
  )
}
