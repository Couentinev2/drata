import { NextResponse } from 'next/server';

const KNOWLEDGE_BASE = [
  {
    keywords: ["soc 2", "soc2"],
    answer: "SOC 2 is a compliance standard for service organizations, focusing on security, availability, processing integrity, confidentiality, and privacy. Drata automates evidence collection to help you get audit-ready in weeks, not months."
  },
  {
    keywords: ["iso", "27001"],
    answer: "ISO 27001 is the international standard for information security. Drata provides pre-mapped controls and automated monitoring to help you achieve ISO 27001 certification faster."
  },
  {
    keywords: ["hipaa"],
    answer: "HIPAA sets the standard for sensitive patient data protection. Drata helps healthcare companies automate HIPAA compliance by monitoring employee training and workstation security."
  },
  {
    keywords: ["gdpr"],
    answer: "GDPR is the toughest privacy and security law in the world. Drata helps you track data processors and ensure you are handling EU citizen data correctly."
  },
  {
    keywords: ["pricing", "cost"],
    answer: "Our pricing scales with your company size and the number of frameworks you need. For a custom quote, please click the 'Book a Demo' button above!"
  }
];


export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const userText = message.toLowerCase();


    let match = KNOWLEDGE_BASE.find(entry => 
      entry.keywords.some(keyword => userText.includes(keyword))
    );

    const responseText = match 
      ? match.answer 
      : "I can help with compliance frameworks like SOC 2, ISO 27001, HIPAA, and GDPR. Could you clarify your question?";

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const chunks = responseText.split(" ");
        
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk + " "));
          await new Promise(r => setTimeout(r, 50)); 
        }
        controller.close();
      }
    });

    return new Response(stream);

  } catch (error) {
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}