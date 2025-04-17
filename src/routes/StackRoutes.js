import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Imports corretos conforme a estrutura
import HomePage from '../app/(tabs)/home/HomePage';
import LoginPage from '../app/(auth)/login/LoginPage';
import DashboardPage from '../app/(tabs)/dashboard/DashboardPage';
import RegisterPage from '../app/(auth)/register/RegisterPage';
import TabRoutes from './TabRoutes';

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator initialRouteName="Login" header>  
      <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
      <Stack.Screen name="Register" component={RegisterPage} options={{headerShown: false}}/>
      <Stack.Screen name="MainApp" component={TabRoutes} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}