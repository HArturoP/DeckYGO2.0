import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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

  if (!user) return <Text style={[styles.message, { fontSize: width * 0.045 }]}>Debes iniciar sesión para ver tus favoritos.</Text>;
  if (loading) return <ActivityIndicator style={{ marginTop: height * 0.05 }} color="#FFD700" size="large" />;
  if (favorites.length === 0) return <Text style={[styles.message, { fontSize: width * 0.045 }]}>No tienes cartas favoritas aún.</Text>;

  return (
    <SafeAreaView style={[styles.container, { padding: width * 0.03 }]}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.cardId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.cardContainer, { padding: width * 0.03, marginBottom: height * 0.015 }]}
            onPress={() => navigation.navigate('Details', { id: item.cardId })}
            activeOpacity={0.8}
          >
            {item.image && <Image source={{ uri: item.image }} style={[styles.image, { width: width * 0.14, height: height * 0.15, marginRight: width * 0.03 }]} />}
            <View style={styles.textContainer}>
              <Text style={[styles.cardName, { fontSize: width * 0.045, marginBottom: height * 0.005 }]}>{item.name}</Text>
              <Text style={[styles.cardId, { fontSize: width * 0.035 }]}>ID: {item.cardId}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: height * 0.03 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e2f' },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  image: { resizeMode: 'contain', borderRadius: 6, borderWidth: 1, borderColor: '#555' },
  textContainer: { flex: 1 },
  cardName: { fontWeight: '700', color: '#FFD700' },
  cardId: { color: '#B0B0B0' },
  message: { color: '#FFD700', textAlign: 'center' },
});
