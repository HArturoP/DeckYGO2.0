import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CardListScreen from "../screens/CardListScreen";
import CardDetailsScreen from "../screens/CardDetailScreen";
import Register from "../screens/auth/Register";
import Login from "../screens/auth/Login";
import Favorites from "../screens/Favorites";
import DeckBuilderScreen from "../screens/DeckBuilderScreen";

import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window"); // para responsividad
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#2a2a3b" }, // Fondo oscuro
          headerTintColor: "#FFD700",                  // Texto dorado
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={CardListScreen}
          options={({ navigation }) => ({
            title: "Yu-Gi-Oh",
            headerRight: () => (
              <DecksButton onPress={() => navigation.navigate("DeckBuilder")} />
            ),
          })}
        />
        <Stack.Screen
          name="Details"
          component={CardDetailsScreen}
          options={{ title: "Detalle" }}
        />
        <Stack.Screen
          name="DeckBuilder"
          component={DeckBuilderScreen}
          options={{ title: "Armar Deck" }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Registro" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={{ title: "Favoritos" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  // Botón estilizado para la cabecera
  function DecksButton({ onPress }: { onPress: () => void }) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.button, { paddingVertical: width * 0.015, paddingHorizontal: width * 0.035, marginRight: width * 0.03 }]}>
        <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>Decks</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#228B22", // Verde bosque
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#FFD700",       // Dorado
    fontWeight: "bold",
  },
});
