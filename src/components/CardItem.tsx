import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../models/Card';


interface Props {
    card: Card;
    onPress?: () => void;
}


export default function CardItem({ card, onPress }: Props) {
    const img = card.card_images?.[0]?.image_url_small || card.card_images?.[0]?.image_url;
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {img ? <Image source={{ uri: img }} style={styles.image} /> : null}
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.title}>{card.name}</Text>
                <Text numberOfLines={2} style={styles.subtitle}>{card.type} • {card.race || ''}</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    image: { width: 64, height: 88, resizeMode: 'contain', marginRight: 12 },
    content: { flex: 1 },
    title: { fontWeight: '700' },
    subtitle: { color: '#666', marginTop: 4 },
});