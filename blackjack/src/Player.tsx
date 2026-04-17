import type { CardType } from "./Hand";

export type PlayerType = "human" | "ai" | "dealer";
type DoneReason = "Idle" | "Stand" | "Bust" | "Blackjack" | "Thinking";

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  cards: CardType[];
  done: boolean;
  doneReason: DoneReason;
}