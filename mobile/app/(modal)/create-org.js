import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from "expo-constants";
import StyledButton from "@components/StyledButton";
import useAuth from '@context/useAuth';


export default function CreateOrganizationModal() {
  const router = useRouter();
  const { userId } = useAuth();
  const [orgName, setOrgName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
  
      setLoading(true);
      const URI = Constants.expoConfig.hostUri.split(":").shift();
  
      try {
        const response = await fetch(`http://${URI}:${process.env.EXPO_PUBLIC_PORT}/create-org`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: orgName,
            description: description,
            owner: userId, 
            // logo: "DEFAULT_LOGO_ID", 
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert("Success", "Organization created successfully!");
          router.back(); 
        } else {
          Alert.alert("Error", data.message || "Failed to create organization.");
        }
      } catch (error) {
        console.error("Error creating organization:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Organization</Text>
      <TextInput
        style={styles.input}
        placeholder="Organization name"
        value={orgName}
        onChangeText={setOrgName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
      />
      <StyledButton text={loading ? "Creating..." : "Create"} onClick={handleCreate} disabled={loading} />
      <Button title="Cancel" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    borderColor: '#ccc', 
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
});
