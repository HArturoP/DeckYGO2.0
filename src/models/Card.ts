export interface CardImage {
    id: number;
    image_url: string;
    image_url_small: string;
}


export interface Card {
    id: number;
    name: string;
    type: string;
    desc: string;
    atk?: number;
    def?: number;
    level?: number;
    race?: string;
    archetype?: string;
    card_images: CardImage[];
}