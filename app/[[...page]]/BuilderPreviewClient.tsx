"use client";

import { useEffect, useState } from "react";
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../src/components/builder";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export default function BuilderPreviewClient({ urlPath }: { urlPath: string }) {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await builder
        .get("page", {
          userAttributes: { urlPath },
          options: { cachebust: true, includeUnpublished: true },
        })
        .toPromise();

      if (!cancelled) setContent(result);
    }

    load();
    const interval = window.setInterval(load, 1200);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [urlPath]);

  // ✅ IMPORTANT: don't render Builder component until you actually have content
  if (!content) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        Loading Builder preview…
      </div>
    );
  }

  return (
    <RenderBuilderContent
      content={content}
      model="page"
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
    />
  );
}
