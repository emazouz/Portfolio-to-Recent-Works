import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import DOMPurify from "dompurify";
import "react-markdown-editor-lite/lib/index.css";
import { MarkdownContentProps } from "@/types/index.types";

export const MarkdownContent = ({
  content,
  allowHtml = false,
}: MarkdownContentProps) => {
  // Sanitize content before passing to ReactMarkdown
  // This protects against XSS if content comes from untrusted sources
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowHtml ? undefined : [], // If allowHtml is false, strip all HTML tags
    ALLOWED_ATTR: allowHtml ? undefined : [], // If allowHtml is false, strip all attributes
    KEEP_CONTENT: true, // Keep text content even when stripping tags
  });

  const handleCopyCode = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mb-2 mt-3">{children}</h4>
    ),

    // Paragraphs
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline transition-colors"
        aria-label={`External link: ${children}`}
      >
        {children}
      </a>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="ml-4">{children}</li>,

    // Emphasis
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,

    // Code
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      // Code block
      if (match) {
        return (
          <div className="relative my-4">
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
            <button
              onClick={() => handleCopyCode(codeString)}
              className="absolute top-2 right-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy code to clipboard"
            >
              Copy
            </button>
          </div>
        );
      }

      // Inline code
      return (
        <div className="text-wrap">
          <code
            className="relative border-blue-500 pl-3 italic my-4 text-gray-600"
            {...props}
          >
            {children}
          </code>
        </div>
      );
    },

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700">
        {children}
      </blockquote>
    ),

    // Horizontal Rule
    hr: () => <hr className="my-8 border-gray-300" />,

    // Images
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ""}
        className="rounded-lg my-4 max-w-full h-auto"
        loading="lazy"
      />
    ),
  };

  return (
    <ReactMarkdown components={components}>{sanitizedContent}</ReactMarkdown>
  );
};
