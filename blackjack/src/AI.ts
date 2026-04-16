import ollama from 'ollama';

async function askOllama(prompt: string) {
  const response = await ollama.generate({
    model: "llama3.1:8b",
    system: "You are a Blackjack player. This is your hand: <hand>. Respond only with \"hit\" or \"stand\"",
    prompt: prompt,
    stream: false,
    options: {
      num_predict: 100,
      num_gpu: 64,
      temperature: 0.5
    }
  });

  return response;
}

async function main() {
  const answer = await askOllama("What should I know");
  console.log(answer.response);
}

main();