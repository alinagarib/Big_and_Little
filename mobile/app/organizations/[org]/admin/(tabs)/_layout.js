import { Text, TouchableOpacity } from 'react-native';
import { Tabs, useGlobalSearchParams, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function OrgLayout() {
  const { org } = useGlobalSearchParams();
  const router = useRouter();

  return (
    <Tabs 
      screenOptions={{
        lazy: false,
        headerTitleAlign: 'center',
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => { 
              router.setParams({ back: true });
              router.dismissTo(`/organizations/${org}/matches`)
            }}>
              <Text style={{ marginLeft: 10 }}>Back</Text>
            </TouchableOpacity>
          )
        }
      }}
    >
      <Tabs.Screen
        name="orgSettings"
        options={{
          title: 'Organization Settings',
          tabBarIcon: () => <AntDesign name="setting" size={24} />
        }}
      />
      <Tabs.Screen
        name="userManagement"
        options={{
          title: 'User Management',
          tabBarIcon: () => <AntDesign name="team" size={24} />
        }}
      />
    </Tabs>
  )
}
