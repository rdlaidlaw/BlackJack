import { useEffect, useState } from "react";
import { getRandomQuote, type Quote } from "./QuotesAPI";

export default function Quotes() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      const q = await getRandomQuote();
      if (isMounted) setQuote(q);
    };

    fetchQuote();

    const interval = setInterval(fetchQuote, 5000); // 7 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!quote) return <p>Loading...</p>;

  return (
    <div>
      <p>"{quote.quote}"</p>
      <small>- {quote.author}</small>
    </div>
  );
}