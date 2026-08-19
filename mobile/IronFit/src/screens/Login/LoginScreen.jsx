import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        LOGIN
      </Text>

      <Text style={styles.subtitle}>
        Tela de login
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>
          VOLTAR
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  title: {
    color: '#FFD400',
    fontSize: 40,
    fontWeight: '900',
  },

  subtitle: {
    color: '#ffffff',
    marginTop: 10,
  },

  button: {
    marginTop: 30,
    backgroundColor: '#FFD400',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },

  buttonText: {
    color: '#000000',
    fontWeight: '900',
  },
});