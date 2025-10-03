import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Card } from "../models/Card";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

interface Props {
  card: Card;
  onPress?: () => void;
  hideText?: boolean;
  imgSize?: number;
}

const { width } = Dimensions.get('window');

export default function CardItem({ card, onPress, hideText, imgSize }: Props) {
  const img = card.card_images?.[0]?.image_url_small || card.card_images?.[0]?.image_url;

  let priceText = "Precio: No disponible";
  if (card.card_prices && card.card_prices.length > 0) {
    const prices = card.card_prices[0];
    if (prices.tcgplayer_price && prices.tcgplayer_price !== "0.00") {
      priceText = `TCGPrice: $${prices.tcgplayer_price}`;
    } else if (prices.amazon_price && prices.amazon_price !== "0.00") {
      priceText = `Amazon: $${prices.amazon_price}`;
    }
  }

  const calculatedImgSize = imgSize || width * 0.16;

  return (
    <TouchableOpacity style={[styles.container, { padding: width * 0.02 }]} onPress={onPress}>
      {img ? (
        <Image
          source={{ uri: img }}
          style={[
            styles.image,
            { 
              width: calculatedImgSize, 
              height: calculatedImgSize * 1.375, 
              marginRight: width * 0.03,
              borderRadius: width * 0.015,
            }
          ]}
        />
      ) : null}
      {!hideText ? (
        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.title, { fontSize: width * 0.04 }]}>{card.name}</Text>
          <Text numberOfLines={2} style={[styles.subtitle, { fontSize: width * 0.032 }]}>
            {card.type} • {card.race || ""}
          </Text>
          <Text style={[styles.price, { fontSize: width * 0.035 }]}>{priceText}</Text>

          {(card.atk !== undefined || card.def !== undefined) && (
            <View style={[styles.statsContainer, { marginTop: width * 0.015, gap: width * 0.03 }]}>
              {card.atk !== undefined && (
                <View style={[styles.stat, { gap: width * 0.01 }]}>
                  <FontAwesome5 name="bolt" size={width * 0.035} color="#FF4500" />
                  <Text style={[styles.statText, { fontSize: width * 0.035 }]}>{card.atk}</Text>
                </View>
              )}
              {card.def !== undefined && (
                <View style={[styles.stat, { gap: width * 0.01 }]}>
                  <FontAwesome name="shield" size={width * 0.035} color="#1E90FF" />
                  <Text style={[styles.statText, { fontSize: width * 0.035 }]}>{card.def}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2a2a3b",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#555",
  },
  content: { flex: 1 },
  title: {
    fontWeight: "700",
    color: "#FFD700",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: "#B0B0B0",
    marginTop: 4,
  },
  price: {
    color: "#00FF7F",
    marginTop: 6,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: "row",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
