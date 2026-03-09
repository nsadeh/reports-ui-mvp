import type { MDXComponents } from "mdx/types";

export const reportMdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="text-2xl font-semibold text-dark mt-10 mb-4 first:mt-0" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-xl font-semibold text-dark mt-8 mb-3" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-lg font-semibold text-dark mt-6 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-body leading-[1.7] mb-4" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-dark" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-6 mb-4 space-y-1.5 text-body leading-[1.7]" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-body leading-[1.7]" {...props} />
  ),
  li: (props) => (
    <li className="text-body" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="bg-accent text-white" {...props} />
  ),
  th: (props) => (
    <th className="text-left px-3 py-2.5 font-medium text-xs uppercase tracking-wide" {...props} />
  ),
  tbody: (props) => (
    <tbody className="[&>tr:nth-child(even)]:bg-bg2" {...props} />
  ),
  tr: (props) => (
    <tr className="border-t border-border" {...props} />
  ),
  td: (props) => (
    <td className="px-3 py-2 text-body" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-3 border-accent bg-bg2 px-4 py-3 mb-4 rounded-r text-body italic" {...props} />
  ),
  code: (props) => (
    <code className="bg-bg2 text-accent px-1.5 py-0.5 rounded text-[13px] font-mono" {...props} />
  ),
};
