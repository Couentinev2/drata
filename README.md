# Drata AI Helper - Next.js + Builder.io Application

A modern marketing website built with Next.js 16 and Builder.io, featuring an AI-powered chat assistant for compliance automation inquiries.

## 🚀 Features

- **Visual Page Builder**: Non-technical team members can create and edit pages using Builder.io's drag-and-drop interface
- **AI Chat Assistant**: Interactive chat component that helps users understand compliance frameworks (SOC 2, ISO 27001, HIPAA, GDPR)
- **Server-Side Rendering**: Fast page loads with Next.js App Router and ISR (Incremental Static Regeneration)
- **Type-Safe**: Built with TypeScript for better developer experience
- **Responsive Design**: Modern UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Builder.io account and API key ([Get one here](https://builder.io/account/space))

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd drata
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BUILDER_API_KEY=your_builder_io_api_key_here
   ```
   
   Get your Builder.io API key from [Builder.io Dashboard](https://builder.io/account/space)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
drata-master/
├── app/
│   ├── [[...page]]/          # Dynamic catch-all route for Builder.io pages
│   │   ├── page.tsx          # Server component for page rendering
│   │   └── BuilderPreviewClient.tsx  # Client component for editor preview
│   ├── api/
│   │   └── chat/             # AI chat API endpoint
│   │       └── route.ts
│   ├── src/
│   │   └── components/
│   │       ├── AiAssistant.tsx  # AI chat component
│   │       └── builder.tsx      # Builder.io wrapper component
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles

```

## 🎨 Using Builder.io

1. **Access the Builder.io Editor**
   - Visit your site with `?builder.preview=true` query parameter
   - Or access directly through Builder.io dashboard

2. **Add the AI Assistant Component**
   - Drag and drop the "Drata AI Assistant" component onto your page
   - Customize:
     - Title
     - Welcome message
     - Primary color
     - CTA text and link

3. **Publish Changes**
   - Click "Publish" in Builder.io
   - Changes will be live within 5 seconds (cache revalidation)