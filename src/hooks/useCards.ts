import { useEffect, useState } from 'react';
import { fetchAllCards, fetchCardsByName } from '../api/ygoapi';
import { Card } from '../models/Card';


export function useCards() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    async function loadAll() {
        try {
            setLoading(true);
            const data = await fetchAllCards();
            setCards(data as Card[]);
        } catch (e: any) {
            setError(e.message || 'unknown');
        } finally {
            setLoading(false);
        }
    }


    async function searchByName(name: string) {
  if (!name) return loadAll();

  try {
    setLoading(true);
    const allCards = await fetchAllCards();
    const filtered = (allCards as Card[]).filter(c =>
      c.name.toLowerCase().includes(name.toLowerCase()) // coincidencia parcial
    );
    setCards(filtered);
  } catch (e: any) {
    setError(e.message || 'not found');
    setCards([]);
  } finally {
    setLoading(false);
  }
}



    useEffect(() => {
        loadAll();
    }, []);


    return { cards, loading, error, loadAll, searchByName };
}