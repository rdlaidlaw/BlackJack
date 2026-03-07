import Quotes from "./Quotes.tsx";
import { useState } from "react";
import Hand, { type CardType } from "./Hand.tsx";
import Deck from "./Deck.ts";

interface GameProps {
    deck: Deck | null;
}

export default function Game({ deck }: GameProps) {
    if (!deck) {
        deck = new Deck();
        deck.createNewDeck();
    }

    const [playerCards, setPlayerCards] = useState<CardType[]>([]);
    const [dealerCards, setDealerCards] = useState<CardType[]>([]);
    const [balance, setBalance] = useState<number>(5000);
    const [bet, setBet] = useState<number>(0);

    function playerHit() {
        if (balance <= 0) return;
        setPlayerCards(prev => [...prev, deck!.draw()]);
    }

    function dealerHit() {
        if (balance <= 0) return;
        setDealerCards(prev => [...prev, deck!.draw()]);
    }

    function resolveHand(playerWins: boolean) {
        if (playerWins) {
            setBalance(prev => prev + bet);
            alert(`You won $${bet}!`);
        } else {
            setBalance(prev => Math.max(prev - bet, 0));
            alert(`You lost $${bet}.`);
        }
        setPlayerCards([]);
        setDealerCards([]);
        setBet(0);
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/5 p-3">
                <Quotes />
            </div>

            <div className="flex flex-col gap-8 flex-1">

                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <p className="text-lg font-bold">Current Bet: ${bet}</p>
                    {balance > 0 && (
                        <input
                            type="number"
                            value={bet}
                            onChange={e => setBet(Number(e.target.value))}
                            placeholder="Enter bet"
                            className="border rounded px-2 py-1 text-right"
                        />
                    )}
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">Dealer</h2>
                    <Hand cards={dealerCards} />
                    <button
                        onClick={dealerHit}
                        className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                        disabled={balance <= 0}
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
                        disabled={balance <= 0}
                    >
                        Hit
                    </button>

                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => resolveHand(true)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            disabled={balance <= 0}
                        >
                            Win Hand
                        </button>
                        <button
                            onClick={() => resolveHand(false)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                            disabled={balance <= 0}
                        >
                            Lose Hand
                        </button>
                    </div>

                    <div className="mt-4">
                        {balance > 0 ? (
                            <p className="text-lg font-bold">Balance: ${balance}</p>
                        ) : (
                            <p className="text-red-600 font-bold">Game Over! You are a loser. Get out of my casino before I call the cops!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}