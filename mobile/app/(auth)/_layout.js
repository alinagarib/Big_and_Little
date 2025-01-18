import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

/*
  Auth layout of app, contains all possible routes in (auth) subfolder
*/
export default function AuthLayout() {
  const router = useRouter();

  return (
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerLeft: () => <TouchableOpacity onPress={router.back}><Text>Back</Text></TouchableOpacity>
        }}
      >
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
      </Stack>
  );
}
