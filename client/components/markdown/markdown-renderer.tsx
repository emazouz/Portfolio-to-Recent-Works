import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import DOMPurify from "dompurify";
import "react-markdown-editor-lite/lib/index.css";
import { MarkdownRendererProps } from "@/types/index.types";

export const TabErrorIndicator = () => (
  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
);

const MarkdownRenderer = ({
  text,
  allowHtml = false,
  className = "",
}: MarkdownRendererProps) => {
  // Sanitize content before passing to ReactMarkdown
  const sanitizedContent = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: allowHtml ? undefined : [],
    ALLOWED_ATTR: allowHtml ? undefined : [],
    KEEP_CONTENT: true,
  });

  const handleCopyCode = async (codeText: string) => {
    try {
      await navigator.clipboard.writeText(codeText);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-3 mt-4 text-gray-900 dark:text-gray-100">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-gray-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mb-2 mt-3 text-gray-900 dark:text-gray-100">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-semibold mb-1 mt-2 text-gray-900 dark:text-gray-100">
        {children}
      </h4>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
        aria-label={`External link: ${children}`}
      >
        {children}
      </a>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="ml-4">{children}</li>,

    // Emphasis
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-gray-100">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
    ),

    // Code
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      // Code block
      if (match) {
        return (
          <div className="relative my-3">
            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-3 overflow-x-auto text-sm">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
            <button
              onClick={() => handleCopyCode(codeString)}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy code to clipboard"
            >
              Copy
            </button>
          </div>
        );
      }

      // Inline code
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-3 italic my-3 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),

    // Horizontal Rule
    hr: () => <hr className="my-4 border-gray-300 dark:border-gray-700" />,

    // Images
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ""}
        className="rounded-lg my-3 max-w-full h-auto"
        loading="lazy"
      />
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </td>
    ),
  };

  return (
    <div
      className={`markdown-body prose prose-sm max-w-none dark:prose-invert ${className}`}
    >
      <ReactMarkdown components={components}>{sanitizedContent}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
