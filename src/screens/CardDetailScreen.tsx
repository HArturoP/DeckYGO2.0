import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { fetchCardById } from "../api/ygoapi";
import { Card } from "../models/Card";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function CardDetailsScreen({ route }: any) {
  const { id } = route.params;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchCardById(id)
      .then((c) => {
        if (mounted) setCard(c);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    if (user) {
      const checkFavorite = async () => {
        const favDoc = doc(db, "usuarios", user.uid, "favoritos", id);
        const favSnap = await getDoc(favDoc);
        setIsFavorite(favSnap.exists());
      };
      checkFavorite();
    }

    return () => {
      mounted = false;
    };
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !card) return;
    const favDoc = doc(
      db,
      "usuarios",
      user.uid,
      "favoritos",
      card.id.toString()
    );
    if (isFavorite) {
      await deleteDoc(favDoc);
      setIsFavorite(false);
    } else {
      await setDoc(favDoc, {
        cardId: card.id.toString(),
        name: card.name,
        image: card.card_images?.[0]?.image_url,
      });
      setIsFavorite(true);
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} color="#FFD700" />;
  if (!card)
    return <Text style={{ padding: 16, color: "#fff" }}>Carta no encontrada</Text>;

  const img = card.card_images?.[0]?.image_url;
  const prices = card.card_prices?.[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: width * 0.04 }}
    >
      {img && (
        <Image
          source={{ uri: img }}
          style={[styles.image, { height: height * 0.5 }]}
        />
      )}
      <View style={styles.favoriteContainer}>
        {user && (
          <TouchableOpacity onPress={toggleFavorite}>
            <FontAwesome
              name={isFavorite ? "star" : "star-o"}
              size={width * 0.08}
              color="#ffc107"
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { fontSize: width * 0.07 }]}>{card.name}</Text>
      <Text style={[styles.meta, { fontSize: width * 0.038 }]}>
        {card.type} • {card.race || "-"} • {card.archetype || "-"}
      </Text>
      <Text style={[styles.desc, { fontSize: width * 0.04, lineHeight: width * 0.06 }]}>
        {card.desc}
      </Text>

      {(card.atk !== undefined || card.def !== undefined) && (
        <View style={[styles.stats, { marginTop: height * 0.02 }]}>
          {card.atk !== undefined && (
            <View style={styles.stat}>
              <FontAwesome5 name="bolt" size={width * 0.05} color="#FF4500" />
              <Text style={[styles.statText, { fontSize: width * 0.045 }]}>{card.atk}</Text>
            </View>
          )}
          {card.def !== undefined && (
            <View style={styles.stat}>
              <FontAwesome name="shield" size={width * 0.05} color="#1E90FF" />
              <Text style={[styles.statText, { fontSize: width * 0.045 }]}>{card.def}</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ marginTop: height * 0.025 }}>
        <Text style={[styles.price, { fontSize: width * 0.045 }]}>
          Amazon:{" "}
          {prices?.amazon_price && prices.amazon_price !== "0.00"
            ? `$${prices.amazon_price}`
            : "No disponible"}
        </Text>
        <Text style={[styles.price, { fontSize: width * 0.045 }]}>
          TCGPlayer:{" "}
          {prices?.tcgplayer_price && prices.tcgplayer_price !== "0.00"
            ? `$${prices.tcgplayer_price}`
            : "No disponible"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2f",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  favoriteContainer: {
    position: "absolute",
    top: height * 0.02,
    right: width * 0.05,
  },
  title: {
    fontWeight: "700",
    color: "#FFD700",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginTop: height * 0.015,
  },
  meta: {
    color: "#B0B0B0",
    marginTop: height * 0.005,
  },
  desc: {
    marginTop: height * 0.015,
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stats: {
    flexDirection: "row",
    gap: width * 0.05,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.015,
  },
  statText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  price: {
    fontWeight: "bold",
    color: "#00FF7F",
    marginTop: 4,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
