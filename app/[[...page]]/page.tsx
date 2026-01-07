import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../src/components/builder";
import "../../app/globals.css";
import { unstable_noStore as noStore } from "next/cache";

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

  if (isBuilderEditing) noStore();

  const content = await builder
    .get("page", {
      userAttributes: { urlPath },
      options: isBuilderEditing
        ? { cachebust: true, includeUnpublished: true }
        : undefined,
    })
    .toPromise();

  return (
    <RenderBuilderContent
      content={content}
      model="page"
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
    />
  );
}
