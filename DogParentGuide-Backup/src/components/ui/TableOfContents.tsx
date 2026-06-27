// ============================================================
// DogParentGuide - Table of Contents Component
// ============================================================

import { useState, useEffect } from 'react';
import { generateTOC } from '../../utils/helpers';

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);
  const toc = generateTOC(content);

  useEffect(() => {
    const headings = document.querySelectorAll('h2, h3, h4');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [content]);

  if (toc.length < 2) return null;

  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Table of Contents
        </h3>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ol className="mt-4 space-y-2">
          {toc.map((item, index) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
            >
              <a
                href={`#${item.id}`}
                className={`flex items-center gap-2 text-sm py-0.5 transition-colors duration-200 ${
                  activeId === item.id
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-600 hover:text-green-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <span className="flex-shrink-0 w-5 h-5 text-xs bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
