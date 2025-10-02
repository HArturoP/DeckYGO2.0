import React, { useContext } from 'react';
import { View, FlatList, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useCards } from '../hooks/useCards';
import CardItem from '../components/CardItem';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function CardListScreen() {
  const { cards, loading, error, searchByName } = useCards();
  const navigation = useNavigation<any>();
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Yu-Gi-Oh</Text>
        <View style={styles.buttonsContainer}>
          {!user ? (
            <>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#007bff' }]} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#ffc107' }]} onPress={() => navigation.navigate('Favorites')}>
                <FontAwesome name="star" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <SearchBar onSearch={(q) => searchByName(q)} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', padding: 8 }}>{error}</Text>}

      <FlatList
        data={cards}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <CardItem card={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold' },
  buttonsContainer: { flexDirection: 'row', gap: 10 },
  button: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
