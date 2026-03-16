'use client';

import React from 'react';

/**
 * Lightweight markdown-to-JSX renderer for AI-generated content.
 * Handles: headings, bold, italic, bullet lists, numbered lists, and paragraphs.
 * No external dependencies.
 */
export function MarkdownContent({
  content,
  className = '',
}: {
  content: string;
  className?: string;
}) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' | null = null;

  function flushList() {
    if (listItems.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag
          key={`list-${elements.length}`}
          className={`${listType === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1 my-2`}
        >
          {listItems}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  }

  function renderInline(text: string): React.ReactNode[] {
    // Handle **bold** and *italic* inline formatting
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1]) {
        parts.push(<strong key={match.index} className="font-semibold text-gfm-dark">{match[1]}</strong>);
      } else if (match[2]) {
        parts.push(<em key={match.index}>{match[2]}</em>);
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      if (level === 1) {
        elements.push(<h3 key={i} className="text-base font-bold text-gfm-dark mt-4 mb-2">{renderInline(text)}</h3>);
      } else if (level === 2) {
        elements.push(<h4 key={i} className="text-sm font-bold text-gfm-dark mt-3 mb-1.5">{renderInline(text)}</h4>);
      } else {
        elements.push(<h5 key={i} className="text-sm font-semibold text-gfm-dark mt-2 mb-1">{renderInline(text)}</h5>);
      }
      continue;
    }

    // Bullet lists
    if (/^[-*]\s+/.test(trimmed)) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(<li key={i} className="text-sm text-gfm-secondary leading-relaxed">{renderInline(trimmed.replace(/^[-*]\s+/, ''))}</li>);
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s+/.test(trimmed)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(<li key={i} className="text-sm text-gfm-secondary leading-relaxed">{renderInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={i} className="text-sm text-gfm-secondary leading-relaxed mb-2">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className={className}>{elements}</div>;
}
