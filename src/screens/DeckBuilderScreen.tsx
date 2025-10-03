import React, { useState, useRef, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';
import SearchBar from '../components/SearchBar';
import { useCards } from '../hooks/useCards';
import CardItem from '../components/CardItem';

const { width, height } = Dimensions.get("window");

export default function DeckBuilderScreen() {
  const { cards, loading, searchByName, loadAll } = useCards();
  const [deck, setDeck] = useState<any[]>([]);
  const [sideDeck, setSideDeck] = useState<any[]>([]);
  const [messages, setMessages] = useState<{ id: number, text: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState<{ id: number, text: string } | null>(null);

  const addToDeck = (card: any) => {
    const totalCount = deck.filter(c => c.id === card.id).length + sideDeck.filter(c => c.id === card.id).length;
    if (totalCount >= 3) return;

    if (deck.length < 60 && deck.filter(c => c.id === card.id).length < 3) {
      setDeck([...deck, card]);
      const id = Date.now() + Math.random();
      setMessages(prev => [...prev, { id, text: `Agregada: ${card.name} al Main Deck` }]);
    } else if (sideDeck.length < 15 && sideDeck.filter(c => c.id === card.id).length < 3) {
      setSideDeck([...sideDeck, card]);
      const id = Date.now() + Math.random();
      setMessages(prev => [...prev, { id, text: `Agregada: ${card.name} al Side Deck` }]);
    }
  };

  const removeFromDeck = (card: any) => {
    const idx = deck.findIndex(c => c.id === card.id);
    if (idx !== -1) {
      const newDeck = [...deck];
      newDeck.splice(idx, 1);
      setDeck(newDeck);
    }
  };

  function shuffleArray<T>(array: T[]): T[] {
    return array.map(a => [Math.random(), a] as [number, T])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1]);
  }

  const fillDecks = () => {
    let main: any[] = [];
    let side: any[] = [];
    let counts: Record<string, number> = {};
    for (let card of cards) counts[card.id] = 0;

    const shuffled = shuffleArray(cards);
    for (let card of shuffled) {
      let toAdd = Math.min(3, 60 - main.length);
      while (toAdd > 0 && main.length < 60 && counts[card.id] < 3) {
        main.push(card);
        counts[card.id]++;
        toAdd--;
      }
      if (main.length >= 60) break;
    }

    const shuffledSide = shuffleArray(cards);
    for (let card of shuffledSide) {
      let toAdd = Math.min(3 - (counts[card.id] || 0), 15 - side.length);
      while (toAdd > 0 && side.length < 15 && counts[card.id] < 3) {
        side.push(card);
        counts[card.id]++;
        toAdd--;
      }
      if (side.length >= 15) break;
    }

    setDeck(main);
    setSideDeck(side);
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: 'Decks llenados aleatoriamente' }]);
  };

  function FadeMessage({ text }: { text: string }) {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
      opacity.setValue(1);
      const anim = Animated.timing(opacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      });
      anim.start();
      return () => anim.stop();
    }, [text]);
    return (
      <Animated.View style={[styles.toast, { opacity }]}>
        <Text style={[styles.toastText, { fontSize: width * 0.04 }]}>{text}</Text>
      </Animated.View>
    );
  }

  useEffect(() => {
    if (!currentMessage && messages.length > 0) {
      setCurrentMessage(messages[0]);
      const timer = setTimeout(() => {
        setMessages(prev => prev.slice(1));
        setCurrentMessage(null);
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [messages, currentMessage]);

  return (
    <View style={styles.container}>
      <SearchBar onSearch={q => q ? searchByName(q) : loadAll()} />
      <FlatList
        data={cards}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <CardItem card={item} onPress={() => addToDeck(item)} />}
        ListHeaderComponent={
          <View style={{ paddingVertical: height * 0.02 }}>
            <Text style={[styles.title, { fontSize: width * 0.07 }]}>Deck Builder</Text>

            <View style={styles.actions}>
              <Text style={[styles.actionButton, styles.random, { fontSize: width * 0.035, paddingHorizontal: width * 0.04, paddingVertical: height * 0.012 }]} onPress={fillDecks}>Randomize</Text>
              <Text
                style={[styles.actionButton, styles.clear, (deck.length === 0 && sideDeck.length === 0) ? { opacity: 0.6 } : {}, { fontSize: width * 0.035, paddingHorizontal: width * 0.04, paddingVertical: height * 0.012 }]}
                onPress={() => {
                  if (deck.length === 0 && sideDeck.length === 0) return;
                  Alert.alert(
                    '¿Limpiar Decks?',
                    '¿Deseas eliminar todas las cartas del Main y Side Deck?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Limpiar', style: 'destructive', onPress: () => {
                        setDeck([]);
                        setSideDeck([]);
                        setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: 'Decks limpiados' }]);
                      } }
                    ]
                  );
                }}
              >
                Clear
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { fontSize: width * 0.045 }]}>Main Deck ({deck.length}/60)</Text>
            <View style={[styles.deckContainer, { padding: width * 0.02 }]}>
              <FlatList
                data={deck}
                keyExtractor={(item, idx) => `${item.id}-${idx}`}
                numColumns={6}
                renderItem={({ item }) => (
                  <View style={[styles.cardWrapper, { width: width * 0.13, height: height * 0.11, margin: width * 0.01 }]}>
                    <CardItem card={item} hideText onPress={() => removeFromDeck(item)} imgSize={width * 0.12} />
                  </View>
                )}
                contentContainerStyle={{ rowGap: height * 0.01, columnGap: width * 0.01 }}
                ListEmptyComponent={<Text style={[styles.emptyText, { fontSize: width * 0.035 }]}>Agrega cartas al Main Deck</Text>}
              />
            </View>

            <Text style={[styles.sectionTitle, { fontSize: width * 0.045, marginTop: height * 0.02 }]}>Side Deck ({sideDeck.length}/15)</Text>
            <View style={[styles.deckContainer, { padding: width * 0.02 }]}>
              <FlatList
                data={sideDeck}
                keyExtractor={(item, idx) => `${item.id}-${idx}`}
                numColumns={6}
                renderItem={({ item }) => (
                  <View style={[styles.cardWrapper, { width: width * 0.13, height: height * 0.11, margin: width * 0.01 }]}>
                    <CardItem card={item} hideText onPress={() => {
                      const idx = sideDeck.findIndex(c => c.id === item.id);
                      if (idx !== -1) {
                        const newSide = [...sideDeck];
                        newSide.splice(idx, 1);
                        setSideDeck(newSide);
                      }
                    }} imgSize={width * 0.12} />
                  </View>
                )}
                contentContainerStyle={{ rowGap: height * 0.01, columnGap: width * 0.01 }}
                ListEmptyComponent={<Text style={[styles.emptyText, { fontSize: width * 0.035 }]}>Agrega cartas al Side Deck</Text>}
              />
            </View>
          </View>
        }
      />

      <View style={styles.toastContainer} pointerEvents="none">
        {currentMessage && <FadeMessage key={currentMessage.id} text={currentMessage.text} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: width * 0.04, backgroundColor: '#1e1e2f' },
  title: { fontWeight: 'bold', color: '#FFD700', marginBottom: height * 0.015 },
  actions: { flexDirection: 'row', marginBottom: height * 0.02, gap: width * 0.02 },
  actionButton: {
    borderRadius: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  random: { backgroundColor: '#228B22' },
  clear: { backgroundColor: '#B22222' },
  sectionTitle: { fontWeight: 'bold', color: '#FFD700', marginBottom: height * 0.008 },
  deckContainer: {
    minHeight: height * 0.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: '#2a2a3b',
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: height * 0.01 },
  toastContainer: { position: 'absolute', left: 0, right: 0, bottom: height * 0.03, alignItems: 'center', zIndex: 100 },
  toast: { backgroundColor: '#228B22', paddingHorizontal: width * 0.06, paddingVertical: height * 0.012, borderRadius: 24, margin: 4, minWidth: width * 0.35, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 5 },
  toastText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
