"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { run } from "@/function/actions";
import {
  Message,
  CopyButtonProps,
  AIChatComponentProps,
  CustomComponentsType,
  CodeProps,
} from "@/types/chart";

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const AIChatComponent: React.FC<AIChatComponentProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");

    const responseMessage: string = await run(inputMessage);
    const aiResponse: Message = {
      id: Date.now() + 1,
      text: responseMessage,
      sender: "ai",
    };
    setMessages((prevMessages) => [...prevMessages, aiResponse]);
  };

  const customComponents: CustomComponentsType = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="relative">
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
          <CopyButton text={String(children)} />
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <nav className="p-4">
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
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <section className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg flex flex-col h-[80vh]">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold">AIチャット</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {message.sender === "ai" && (
                    <div className="font-bold mb-1">AI</div>
                  )}
                  <ReactMarkdown components={customComponents}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-700"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                送信
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AIChatComponent;
