import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { fetchImage } from "@middleware/fetchImage";

import Loading from "@components/Loading";
import OrganizationCard from "@components/OrganizationCard";
import StyledButton from "@components/StyledButton";
import { View, StyleSheet, FlatList } from "react-native";
import useAuth from '@context/useAuth';
import { useSession } from '@context/ctx'; 

export default function Explore() {
  const router = useRouter();   
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const { userId } = useAuth();
  const { session } = useSession();

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setLoading(true);

      const URI = Constants.expoConfig.hostUri.split(':').shift();
      
      fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/organizations`)
        .then(res => res.json())
        .then(async json => {
          const updatedOrganizations = await Promise.all(
            json.map(async (org) => {
              const logoURL = await fetchImage('organization', org.logo);

              const joinedRes = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/is-joined`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, orgId: org.id }) // Send userId and orgId
              });

              const { joined } = await joinedRes.json();
              return isMounted ? { ...org, logo: logoURL, joined } : null;
            })
          );

          if (isMounted) {
            setOrgs(updatedOrganizations);
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
        });

      return () => { isMounted = false; }; 
      }, [userId, session])
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
            renderItem={({ item }) => {
              return <OrganizationCard org={item} />
            }}
            keyExtractor={(item) => item.id.toString()} />
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