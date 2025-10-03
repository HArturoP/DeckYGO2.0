export interface CardImage {
    id: number;
    image_url: string;
    image_url_small: string;
}

export interface CardPrice {
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
    coolstuffinc_price: string;
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
    card_prices?: CardPrice[];
}