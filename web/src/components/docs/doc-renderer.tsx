"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n";
import docsData from "@/data/generated/docs.json";
import { MarkdownArticle } from "@/components/docs/markdown-article";

interface DocRendererProps {
  version: string;
}

export function DocRenderer({ version }: DocRendererProps) {
  const locale = useLocale();

  const doc = useMemo(() => {
    const match = docsData.find(
      (d: { version: string; locale: string }) =>
        d.version === version && d.locale === locale
    );
    if (match) return match;
    return docsData.find(
      (d: { version: string; locale: string }) =>
        d.version === version && d.locale === "zh"
    );
  }, [version, locale]);

  if (!doc) return null;

  return <MarkdownArticle content={doc.content} />;
}
