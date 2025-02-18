import Constants from "expo-constants";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import Loading from "@components/Loading";
import OrganizationCard from "@components/OrganizationCard";
import StyledButton from "@components/StyledButton";
import { View, StyleSheet, FlatList } from "react-native";

export default function Explore() {
  const router = useRouter();   
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      // Get IP that Expo server is using to host app, allows to connect with the backend
      const URI = Constants.expoConfig.hostUri.split(':').shift();
      fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/organizations`)
        .then(res => res.json())
        .then(async (json) => {
          const updatedOrganizations = await Promise.all(
            json.map(async (org) => {
              // Currently, use MOCK_IMAGE_ID instead of ID found in org.logo
              const logoRes = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/image/organization/MOCK_IMAGE_ID`);
              const logoUrl = await logoRes.text();

              return {
                ...org,
                logo: logoUrl
              };
            })
          );

          setOrgs(updatedOrganizations);
          setLoading(false);
        })
      }, [])
  );

  return (
    <View style={styles.container}>
      {loading ?
        <Loading /> :
        <View style={styles.body}>
          <FlatList
            style={styles.orgContainer}
            contentContainerStyle={{ padding: 20, gap: 20 }}
            data={orgs}
            renderItem={({ item }) => <OrganizationCard org={item} />}
          />
          <View style={styles.button}>
            <StyledButton
              text="Create New Organization" 
              onClick={() => { 
                router.push("/create-org");           
              }} />
          </View>
        </View>
      } 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  orgContainer: {
    flex: 1
  },
  button: {
    padding: 20
  }
});