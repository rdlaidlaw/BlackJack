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

export function getHandValue(cards: CardType[]) {
    let total = 0, aces = 0;
    for (const card of cards) {
        if (["J","Q","K"].includes(card.value)) total += 10;
        else if (card.value === "A") { total += 11; aces++; }
        else total += Number(card.value);
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
}