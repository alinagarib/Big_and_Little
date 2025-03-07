import { useLocalSearchParams, useGlobalSearchParams, useRouter, useFocusEffect } from "expo-router";

export default function Admin() {
  const { back } = useLocalSearchParams();
  const { org } = useGlobalSearchParams();
  const router = useRouter();

  useFocusEffect(() => {
    if (back) {
      router.replace(`/organizations/${org}/matches`);
    } else {
      router.push(`/organizations/${org}/admin/orgSettings`);
    }
  });
}