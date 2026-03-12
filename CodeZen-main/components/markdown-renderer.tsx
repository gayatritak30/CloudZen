"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function MarkdownRenderer({
  content,
}: {
  content: string;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre({ children }) {
          return (
            <pre className="overflow-x-auto max-w-full rounded-lg bg-black p-3 text-xs">
              {children}
            </pre>
          );
        },

        code({ className, children, ...props }: any) {
          const isInline = !className;

          if (isInline) {
            return (
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                {children}
              </code>
            );
          }

          return (
            <code className={`${className} text-white`} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}