import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../src/components/builder"; 
import "../../app/globals.css";

export const revalidate = 5;

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams; 
  
  const urlPath = "/" + (params?.page?.join("/") || "");

  const content = await builder
    .get("page", {
      userAttributes: {
        urlPath: urlPath,
      },
      options: searchParams, 
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