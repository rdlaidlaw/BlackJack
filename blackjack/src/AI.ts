import type { CardType } from "./Hand";
import {getHandValue} from "./Hand.tsx";

export async function askOllama(myCards: CardType[], dealerUpCard: CardType): Promise<"hit" | "stand"> {
    const handDescription = myCards.map(c => `${c.value}${c.suit}`).join(", ");
    const total = getHandValue(myCards);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                model: "llama3.1:8b",
                system: `
                  You are a Blackjack player.

                  Rules:
                  - Respond with EXACTLY one word.
                  - Allowed responses: "hit" or "stand"
                  - Do NOT include punctuation.
                  - Do NOT include explanations.

                  Your hand: ${handDescription} (total: ${total})
                  Dealer shows: ${dealerUpCard.value}
                  `,
                prompt: "What is your move?",
                stream: false,
                options: { num_predict: 3, temperature: 0.5 }
            })
        });

        clearTimeout(timeout);
        const data = await response.json();
        console.log("RAW OLLAMA:", data);
        const answer = data.response.trim().toLowerCase();
        if (answer === "hit") return "hit";
        if (answer === "stand") return "stand";

        console.warn("Unexpected AI response:", answer);
        return "stand";

    } catch (e) {
        console.log(e);
        clearTimeout(timeout);
        console.warn("Ollama timed out or errored, defaulting to stand");
        return "stand";
    }
}


export async function taunt(playerToTauntCards: CardType[], dealerUpCard: CardType): Promise<String> {
  const handDescription = playerToTauntCards.map(c => `${c.value}${c.suit}`).join(", ");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
      const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
              model: "llama3.1:8b",
              system: `
                You are a Blackjack player.
                There is one other blackjack player at the table. 
                Their cards are the cards you are given below.
                Make a creative, punny taunt that is FAMILY FRIENDLY and not too long.

                Rules:
                - Taunt the player creatively.
                - Allowed responses: something FAMILY FRIENDLY and no more than a sentence.
                - Only give the taunt, no other prefixes.
                - Refer to the other player as "you."
                - The respose must not be more than 50 characters.
                - No quotation marks.


                Your hand: ${handDescription}
                Dealer shows: ${dealerUpCard.value}
                `,
              prompt: "Taunt the player.",
              stream: false,
              options: { num_predict: 50, temperature: 1 }
          })
      });

      clearTimeout(timeout);
      const data = await response.json();
      console.log("RAW OLLAMA:", data);
      const answer = data.response.trim();
      return answer;
  } catch (e) {
      console.log(e);
      clearTimeout(timeout);
      console.warn("Ollama timed out or errored when trying to taunt");
      return "";
  }
}