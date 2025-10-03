import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';

interface Props {
    onSearch: (q: string) => void;
}

const { width } = Dimensions.get('window');

export default function SearchBar({ onSearch }: Props) {
    const [q, setQ] = useState('');

    return (
        <View style={[styles.container, { padding: width * 0.02, gap: width * 0.02 }]}>
            <TextInput
                placeholder="Buscar carta por nombre..."
                placeholderTextColor="#FFA500"
                value={q}
                onChangeText={setQ}
                style={[
                    styles.input,
                    {
                        paddingVertical: width * 0.02,
                        paddingHorizontal: width * 0.03,
                        borderRadius: width * 0.025,
                        fontSize: width * 0.04,
                    }
                ]}
            />
            <Button title="Buscar" onPress={() => onSearch(q.trim())} color="#FFD700" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FFD700',
        backgroundColor: '#2a2a3b',
        color: '#FFD700',
        fontWeight: '600',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
});
