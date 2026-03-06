import Card from "./Card.tsx";

export interface CardType {
    suit: string;
    value: string;
}

interface HandProps {
    cards: CardType[];
}

export default function Hand({ cards }: HandProps) {
    return (
        <div className="flex gap-2">
            {cards.map((card, index) => (<Card key={index} suit={card.suit} value={card.value} />))}
        </div>
    );
}