// src/screens/auth/Login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    setError(null);

    if (!correo || !contraseña) {
      setError("Ingresa email y contraseña");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, correo, contraseña);

      // 🔹 Redirigir automáticamente a Home y limpiar stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 20 
},
  input: {
    width: "100%",
    backgroundColor: "#ffffffff",
    color: "#000000ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: { 
    backgroundColor: "#007bff", 
    padding: 15, 
    borderRadius: 8, 
    width: "100%", 
    alignItems: "center" 
},
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
},
  error: { 
    color: "red", 
    marginBottom: 10 
},
});
