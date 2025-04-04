import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Imports corretos conforme a estrutura
import HomePage from '../app/(tabs)/home/HomePage';
import LoginPage from '../app/(auth)/login/LoginPage';
import DashboardPage from '../app/(tabs)/dashboard/DashboardPage';
import RegisterPage from '../app/(auth)/register/RegisterPage';

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Dashboard" component={DashboardPage} />
    </Stack.Navigator>
  );
}
