import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';


interface Props {
    onSearch: (q: string) => void;
}


export default function SearchBar({ onSearch }: Props) {
    const [q, setQ] = useState('');
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Buscar carta por nombre..."
                value={q}
                onChangeText={setQ}
                style={styles.input}
            />
            <Button title="Buscar" onPress={() => onSearch(q.trim())} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flexDirection: 'row', padding: 8, gap: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
});