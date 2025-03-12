import Constants from "expo-constants";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { fetchImage } from "@middleware/fetchImage";

import Loading from "@components/Loading";
import OrganizationCard from "@components/OrganizationCard";
import StyledButton from "@components/StyledButton";
import { View, StyleSheet, FlatList } from "react-native";
import useAuth from '@context/useAuth';

export default function Explore() {
  const router = useRouter();   
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const { userId, profiles } = useAuth();


  useFocusEffect(
    useCallback(() => {
      let isMounted = true; // keeps track so that state only updates when elements are present 
      setLoading(true);
      // Get IP that Expo server is using to host app, allows to connect with the backend
      const URI = Constants.expoConfig.hostUri.split(':').shift();
      fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/organizations`)
        .then(res => res.json())
        .then(async json => {
          const updatedOrganizations = await Promise.all(
            json.map(async (org) => {
              // Currently, use MOCK_IMAGE_ID instead of ID found in org.logo
              const logoURL = await fetchImage('organization-images', org.logo);
              const joined = profiles.some(profile => profile.organizationId === org.id);

              return isMounted ? { ...org, logo: logoURL, joined } : null;
            })
          );

          if (isMounted) {
            setOrgs(updatedOrganizations);
            setLoading(false);
          }
        });
        return () => { isMounted = false; }; 
      }, [userId]) // dependency array, if the userId changes, the function will rerun 
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
            keyExtractor={item => item.id}
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