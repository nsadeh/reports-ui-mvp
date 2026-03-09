"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function SelectionToolbar({
  containerRef,
  onQuote,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  onQuote: (text: string) => void;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const toolbarRef = useRef<HTMLButtonElement>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    // Only show if selection is within the report container
    const container = containerRef.current;
    if (!container) return;

    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!anchorNode || !focusNode) return;
    if (!container.contains(anchorNode) || !container.contains(focusNode)) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, [containerRef]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  // Hide on scroll (position goes stale)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hide = () => {
      setPosition(null);
      setSelectedText("");
    };
    container.addEventListener("scroll", hide);
    return () => container.removeEventListener("scroll", hide);
  }, [containerRef]);

  if (!position) return null;

  return (
    <button
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-dark rounded-lg shadow-lg hover:bg-accent transition-colors -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-150"
      style={{ left: position.x, top: position.y }}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent losing selection
        onQuote(selectedText);
        window.getSelection()?.removeAllRanges();
        setPosition(null);
        setSelectedText("");
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Ask about this
    </button>
  );
}
