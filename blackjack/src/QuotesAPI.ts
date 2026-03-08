import quotes from "./assets/quotes.json";

export type Quote = {
  quote: string;
  author: string;
};

export function getRandomQuote(): Promise<Quote> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random =
        quotes[Math.floor(Math.random() * quotes.length)];
      resolve(random as Quote);
    }, 800);
  });
}