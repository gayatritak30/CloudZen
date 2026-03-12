"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  RotateCcw,
  Save,
  Plus,
  X,
  Terminal,
  Code2,
  MoveLeft,
} from "lucide-react";
import { LANGUAGE_DATA } from "@/lib/languages";
import Link from "next/link";

export default function CompilerPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("main");

  const languages = [
    { value: "javascript", label: "JavaScript", extension: "js" },
    { value: "python", label: "Python", extension: "py" },
    { value: "c", label: "C", extension: "c" },
    { value: "cpp", label: "C++", extension: "cpp" },
    { value: "java", label: "Java", extension: "java" },
    { value: "csharp", label: "C# / .NET", extension: "cs" },
    { value: "go", label: "Go", extension: "go" },
    { value: "ruby", label: "Ruby", extension: "rb" },
    { value: "php", label: "PHP", extension: "php" },
    { value: "rust", label: "Rust", extension: "rs" },
  ];

  const [files, setFiles] = useState([
    {
      id: "main",
      name: "main.js",
      language: "javascript",
      code:
        LANGUAGE_DATA.find((l) => l.name === selectedLanguage)?.boilerplate ||
        "",
    },
  ]);

  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [executionTime, setExecutionTime] = useState("");

  const activeFile = files.find((f) => f.id === activeTab);

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);

    const langConfig = languages.find((l) => l.value === newLanguage);
    const updatedFiles = files.map((file) => {
      if (file.id === activeTab) {
        return {
          ...file,
          language: newLanguage,
          name: `${file.name.split(".")[0]}.${langConfig?.extension || "txt"}`,
          code:
            LANGUAGE_DATA.find((l) => l.name === newLanguage)?.boilerplate ||
            "",
        };
      }
      return file;
    });
    setFiles(updatedFiles);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const startTime = Date.now();
    const res = await fetch("https://ce.judge0.com/submissions?wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        language_id:
          LANGUAGE_DATA.find((l) => l.name === selectedLanguage)?.languageId ||
          1,
        source_code: activeFile?.code || "",
      }),
    });
    const data = await res.json();
    console.log(data);
    data.stderr ? setOutput(data.stderr || "") : setOutput(data.stdout || "");
    setExecutionTime(data.time + "s" || "");
    setIsRunning(false);
  };

  const handleReset = () => {
    setOutput("");
    setExecutionTime("");
    const updatedFiles = files.map((file) => {
      if (file.id === activeTab) {
        return { ...file, code: "" };
      }
      return file;
    });
    setFiles(updatedFiles);
  };

  const handleCodeChange = (value: string) => {
    const updatedFiles = files.map((file) => {
      if (file.id === activeTab) {
        return { ...file, code: value };
      }
      return file;
    });
    setFiles(updatedFiles);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="border-b border-border  px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div
            dangerouslySetInnerHTML={{
              __html:
                LANGUAGE_DATA.find((l) => l.name === selectedLanguage)?.icon ||
                "",
            }}
          ></div>
          <h1 className="text-sm md:text-xl font-bold">Code Compiler</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange} >
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <div className="flex items-center gap-2">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          LANGUAGE_DATA.find((l) => l.name === lang.value)
                            ?.icon || "",
                      }}
                    ></div>
                    <span className="text-xs md:text-base">{lang.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          {/* Code Editor */}
          <div className="flex-1 h-full overflow-hidden p-4 bg-muted/10">
            <Textarea
              value={activeFile?.code || ""}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full font-mono text-xs sm:text-sm bg-card border-border resize-none focus-visible:ring-primary"
              placeholder={`Write your ${selectedLanguage} code here...`}
            />
          </div>

          {/* Action Bar */}
          <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>

            {executionTime && (
              <div className="text-sm text-muted-foreground">
                Execution time: {executionTime}
              </div>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-full md:w-[35%] border-l border-border bg-card flex flex-col">
          <Tabs defaultValue="output" className="flex-1 flex flex-col">
            <TabsContent
              value="output"
              className="flex-1 overflow-auto p-4 m-0"
            >
              {output ? (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Output</span>
                  </div>
                  <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Terminal className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">No output yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Run your code to see the output here
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
