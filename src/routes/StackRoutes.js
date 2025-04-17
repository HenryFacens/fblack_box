import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Imports corretos conforme a estrutura
import LoginPage from '../app/(auth)/login/LoginPage';
import RegisterPage from '../app/(auth)/register/RegisterPage';
import TabRoutes from './TabRoutes';
import ForgotPasswordPage from '../app/(auth)/forgot/ForgotPage';
import ResetPasswordPage from '../app/(auth)/resetPassword/resetPage';
import ResetPasswordRedirect from '../components/auth/ResetPasswordRedirect';

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator initialRouteName="Login" header>  
      <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
      <Stack.Screen name="Register" component={RegisterPage} options={{headerShown: false}}/>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} options={{headerShown: false}} />
      {/* Rota que será acessada pelo link do e-mail */}
      <Stack.Screen name="ResetPassword" component={ResetPasswordRedirect} options={{headerShown: false}} />
      {/* Rota do formulário de redefinição */}
      <Stack.Screen name="ResetPasswordForm" component={ResetPasswordPage} options={{headerShown: false}} />
      <Stack.Screen name="MainApp" component={TabRoutes} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}