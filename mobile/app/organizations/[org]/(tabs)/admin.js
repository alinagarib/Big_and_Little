import StyledButton from "@components/StyledButton";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

export default function Admin() {
  const { org } = useGlobalSearchParams();
  const router = useRouter();

  return (
    <View>
      <StyledButton
        text="Organization Settings"
        onClick={() => router.push(`/organizations/${org}/admin/orgSettings`)}
      />
      <StyledButton
        text="User Management"
        onClick={() => router.push(`/organizations/${org}/admin/userManagement`)}
      />
    </View>
  );
}