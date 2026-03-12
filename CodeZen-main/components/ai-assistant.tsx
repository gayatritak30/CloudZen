"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Sparkles, ChevronDown } from "lucide-react";
import MarkdownRenderer from "./markdown-renderer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm CodeZen, your AI coding mentor. How can I help you with your coding journey today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAutoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isAutoScrollEnabled]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const isNearBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <
        100;
      setIsAutoScrollEnabled(isNearBottom);
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    setIsAutoScrollEnabled(true);
    try {
      const response = await fetch("/api/chat-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground group"
        >
          <div className="relative">
            <Bot className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary" />
          </div>
        </Button>
      ) : (
        <Card className="w-full sm:w-[380px] max-w-[calc(100vw-2rem)] h-[520px] shadow-2xl flex flex-col border-primary/20 bg-card/95 backdrop-blur animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-primary px-4 py-3 rounded-t-lg flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-primary-foreground flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />
              Zen Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-4" ref={scrollViewportRef}>
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} w-full`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2 text-sm break-words [overflow-wrap:anywhere] min-w-0 ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border border-border"
                      }`}
                    >
                      <MarkdownRenderer content={m.content} />
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted border border-border rounded-2xl px-4 py-2 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {!isAutoScrollEnabled && (
              <Button
                onClick={() => {
                  setIsAutoScrollEnabled(true);
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                size="sm"
              >
                <ChevronDown className="h-4 w-4" />
                New Messages
              </Button>
            )}
          </CardContent>

          <CardFooter className="p-4 border-t border-border bg-muted/30">
            <form
              onSubmit={handleSend}
              className="flex w-full items-center gap-2"
            >
              <Input
                placeholder="Ask Zen a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-background border-border"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
