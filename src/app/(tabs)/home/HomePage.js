import React from 'react';
import { ScrollView } from 'native-base';
import { HeroSection, TeamSection, FeaturesSection, CallToActionSection } from '../../../components/home';

export default function HomePage({ navigation }) {
  return (
    <ScrollView flex={1} bg="black">
      {/* Seção de destaque (Hero) */}
      <HeroSection />

      {/* Seção da equipe */}
      <TeamSection />

      {/* Seção das funcionalidades/propósito */}
      <FeaturesSection />

      {/* Seção de CTA (Entrar/Criar Conta) */}
      <CallToActionSection
        onLoginPress={() => navigation.navigate('Login')}
        onRegisterPress={() => navigation.navigate('Register')}
      />
    </ScrollView>
  );
}
