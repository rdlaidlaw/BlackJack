import Quotes from "./Quotes.tsx";
import Card from "./Card.tsx";
import Hand from "./Hand.tsx";

export default function Game() {
    return (
        <>
        <Quotes />
        // uses props to control a card's values
        <Hand />
        </>
    )
}