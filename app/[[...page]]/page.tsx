import { builder } from "@builder.io/sdk";
import "../../app/globals.css";
import BuilderPreviewClient from "./BuilderPreviewClient";

export const revalidate = 5;

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

type PageProps = {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const urlPath = "/" + (params?.page?.join("/") || "");

  const isBuilderEditing =
    !!searchParams["builder.preview"] ||
    !!searchParams["builder.editor"] ||
    !!searchParams["builder.noCache"] ||
    !!searchParams["builder.cachebust"];

  // ✅ In editor/preview: render client component so it can live-update
  if (isBuilderEditing) {
    return <BuilderPreviewClient urlPath={urlPath} />;
  }

  // ✅ In normal mode: server fetch (fast + cacheable)
  const content = await builder
    .get("page", { userAttributes: { urlPath } })
    .toPromise();

  const { RenderBuilderContent } = await import("../src/components/builder");

  return (
    <RenderBuilderContent
      content={content}
      model="page"
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
    />
  );
}
