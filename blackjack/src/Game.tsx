import Quotes from "./Quotes.tsx";
import Taunts from "./Taunts.tsx";
import { useState, useEffect, useRef } from "react";
import Hand, { type CardType, getHandValue } from "./Hand.tsx";
import Deck from "./Deck.ts";
import type { Player } from "./Player.tsx";
import {askOllama} from "./AI.ts";

interface GameProps {
    deck: Deck | null;
}

const INITIAL_PLAYERS: Player[] = [
    { id: "ai1",   name: "Llama", type: "ai",    cards: [], done: false, doneReason: "Idle" },
    { id: "human", name: "You",     type: "human", cards: [], done: false, doneReason: "Idle" },
];


export default function Game({ deck }: GameProps) {
    const deckRef = useRef<Deck>(deck ?? (() => { const d = new Deck(); d.createNewDeck(); return d; })());
    const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
    const [dealerCards, setDealerCards] = useState<CardType[]>([]);
    const [balance, setBalance] = useState<number>(5000);
    const [bet, setBet] = useState<number>(0);
    const [phase, setPhase] = useState<"betting" | "player" | "ai" | "dealer" | "done">("betting");

    useEffect(() => { dealNewRound(); }, []);

    function dealNewRound() {
        setDealerCards([]);
        setPlayers(INITIAL_PLAYERS.map(p => ({ ...p, cards: [], done: false, doneReason: "Idle" })));
        setPhase("betting");
        setBet(0);
    }

    function startRound() {
        const d = deckRef.current;
        setDealerCards([d.draw()]);
        setPlayers(prev => prev.map(p => ({ ...p, cards: [d.draw(), d.draw()] })));
        setPhase("player");
    }

    function updatePlayer(id: string, update: Partial<Player>) {
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...update } : p));
    }

    function humanHit() {
        setPlayers(prev => {
            let busted = false;

            const updated = prev.map(p => {
                if (p.id !== "human") return p;

                const newCards = [...p.cards, deckRef.current.draw()];
                const isBust = getHandValue(newCards) > 21;

                if (isBust) busted = true;

                return { ...p, cards: newCards, done: isBust, doneReason: isBust ? "Bust" : "Idle" };
            });

            if (busted) {
                setPhase("ai");

                const snapshot = updated.map(p =>
                    p.id === "human" ? { ...p, done: true } : p
                );

                setTimeout(() => runAITurns(snapshot), 500);
            }

            return updated;
        });
    }

    function humanStand() {
        updatePlayer("human", { done: true });
        setPhase("ai");
        const snapshot = players.map(p => p.id === "human" ? { ...p, done: true, doneReason: "Stand" } : p);
        setTimeout(() => runAITurns(snapshot), 500);
    }

    async function runAITurns(currentPlayers: Player[]) {
        for (const aiPlayer of currentPlayers.filter(p => p.type === "ai")) {
            let cards = [...aiPlayer.cards];
            let busted = false;

            while (true) {
                const action = await askOllama(cards, dealerCards[0]);
                if (action === "stand") break;

                cards = [...cards, deckRef.current.draw()];
                currentPlayers = currentPlayers.map(p =>
                    p.id === aiPlayer.id ? { ...p, cards } : p
                );
                setPlayers([...currentPlayers]);
                await new Promise(r => setTimeout(r, 2000));

                if (getHandValue(cards) > 21) {
                    busted = true;
                    break;
                }
            }

            currentPlayers = currentPlayers.map(p =>
                p.id === aiPlayer.id ? { ...p, done: true, doneReason: busted ? "Bust" : "Stand" } : p
            );
            setPlayers([...currentPlayers]);
        }

        setPhase("dealer");
        await runDealerTurn(currentPlayers);
    }

    async function runDealerTurn(finalPlayers: Player[]) {
        let dc = [...dealerCards];
        while (getHandValue(dc) < 17) {
            await new Promise(r => setTimeout(r, 2000));
            dc = [...dc, deckRef.current.draw()];
            setDealerCards([...dc]);
        }
        await new Promise(r => setTimeout(r, 800));
        resolveAllHands(finalPlayers, getHandValue(dc));
    }

    function resolveAllHands(finalPlayers: Player[], dealerScore: number) {
        const human = finalPlayers.find(p => p.id === "human")!;
        const playerScore = getHandValue(human.cards);

        if (playerScore > 21 || (dealerScore <= 21 && dealerScore >= playerScore)) {
            if (playerScore === dealerScore && playerScore <= 21) {
                alert("Push! Bet returned.");
            } else {
                setBalance(prev => Math.max(prev - bet, 0));
                alert(`You lost $${bet}.`);
            }
        } else {
            setBalance(prev => prev + bet);
            alert(`You won $${bet}!`);
        }

        setPhase("done");
        setTimeout(dealNewRound, 1000);
    }

    const human = players.find(p => p.id === "human")!;
    const llama = players.find(p => p.id === "ai1");

    return (
        <div className="flex h-screen bg-[url('./assets/background.png')] bg-cover bg-center">
            <div className="w-1/5 text-[#FFD700] font-serif text-3xl italic mt-[15px] ml-[10px]">
            <Quotes />
            </div>

            <div className="w-1/5 text-[#FFD700] font-serif flex justify-center mt-[400px] mr-[25px]">
            {dealerCards.length > 0 && human.cards.length > 0 && (
                <Taunts
                playerCards={human.cards}
                dealerCard={dealerCards[0]}
                />
            )}
            </div>

            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                <div className="mt-4">
                {balance > 0 ? (
                    <p className="text-[#FFD700] font-serif text-lg font-bold">
                    Balance: ${balance}
                    </p>
                ) : (
                    <p className="text-red-600 font-bold">
                    Game Over! You are a loser. Get out of my casino before I call the cops!
                    </p>
                )}
                </div>

                <p className="text-[#FFD700] font-serif text-lg font-bold">
                Current Bet: ${bet}
                </p>

                {phase === "betting" && balance > 0 && (
                <>
                    <input
                    type="number"
                    value={bet}
                    onChange={e => {
                        const newBet = Number(e.target.value);
                        if (newBet > balance) {
                        alert("Cannot bet more than balance!");
                        return;
                        }
                        setBet(newBet);
                    }}
                    className="text-[#FFD700] font-serif border rounded px-2 py-1 text-right"
                    />

                    <button
                    onClick={startRound}
                    disabled={bet <= 0}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                    Deal
                    </button>
                </>
                )}
            </div>
        
        <div className="flex flex-col flex-1 items-center justify-start pt-6">
            <div className="flex flex-col items-center mb-10">
                <h2 className="text-[#FFD000] font-serif text-xl font-bold">Dealer</h2>
                <Hand cards={dealerCards} />
            </div>
            
            <div className="flex gap-20">
                <div className="flex flex-col items-center w-1/2">
                    <h2 className="text-[#FFD000] font-serif text-lg font-bold">
                        Llama
                    </h2>

                    <Hand cards={players.find(p => p.id === "ai1")?.cards ?? []} />

                    <p className="text-[#FFD700] text-sm italic">
                        {llama?.doneReason === "Thinking" && "Thinking..."}
                        {llama?.doneReason === "Bust" && "Busted!"}
                        {llama?.doneReason === "Stand" && "Stood"}
                        {llama?.doneReason === "Idle" && ""}
                    </p>
                    </div>


                    <div className="flex flex-col items-center w-1/2">
                    <h2 className="text-[#FFD000] font-serif text-xl font-bold">
                        You
                    </h2>

                    <Hand cards={human.cards} />

                    <p className="text-[#FFD700] text-sm italic">
                        {human?.doneReason === "Thinking" && "Thinking..."}
                        {human?.doneReason === "Bust" && "Busted!"}
                        {human?.doneReason === "Stand" && "Stood"}
                        {human?.doneReason === "Idle" && ""}
                    </p>
                    
                    {phase === "player" && (
                        <>
                        <button
                            onClick={humanHit}
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-[450px]"
                        >
                            Hit
                        </button>

                        <button
                            onClick={humanStand}
                            className="bg-red-500 text-white px-3 py-1 rounded mt-2 mr-[450px]"
                        >
                            Stand
                        </button>
                        </>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}