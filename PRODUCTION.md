# Productionization Next Steps

## Analytics

### Implementation

**Vercel Analytics + Speed Insights**

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Track Custom Events

```typescript
import { track } from '@vercel/analytics';

// In AiAssistant component
track('ai_assistant_opened');
track('ai_message_sent', { message_length: message.length });
track('ai_cta_clicked', { cta_text: ctaText });
```

### Metrics to Monitor

- Page views and unique visitors
- AI Assistant usage (opens, messages, CTA clicks)
- Conversion rates (demo bookings)
- Core Web Vitals
- Error rates

---

## Privacy & Compliance

### Cookie Consent

Implement cookie consent banner (e.g., Cookiebot, OneTrust) before loading analytics.

### Privacy Notice

Add to `AiAssistant` component:

```typescript
<p className="text-xs text-slate-400 mt-2">
  Your conversations are not stored. 
  <a href="/privacy" className="underline">Privacy Policy</a>
</p>
```

### Data Handling

- **Current**: No user data stored, chat messages processed in-memory only
- **Privacy Policy**: Document data collection practices and AI Assistant data handling
- **GDPR/CCPA**: Provide opt-out mechanisms and data deletion request process

---

## Rate Limiting

### Implementation: Upstash Redis

```bash
npm install @upstash/ratelimit @upstash/redis
```

**Option 1: API Route Level**

```typescript
// app/api/chat/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  
  // ... existing chat logic
}
```

**Option 2: Edge Middleware**

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const config = {
  matcher: "/api/chat",
};

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

export async function middleware(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }
}
```

### Rate Limit Strategy

- **Per IP**: 10 requests per minute
- **Per Session**: 50 requests per hour (requires session tracking)
- **Escalation**: Exponential backoff for repeated violations

### Environment Variables

Add to `.env.local`:

```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

---

## Quick Checklist

- [ ] Install and configure Vercel Analytics
- [ ] Add privacy notice to AI Assistant
- [ ] Create privacy policy page
- [ ] Set up Upstash Redis
- [ ] Implement rate limiting on `/api/chat`
- [ ] Configure environment variables in Vercel
- [ ] Test rate limiting behavior
- [ ] Verify analytics tracking

