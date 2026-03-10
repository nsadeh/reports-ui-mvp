"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function AccessTierBadge({ tier }: { tier: string }) {
  const t = tier.trim().toLowerCase();
  if (t === "preferred") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-lime/40 text-dark rounded">
        Preferred
      </span>
    );
  }
  if (t === "non-preferred") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
        Non-preferred
      </span>
    );
  }
  if (t === "restricted") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
        Restricted
      </span>
    );
  }
  return <span>{tier}</span>;
}

function BiosimilarBadge({ status }: { status: string }) {
  const s = status.trim().toLowerCase();
  if (s.includes("interchangeable")) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-accent/15 text-accent rounded">
        {status.trim()}
      </span>
    );
  }
  if (s === "biosimilar") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/40 text-dark rounded">
        Biosimilar
      </span>
    );
  }
  if (s === "originator") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-bg2 text-body border border-border rounded">
        Originator
      </span>
    );
  }
  return <span>{status}</span>;
}

const markdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-semibold text-dark mt-10 mb-4 first:mt-0" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-semibold text-dark mt-8 mb-3" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-semibold text-dark mt-6 mb-2" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-body leading-[1.7] mb-4" {...props}>{children}</p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-dark" {...props}>{children}</strong>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 mb-4 space-y-1.5 text-body leading-[1.7]" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-body leading-[1.7]" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-body" {...props}>{children}</li>
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-border shadow-sm">
      <table className="w-full text-sm border-collapse" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-dark text-white" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider whitespace-nowrap" {...props}>{children}</th>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-t border-border even:bg-bg2 hover:bg-sage/10 transition-colors" {...props}>{children}</tr>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
    const text = typeof children === "string" ? children : "";

    // Render Access Tier column with colored badges
    const accessTiers = ["preferred", "non-preferred", "restricted"];
    if (accessTiers.includes(text.trim().toLowerCase())) {
      return <td className="px-4 py-2.5" {...props}><AccessTierBadge tier={text} /></td>;
    }

    // Render Biosimilar Status column with badges
    const bioStatuses = ["originator", "biosimilar", "interchangeable biosimilar"];
    if (bioStatuses.includes(text.trim().toLowerCase())) {
      return <td className="px-4 py-2.5" {...props}><BiosimilarBadge status={text} /></td>;
    }

    return <td className="px-4 py-2.5 text-body" {...props}>{children}</td>;
  },
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-3 border-accent bg-bg2 px-4 py-3 mb-4 rounded-r text-body italic" {...props}>{children}</blockquote>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-bg2 text-accent px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>{children}</code>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
    return (
      <a
        href={href}
        className="text-accent underline underline-offset-2 hover:text-dark transition-colors"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  sup: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <sup className="text-[10px] ml-0.5" {...props}>{children}</sup>
  ),
};

export function ReportMarkdown({ content }: { content: string }) {
  return (
    <article className="max-w-none">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}

// Compact markdown for chat messages — smaller text, tighter spacing
const chatComponents = {
  ...markdownComponents,
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-sm font-semibold text-dark mt-3 mb-1" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-sm font-semibold text-dark mt-3 mb-1" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-semibold text-dark mt-2 mb-1" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-body leading-relaxed mb-2 last:mb-0" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-4 mb-2 space-y-0.5 text-sm text-body" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-4 mb-2 space-y-0.5 text-sm text-body" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-sm text-body" {...props}>{children}</li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-dark" {...props}>{children}</strong>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-bg2 text-accent px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-2 rounded border border-border text-xs">
      <table className="w-full" {...props}>{children}</table>
    </div>
  ),
};

export function ChatMarkdown({ content }: { content: string }) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatComponents}>
      {content}
    </ReactMarkdown>
  );
}
