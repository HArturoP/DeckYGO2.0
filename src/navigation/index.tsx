import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardListScreen from '../screens/CardListScreen';
import CardDetailsScreen from '../screens/CardDetailScreen';
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';
import Favorites from '../screens/Favorites';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={CardListScreen} options={{ title: 'Yu-Gi-Oh' }} />
        <Stack.Screen name="Details" component={CardDetailsScreen} options={{ title: 'Detalle' }} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Registro' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="Favorites" component={Favorites} options={{ title: 'Favoritos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
