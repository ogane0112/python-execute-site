import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerateContentResult,
} from "@google/generative-ai";

// 環境変数の型定義
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_KEY: string;
    }
  }
}

// GoogleGenerativeAI インスタンスの型定義
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_API_KEY
);

// run 関数の型定義
export async function run(prompt: string): Promise<string> {
  // GenerativeModel インスタンスの型定義
  const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  // generateContent の結果の型定義
  const result: GenerateContentResult = await model.generateContent(prompt);

  // response の型定義
  const response: GenerateContentResult["response"] = await result.response;

  // テキスト結果の型定義
  const text: string = response.text();

  console.log(text);
  return text;
}
