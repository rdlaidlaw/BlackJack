const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
};

const suitColors = {
    hearts: "text-red-600",
    diamonds: "text-red-600",
    clubs: "text-black",
    spades: "text-black",
};

export default function PlayingCard({ suit = "spades", value = "A" }) {
    // warnings not errors
    const symbol = suitSymbols[suit];
    const color = suitColors[suit];

    return (
        <div className="w-30 h-45 bg-white rounded-2xl border p-3">
            <div className={`text-lg font-bold ${color}`}>
                {value}
                <div className="leading-none">{symbol}</div>
            </div>

            <div className={`flex-1 flex items-center justify-center text-5xl ${color}`}>
                {symbol}
            </div>

            <div className={`text-lg font-bold self-end text-right ${color}`}>
            <div className="leading-none">{symbol}</div>
                {value}
            </div>
        </div>
    );
}