// src/screens/auth/Register.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Register() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    setError(null);

    if (!correo || !contraseña) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
      const user = userCredential.user;

      // Guardar usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        correo: user.email,
        uid: user.uid,
        creadoEn: serverTimestamp(),
      });

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
      <Text style={styles.title}>Registro</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
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
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
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
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  error: { color: "red", marginBottom: 10 },
});
