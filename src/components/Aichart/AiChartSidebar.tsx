"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { run } from "@/function/actions";
import { useSidebar } from "./SidebarContext";
import {
  Message,
  CopyButtonProps,
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

export const AIChatSidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(384); // デフォルトの幅を384px（24rem）に設定
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setSidebarWidth(Math.max(300, Math.min(newWidth, 1000))); // 最小300px、最大600pxに制限
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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
    <div
      className={`fixed top-0 right-0 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        className="absolute top-0 left-0 w-1 h-full cursor-ew-resize bg-gray-600 hover:bg-blue-500"
        onMouseDown={() => setIsResizing(true)}
      />
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">AIチャット</h1>
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
      </div>
    </div>
  );
};
