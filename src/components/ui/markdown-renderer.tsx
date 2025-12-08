import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-invert prose-sm max-w-none", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-champagne mb-3 mt-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gold-light mb-2 mt-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-champagne mb-2 mt-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-platinum mb-3 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-3 ml-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-3 ml-1 text-platinum">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-platinum flex items-start gap-2">
              <span className="text-gold mt-1.5 text-xs">●</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors inline-flex items-center gap-1"
            >
              {children}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-champagne">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-platinum-dark">{children}</em>
          ),
          code: ({ children }) => (
            <code className="bg-obsidian-dark/50 px-1.5 py-0.5 rounded text-gold-light text-sm font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-obsidian-dark/70 p-4 rounded-lg overflow-x-auto mb-3 border border-gold/10">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gold/50 pl-4 italic text-platinum-dark mb-3">{children}</blockquote>
          ),
          hr: () => (
            <hr className="border-gold/20 my-4" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gold/20 rounded-lg overflow-hidden">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-gold/10 px-4 py-2 text-left text-champagne font-medium border-b border-gold/20">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-platinum border-b border-gold/10">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
