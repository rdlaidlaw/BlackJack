import { useState } from "react";
import Card from "./Card.tsx";

interface Card {
    suit: string;
    value: string;
}

export default function Hand() {
    const [cards, setCards] = useState<Card[]>([]);

    function addCard(card: Card) {
        setCards(prev => [...prev, card]);
    }

    function showCards() {
        return cards.map((card, index) => (
            <Card key={index} suit={card.suit} value={card.value} />
        ));
    }

    return (
        <div>
            <button onClick={() => addCard({ suit: "hearts", value: "A" })} className="bg-blue-500 text-white px-4 py-2 rounded">
                Hit
            </button>
            {showCards()}
        </div>
    );
}