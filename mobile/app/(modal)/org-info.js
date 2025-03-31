import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { fetchImage } from '@middleware/fetchImage';
import Constants from 'expo-constants';
import StyledButton from './StyledButton';  // Assuming StyledButton is a custom component

export default function OrgInfo() {
  const router = useRouter();
  const [orgId, setOrgId] = useState(null);
  const [organization, setOrg] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query?.org) {
      setOrgId(router.query.org);
    }
  }, [router.query]);

  useEffect(() => {
    if (orgId) {
      const fetchOrgDetails = async () => {
        setLoading(true); 
        try {
          const URI = Constants.expoConfig.hostUri.split(':').shift();
          const response = await fetch(
            `http://${URI}:${process.env.EXPO_PUBLIC_PORT}/organizations/${orgId}`
          );
          const orgData = await response.json();

          if (orgData) {
            const logoURL = await fetchImage('organization', orgData.logo);
            setOrg({ ...orgData, logo: logoURL });
          } else {
            throw new Error('Organization not found');
          }
        } catch (err) {
          console.error('Error fetching organization details:', err);
          Alert.alert('Error', 'Failed to load organization details.');
        } finally {
          setLoading(false); 
        }
      };

      fetchOrgDetails();
    }
  }, [orgId]);

  const handleJoinOrg = () => {
    if (organization?.private) {
      if (joinCode === organization.joinCode) {
        Alert.alert('Success', 'Successfully joined the organization!');
      } else {
        Alert.alert('Error', 'Invalid join code. Please try again.');
      }
    } else {
      Alert.alert('Success', 'Successfully joined the organization!');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; 
  }

  if (!organization) {
    return <Text>Organization not found or failed to load.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{organization.name}</Text>
      <Image style={styles.logo} source={{ uri: organization.logo }} />
      <Text style={styles.description}>{organization.description}</Text>

      {organization.private ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Join Code"
            value={joinCode}
            onChangeText={setJoinCode}
          />
          <StyledButton text="Join Organization" onClick={handleJoinOrg} />
        </>
      ) : (
        <StyledButton text="Join Organization" onClick={handleJoinOrg} />
      )}

      <StyledButton
        text="Back to Explore"
        onClick={() => router.push('/explore')}
        style={styles.backButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '80%',
    borderRadius: 5,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#ccc',
  },
});
