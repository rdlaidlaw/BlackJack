import { useEffect, useState } from "react";
import { taunt } from "./AI.ts";
import type { CardType } from "./Hand";

interface TauntsProps {
  playerCards: CardType[];
  dealerCard: CardType;
}

export default function Taunts({ playerCards, dealerCard }: TauntsProps) {
  const [t, setTaunt] = useState<string>("");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let clearId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const fetchTaunt = async () => {
      if (!playerCards?.length || !dealerCard) {
        scheduleNext();
        return;
      }

      const q = await taunt(playerCards, dealerCard);

      if (cancelled) return;

      if (q && q.trim() !== "") {
        setTaunt(q);

        clearId = setTimeout(() => {
          setTaunt("");
        }, 9000);
      }

      scheduleNext();
    };

    const scheduleNext = () => {
      const delay = Math.random() * 16000 + 12000;
      timeoutId = setTimeout(fetchTaunt, delay);
    };

    fetchTaunt();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      clearTimeout(clearId);
    };
  }, [playerCards.length, dealerCard?.value, dealerCard?.suit]);

return (
  <div className="relative flex flex-col items-center">
    
    {t && (
      <>
        <div className="relative mb-2">
          <div className="bg-white text-black px-3 py-2 rounded-lg shadow-md max-w-[180px] text-sm relative">
            {t}

            <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-white rotate-45" />
          </div>
        </div>

        <img
          src="/llama.svg"
          alt="llama"
          className="w-28 h-28 object-contain"
        />
      </>
    )}

  </div>
);
}