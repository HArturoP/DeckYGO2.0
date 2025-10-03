import React, { useContext } from 'react';
import { View, FlatList, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useCards } from '../hooks/useCards';
import CardItem from '../components/CardItem';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

export default function CardListScreen() {
  const { cards, loading, error, searchByName } = useCards();
  const navigation = useNavigation<any>();
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: width * 0.08 }]}>Yu-Gi-Oh</Text>

        <View style={styles.buttonsContainer}>
          {!user ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.greenButton, { paddingVertical: height * 0.012, paddingHorizontal: width * 0.04 }]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.buttonText, { fontSize: width * 0.035 }]}>Registrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.blueButton, { paddingVertical: height * 0.012, paddingHorizontal: width * 0.04 }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.buttonText, { fontSize: width * 0.035 }]}>Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.redButton, { paddingVertical: height * 0.012, paddingHorizontal: width * 0.04 }]}
                onPress={logout}
              >
                <Text style={[styles.buttonText, { fontSize: width * 0.035 }]}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, { padding: width * 0.025 }]}
                onPress={() => navigation.navigate('Favorites')}
              >
                <FontAwesome name="star" size={width * 0.06} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <SearchBar onSearch={(q) => searchByName(q)} />

      {loading && <ActivityIndicator style={{ marginTop: height * 0.02 }} />}
      {error && <Text style={{ color: 'red', padding: width * 0.02 }}>{error}</Text>}

      <View style={styles.listContainer}>
        <FlatList
          data={cards}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={[styles.cardWrapper, { padding: width * 0.03, marginBottom: height * 0.015 }]}>
              <CardItem
                card={item}
                onPress={() => navigation.navigate('Details', { id: item.id })}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.025,
    backgroundColor: '#1e1e2f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  title: {
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: width * 0.02,
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  iconButton: {
    borderRadius: 8,
    backgroundColor: '#ffc107',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  greenButton: { backgroundColor: '#28a745' },
  blueButton: { backgroundColor: '#007bff' },
  redButton: { backgroundColor: '#dc3545' },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: width * 0.01,
  },
  cardWrapper: {
    backgroundColor: '#2a2a3b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
});
