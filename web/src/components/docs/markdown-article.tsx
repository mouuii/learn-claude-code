"use client";

import { useMemo } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

interface MarkdownArticleProps {
  content: string;
}

function renderMarkdown(md: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeStringify)
    .processSync(md);
  return String(result);
}

function postProcessHtml(html: string): string {
  html = html.replace(
    /<pre><code class="hljs language-(\w+)">/g,
    '<pre class="code-block" data-language="$1"><code class="hljs language-$1">'
  );

  html = html.replace(
    /<pre><code(?! class="hljs)([^>]*)>/g,
    '<pre class="ascii-diagram"><code$1>'
  );

  html = html.replace(
    /<blockquote>/,
    '<blockquote class="hero-callout">'
  );

  html = html.replace(/<h1>.*?<\/h1>\n?/, "");

  html = html.replace(
    /<ol start="(\d+)">/g,
    (_, start) => `<ol style="counter-reset:step-counter ${parseInt(start, 10) - 1}">`
  );

  return html;
}

export function MarkdownArticle({ content }: MarkdownArticleProps) {
  const html = useMemo(() => {
    const raw = renderMarkdown(content);
    return postProcessHtml(raw);
  }, [content]);

  return (
    <div className="py-4">
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
