import { View, Image, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";

/*
  Organization Card Component - Displays organization information for the Explore page
*/
export default function OrganizationCard({ org }) {
  const viewOrganization = () => {
    router.push(`/organizations/${org.id}/matches`)
  };

  return (
    <TouchableWithoutFeedback onPress={viewOrganization}>
      <View style={styles.container}>
        <Image style={styles.logo} source={{ uri: org.logo }} />
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {org.name}
          </Text>
          <Text style={styles.description} numberOfLines={4} ellipsizeMode="tail">
            {org.description}
          </Text>
        </View>
        <Text style={styles.size}>{org.size} {org.size == 1 ? "Member" : "Members"}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  size: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    fontWeight: "bold"
  }
});