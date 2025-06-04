import readline from "readline";

export function setupReadline(chatHandler: (input: string) => Promise<void>) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("Au revoir !");
      rl.close();
      process.exit(0);
    } else {
      await chatHandler(input);
    }
  });
}