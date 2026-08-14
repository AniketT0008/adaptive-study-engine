import katex from 'katex';
import { formatMath } from '../utils/formatText.js';

const MATH_PATTERN = /(\$[^$]+\$|\\\([^)]+\\\)|\blim\s+[a-zA-Z]\s*(?:→|->)\s*[^\s,;?]+\s+[^,;?]+|[A-Za-z][A-Za-z0-9']*\([^)]*\)\s*=\s*[^,;?]+)/g;

function toLatex(source) {
  let value = source.replace(/^\$|\$$/g, '').replace(/^\\\(|\\\)$/g, '').trim();
  value = value
    .replace(/\blim\s+([a-zA-Z])\s*(?:→|->)\s*([^\s]+)\s+/, '\\lim_{$1\\to $2} ')
    .replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}')
    .replace(/(?:√|sqrt)\s*\(([^)]+)\)/gi, '\\sqrt{$1}')
    .replace(/([A-Za-z0-9)])²/g, '$1^{2}')
    .replace(/([A-Za-z0-9)])³/g, '$1^{3}')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/π/g, '\\pi ')
    .replace(/−/g, '-');
  return value;
}

export default function MathText({ children, className = '' }) {
  const text = String(children ?? '');
  const parts = text.split(MATH_PATTERN).filter(Boolean);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMath = MATH_PATTERN.test(part);
        MATH_PATTERN.lastIndex = 0;
        if (!isMath) return <span key={`${index}-${part}`}>{formatMath(part)}</span>;
        const html = katex.renderToString(toLatex(part), {
          throwOnError: false,
          strict: false,
          trust: false,
          output: 'html',
        });
        return <span key={`${index}-${part}`} className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </span>
  );
}

