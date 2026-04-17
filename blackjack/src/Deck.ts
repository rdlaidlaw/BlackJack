import { type CardType } from "./Hand";

export default class Deck {
    cards: CardType[];
    suits = ["hearts", "spades", "clubs", "diamonds"];
    values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

    constructor() {
        this.cards = [];
        this.createNewDeck();
    }

    createNewDeck() {
        for (const suit of this.suits) {
            for (const value of this.values) {
                this.cards.push({ suit, value });
            }
        }
        this.shuffle();
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    draw(): CardType {
        if (this.cards.length === 0) {
            this.createNewDeck();
        }
        return this.cards.pop()!
    }
}