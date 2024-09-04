"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  EditorRefType,
  HandleEditorDidMountType,
  HomeProps,
} from "@/types/editor";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const Home: React.FC<HomeProps> = () => {
  const editorRef: EditorRefType = useRef(null);
  const [editorValue, setEditorValue] = useState<string>("");

  const handleEditorDidMount: HandleEditorDidMountType = (editor, monaco) => {
    editorRef.current = editor;

    // エディタのテーマを設定
    monaco.editor.defineTheme("myDarkTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1f2937",
      },
    });
    monaco.editor.setTheme("myDarkTheme");
  };

  async function showValue(): Promise<void> {
    if (editorRef.current) {
      //code editorに入力されている値を取得
      const value = editorRef.current.getValue();

      const requestBody = {
        compiler: "pypy-3.10-v7.3.15", // PyPyの最新バージョンを指定
        code: value,
        stdin: "",
        options: "warning",
        "compiler-option-raw": "",
        "runtime-option-raw": "",
      };
      try {
        const res = await fetch("https://wandbox.org/api/compile.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();

        console.log(data);
        console.log(data.program_output);
        setEditorValue(data.program_output);
      } catch (e) {
        throw new Error("fetchでエラーが発生しました");
      }

      console.log(value);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* <nav className="p-4">
        <Link
          href="/"
          className="inline-flex items-center py-2 px-4 rounded-md no-underline text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          戻る
        </Link>
      </nav> */}

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <section className="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Pythonエディタ</h1>
          <Editor
            height="60vh"
            defaultLanguage="python"
            defaultValue="# Write your Manim code here"
            className="border-2 border-gray-700 rounded-md mb-4"
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
          <button
            onClick={showValue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            コード実行
          </button>
          {editorValue && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <h2 className="text-lg font-semibold mb-2">実行結果:</h2>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                {editorValue}
              </pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default Home;
