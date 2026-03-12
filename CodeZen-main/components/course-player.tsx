"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/user-context";
import { type Course, LANGUAGE_CONFIGS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Video,
  FileText,
  PlayCircle,
  Award,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface CoursePlayerProps {
  course: Course;
}

export function CoursePlayer({ course }: CoursePlayerProps) {
  const isMobile = useIsMobile();
  const [isButtonActive, setIsButtonActive] = useState(true);
  const on75Percent = useCallback(() => {
    setIsButtonActive(false);
  }, []);
  const router = useRouter();
  return (
    <div className="grid md:grid-cols-[1fr_400px] gap-6 h-[calc(100vh-120px)] px-4">
      {/* Main Content Area */}
      <div className="flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-2xl font-bold">{course.title}</h2>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>

        <div className="flex-1 overflow-auto space-y-6 pr-2">
          {/* Tabs for Video/Notes */}
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-2">
              <TabsTrigger value="video" className="gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden md:inline-flex">Video Lesson</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline-flex">Study Notes</span>
              </TabsTrigger>
              {isMobile && (
                <TabsTrigger value="compiler" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  <span className="hidden md:inline-flex">Compiler</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="video" className="mt-4">
              <div className="aspect-video rounded-xl bg-black overflow-hidden border border-border relative group">
                <YouTubeProgressPlayer
                  videoId={course.url.split("embed/")[1]}
                  on75Percent={on75Percent}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="pt-6 prose prose-invert max-w-none">
                  <CourseNotes notes={course.notes} />
                </CardContent>
              </Card>
            </TabsContent>
            {isMobile && (
              <TabsContent value="compiler" className="mt-4">
                <MiniCompiler language={course.language} />
              </TabsContent>
            )}
          </Tabs>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                disabled={isButtonActive}
                className="gap-2"
                size={isMobile ? "sm" : "default"}
                onClick={() => router.push(`/courses/${course.id}/test`)}
              >
                Take Final Test <Award className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Compiler Side Panel */}
      <div className="md:flex flex-col gap-4 overflow-hidden border-l border-border pl-6 hidden">
        <MiniCompiler language={course.language} />
      </div>
    </div>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, RotateCcw, Code2 } from "lucide-react";
import { LANGUAGE_DATA } from "@/lib/languages";

interface MiniCompilerProps {
  language: string;
}

export function MiniCompiler({ language }: MiniCompilerProps) {
  const [code, setCode] = useState(
    LANGUAGE_DATA.find((l) => l.name === language.toLocaleLowerCase())
      ?.boilerplate
  );
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    LANGUAGE_DATA.find((l) => l.name === language.toLocaleLowerCase())?.name ||
      "javascript"
  );
  useEffect(() => {
    const boilerplate =
      LANGUAGE_DATA.find((l) => l.name === selectedLanguage.toLocaleLowerCase())
        ?.boilerplate || "";
    setCode(boilerplate);
  }, [selectedLanguage]);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C# / .NET" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "rust", label: "Rust" },
  ];

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("https://ce.judge0.com/submissions?wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          language_id:
            LANGUAGE_DATA.find((l) => l.name === selectedLanguage)
              ?.languageId || 1,
          source_code: code,
        }),
      });
      const data = await res.json();
      setOutput(data.stderr ? data.stderr : data.stdout || "No output");
    } catch {
      setOutput("Error running code");
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(
      LANGUAGE_DATA.find((l) => l.name === selectedLanguage.toLocaleLowerCase())
        ?.boilerplate || ""
    );
    setOutput("");
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <Code2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Code Sandbox</span>
      </div>

      {/* Language Selector */}
      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
        <SelectTrigger className="h-8 text-xs w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48 w-full">
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              <div className="flex items-center gap-2">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      LANGUAGE_DATA.find((l) => l.name === lang.value)?.icon ||
                      "",
                  }}
                />
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Code Editor - Compact */}
      <div className="flex-1 rounded-lg border border-border bg-[#1e1e1e] flex flex-col overflow-hidden min-h-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent p-3 font-mono text-xs resize-none outline-none text-white/90 leading-relaxed min-h-0"
          spellCheck={false}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 h-8 text-xs gap-1"
          onClick={handleRunCode}
          disabled={isRunning}
        >
          <Play className="h-3 w-3" />
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1 bg-transparent"
          onClick={handleReset}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Output - Compact */}
      <div className="h-[120px] rounded-lg border border-border bg-black/50 p-3 font-mono text-xs overflow-auto">
        <div className="text-primary text-xs mb-1 flex items-center gap-1">
          <Terminal className="h-3 w-3" /> Output:
        </div>
        <pre className="text-white/80 whitespace-pre-wrap text-xs">
          {output || "Run code to see results..."}
        </pre>
      </div>
    </div>
  );
}

import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import YouTubeProgressPlayer from "./YTPlayer";
import { useRouter } from "next/navigation";

interface CourseNotesProps {
  notes: string;
}

export function CourseNotes({ notes }: CourseNotesProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          //
          // TEXT AND SPACING
          //
          p: (props) => (
            <p
              className="my-3 sm:my-4 leading-relaxed text-sm sm:text-base"
              {...props}
            />
          ),

          //
          // HEADINGS
          //
          h1: (props) => (
            <h1
              className="mt-6 mb-4 text-2xl sm:text-3xl md:text-4xl font-bold"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="mt-6 mb-3 text-xl sm:text-2xl md:text-3xl font-bold border-b pb-2"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="mt-5 mb-2 text-lg sm:text-xl md:text-2xl font-semibold"
              {...props}
            />
          ),

          //
          // TABLES
          //
          table: (props) => (
            <div className="overflow-x-auto my-4 sm:my-6 -mx-4 sm:mx-0 px-4 sm:px-0">
              <table
                className="min-w-full border border-gray-300 rounded-lg text-sm sm:text-base"
                {...props}
              />
            </div>
          ),
          thead: (props) => (
            <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          th: (props) => (
            <th
              className="px-2 sm:px-4 py-2 text-left font-semibold border text-xs sm:text-sm"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="px-2 sm:px-4 py-2 border text-xs sm:text-sm"
              {...props}
            />
          ),

          //
          // CODE BLOCKS
          //
          pre: (props) => (
            <pre
              className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto my-4 text-xs sm:text-sm"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => (
            <code className={`${className} text-xs sm:text-sm`} {...props}>
              {children}
            </code>
          ),
        }}
      >
        {notes}
      </ReactMarkdown>
    </div>
  );
}
