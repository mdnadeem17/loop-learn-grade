import * as dotenv from "dotenv";
dotenv.config();

async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
  const data = await res.json();
  console.log("Models:", data.models?.map(m => m.name).join("\n"));
}

run();
