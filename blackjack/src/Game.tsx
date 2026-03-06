import Quotes from "./Quotes.tsx";
import { useState } from "react";
import Hand, { type CardType } from "./Hand.tsx";
import Deck from "./Deck.ts";

interface GameProps {
    deck: Deck | null;
}

export default function Game({ deck }: GameProps) {
    if (!deck) {
        deck = new Deck()
        deck.createNewDeck();
    }
    const [playerCards, setPlayerCards] = useState<CardType[]>([]);
    const [dealerCards, setDealerCards] = useState<CardType[]>([]);

    function playerHit() {
        setPlayerCards(prev => [...prev, deck!.draw()]);
    }

    function dealerHit() {
        setDealerCards(prev => [...prev, deck!.draw()]);
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/5 p-3">
                <Quotes />
            </div>

            <div className="flex flex-col gap-8 flex-1">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">Dealer</h2>
                    <Hand cards={dealerCards} />
                    <button
                        onClick={dealerHit}
                        className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                    >
                        Dealer Draw
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">Player</h2>
                    <Hand cards={playerCards} />
                    <button
                        onClick={playerHit}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                    >
                        Hit
                    </button>
                </div>
            </div>
        </div>
    )
}