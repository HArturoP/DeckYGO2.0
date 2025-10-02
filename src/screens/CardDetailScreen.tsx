import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchCardById } from '../api/ygoapi';
import { Card } from '../models/Card';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

export default function CardDetailsScreen({ route }: any) {
  const { id } = route.params;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchCardById(id).then(c => { if (mounted) setCard(c); }).finally(() => { if (mounted) setLoading(false); });

    if (user) {
      const checkFavorite = async () => {
        const favDoc = doc(db, 'usuarios', user.uid, 'favoritos', id);
        const favSnap = await getDoc(favDoc);
        setIsFavorite(favSnap.exists());
      };
      checkFavorite();
    }

    return () => { mounted = false; };
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !card) return;
    const favDoc = doc(db, 'usuarios', user.uid, 'favoritos', card.id.toString());
    if (isFavorite) {
      await deleteDoc(favDoc);
      setIsFavorite(false);
    } else {
      await setDoc(favDoc, { cardId: card.id.toString(), name: card.name, image: card.card_images?.[0]?.image_url });
      setIsFavorite(true);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!card) return <Text style={{ padding: 16 }}>Carta no encontrada</Text>;

  const img = card.card_images?.[0]?.image_url;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {img && <Image source={{ uri: img }} style={styles.image} />}
      <View style={styles.favoriteContainer}>
        {user && (
          <TouchableOpacity onPress={toggleFavorite}>
            <FontAwesome name={isFavorite ? "star" : "star-o"} size={28} color="#ffc107" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{card.name}</Text>
      <Text style={styles.meta}>{card.type} • {card.race} • {card.archetype || ''}</Text>
      <Text style={styles.desc}>{card.desc}</Text>
      <View style={styles.stats}>
        <Text>ATK: {card.atk ?? '-'}</Text>
        <Text>DEF: {card.def ?? '-'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 420, resizeMode: 'contain', marginBottom: 12 },
  favoriteContainer: { position: 'absolute', top: 10, right: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { color: '#666', marginTop: 6 },
  desc: { marginTop: 12, lineHeight: 20 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});
