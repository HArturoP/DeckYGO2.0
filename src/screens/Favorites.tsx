import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface FavoriteCard {
  cardId: string;
  name: string;
  image: string;
}

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      setLoading(true);
      const favCollection = collection(db, 'usuarios', user.uid, 'favoritos');
      const favSnapshot = await getDocs(favCollection);
      const favs: FavoriteCard[] = favSnapshot.docs.map(doc => doc.data() as FavoriteCard);
      setFavorites(favs);
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  if (!user) return <Text style={{ padding: 16 }}>Debes iniciar sesión para ver tus favoritos.</Text>;
  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (favorites.length === 0) return <Text style={{ padding: 16 }}>No tienes cartas favoritas aún.</Text>;

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.cardId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Details', { id: item.cardId })}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.cardName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, marginBottom: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
  image: { width: 60, height: 90, resizeMode: 'contain', marginRight: 12 },
  cardName: { fontSize: 16, fontWeight: 'bold' },
});
