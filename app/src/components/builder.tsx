'use client'; 
import { ComponentProps, useEffect, useState } from "react";
import { Content, isPreviewing } from "@builder.io/sdk-react-nextjs";
import { AiAssistant } from "./AiAssistant";

const customComponents = [
  {
    component: AiAssistant,
    name: "Drata AI Assistant",
    inputs: [
      { name: "title", type: "string", defaultValue: "Drata AI Helper" },
      { name: "welcomeMessage", type: "longText", defaultValue: "Hi! Ask me about SOC 2." },
      { name: "primaryColor", type: "color", defaultValue: "#0055FF" },
      { name: "ctaText", type: "string", defaultValue: "Book a Demo" },
      { name: "ctaLink", type: "url", defaultValue: "https://drata.com/demo" },
    ],
  },
];

type BuilderPageProps = ComponentProps<typeof Content>;

export function RenderBuilderContent({ content, model, apiKey }: BuilderPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (content || isPreviewing()) {
    return (
      <Content
        content={content}
        model={model}
        apiKey={apiKey}
        customComponents={customComponents}
      />
    );
  }

  return <div>404 - Page Not Found</div>;
}