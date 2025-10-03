import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const eyeAnim = useRef(new Animated.Value(0)).current; // Para animar el ojo
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    setError(null);
    if (!correo || !contraseña) {
      setError("Ingresa email y contraseña");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, correo, contraseña);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const togglePassword = () => {
    // Animación: giro y opacidad
    Animated.sequence([
      Animated.timing(eyeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(eyeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
    setShowPassword(!showPassword);
  };

  // Animaciones interpoladas
  const rotate = eyeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const opacity = eyeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#ccc"
              value={correo}
              onChangeText={setCorreo}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Contraseña"
                placeholderTextColor="#ccc"
                value={contraseña}
                onChangeText={setContraseña}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={togglePassword} style={styles.eyeButton}>
                <Animated.View style={{ transform: [{ rotate }], opacity }}>
                  <FontAwesome
                    name={showPassword ? "eye-slash" : "eye"}
                    size={width * 0.06}
                    color="#FFD700"
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text
              style={styles.registerText}
              onPress={() => navigation.navigate("Register")}
            >
              ¿No tienes cuenta? Regístrate
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f2e",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    width: width * 0.9,
    backgroundColor: "#2a2a3b",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 30,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#38384f",
    color: "#fff",
    borderRadius: 15,
    paddingVertical: height * 0.018,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: "#FFD700",
    fontSize: width * 0.045,
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  eyeButton: {
    padding: 10,
  },
  button: {
    backgroundColor: "#228B22",
    paddingVertical: height * 0.022,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: width * 0.05,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  error: {
    color: "#FF6347",
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: width * 0.04,
    textAlign: "center",
  },
  registerText: {
    color: "#00FF7F",
    marginTop: 20,
    fontSize: width * 0.04,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
