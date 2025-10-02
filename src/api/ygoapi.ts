export const BASE_URL = 'https://db.ygoprodeck.com/api/v7';


export async function fetchCardsByName(name: string) {
    const q = encodeURIComponent(name);
    const url = `${BASE_URL}/cardinfo.php?name=${q}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching cards');
    const json = await res.json();
    return json.data as any[]; // array de cartas
}


export async function fetchAllCards() {
    const url = `${BASE_URL}/cardinfo.php`; // devuelve TODO si no se pasan parámetros
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching cards');
    const json = await res.json();
    return json.data as any[];
}


export async function fetchCardById(id: number) {
    const url = `${BASE_URL}/cardinfo.php?id=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching card');
    const json = await res.json();
    return json.data[0] as any;
}