#!/usr/bin/env npx tsx
/**
 * Standalone Script Generator
 * Generates video scripts without requiring Supabase
 *
 * Usage: npx tsx scripts/generate-script.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Types
// ============================================

interface PainPoint {
  id: string;
  category: string;
  pain: string;
  audience: string;
  emotion: string;
  source: string;
  content_angle: string;
  keywords: string[];
}

interface SeedData {
  meta: { created: string; source: string; filter: string };
  pain_points: PainPoint[];
  priority_queue: string[];
}

type ContentFormat = 'short_form' | 'long_form' | 'carousel' | 'thread' | 'article';

// ============================================
// Prompt Templates (inline for standalone use)
// ============================================

const SYSTEM_PROMPT = `You are a professional video scriptwriter for mpowerio.ai, creating content that helps small business owners understand and adopt AI solutions.

Your scripts are:
- Engaging and hook-driven (the first 3 seconds must grab attention)
- Educational but accessible (explain complex topics simply)
- Conversational and authentic (avoid corporate jargon)
- Optimized for the target platform and format
- Grounded in real pain points (frustration, stress, fear, confusion)

Brand voice: Confident, knowledgeable, slightly casual. Think "smart friend explaining tech" not "corporate presentation."

Target audience: Small business owners, contractors, family businesses. Many are tech-hesitant but pain-driven.

IMPORTANT: Always structure scripts with:
1. HOOK - Attention-grabbing opening (pattern interrupt, bold claim, or question)
2. BODY - Main content with clear value delivery
3. CTA - Call to action (follow, comment, check link, etc.)`;

const SHORT_FORM_TEMPLATE = `Create a short-form video script (TikTok/Reels/Shorts style) about:

TOPIC: {{topic}}
PAIN POINT: {{pain}}
TARGET AUDIENCE: {{audience}}
EMOTIONAL TRIGGER: {{emotion}}
KEYWORDS: {{keywords}}

Requirements:
- Duration: 45-60 seconds (approximately 100-140 words)
- Start with an immediate hook that addresses the pain point
- Use pattern interrupts to maintain attention
- Include ONE clear solution or insight
- End with a simple CTA
- Speak directly to the viewer ("you")
- No section headers in final script (just flowing speech)

Output EXACTLY in this format:
---
HOOK:
[The opening line that grabs attention - address the pain directly]

BODY:
[Main content - keep it punchy and fast-paced, deliver the solution]

CTA:
[What you want them to do next]
---

Now write the script:`;

// ============================================
// Script Generation (Mock - replace with Claude API)
// ============================================

function generateMockScript(painPoint: PainPoint): string {
  // This generates a template-based script
  // In production, this would call Claude API

  const scripts: Record<string, { hook: string; body: string; cta: string }> = {
    'pp-001': {
      hook: `"Hey, can you help me with that thing we discussed yesterday?" And your AI assistant goes... "What thing?" Every. Single. Time. Here's why your AI keeps forgetting everything—and the dead-simple fix that changed how I work.`,
      body: `The problem isn't the AI. It's that most AI tools have no memory between sessions. You close the window, context is gone. But here's what the pros do: they create a CLAUDE.md file. It's just a text file that lives in your project folder. Every time you start a session, the AI reads it first. Your conventions, your preferences, your project context—all there. It's like giving your AI assistant a cheat sheet before every conversation. One file. Persistent memory. No more explaining the same thing twice.`,
      cta: `Drop a "memory" in the comments if you want me to show you exactly how to set this up. And follow for more AI productivity hacks that actually work.`
    },
    'pp-007': {
      hook: `I almost nuked a client's live website last week. One wrong git push and everything would've been gone. But GitHub saved me—with a feature I didn't even know existed.`,
      body: `Here's what happened: I tried to push code, and GitHub blocked it. Why? Because my commits contained my personal email instead of my GitHub email. Privacy protection. Now, most people would be annoyed. But think about it—this is a safety net you didn't configure. GitHub is checking your work before it goes public. The same principle applies to your AI workflows. Build in external validators. Use linters. Use type checking. Let the machines catch what you miss. The best systems don't trust you to be perfect. They assume you'll make mistakes and catch them automatically.`,
      cta: `Save this for when you need it. And follow for more hidden features that'll save your projects.`
    },
    'pp-002': {
      hook: `That call you missed while you were on a job site? That was a $15,000 kitchen remodel. Gone. To your competitor. Who answered.`,
      body: `Here's the math that keeps contractors up at night: You miss 30% of calls during work hours. Each missed call is a potential job worth thousands. Do that math over a month, a year. It's brutal. But here's what's changed: AI voice agents now answer like a real person. They speak English AND Spanish. They book appointments directly into your calendar. They text the customer a confirmation. All while you're swinging a hammer. The customer thinks they talked to your office. You get the lead in your pipeline. Nobody falls through the cracks.`,
      cta: `Comment "voice" if you want to see how this works for contractors. Follow for more ways AI is changing the trades.`
    },
    'pp-003': {
      hook: `"Lo siento, no hablo español." How many times has that cost you a job? In construction, half your potential customers speak Spanish. But your phone system doesn't.`,
      body: `Here's what's wild: There are 62 million Spanish speakers in the US. In construction, landscaping, home services—that number is even higher. But most businesses? English only. Even their voicemail. You're literally telling half your market: "We can't help you." Now imagine this: Customer calls, AI answers in Spanish. Books the appointment. Sends confirmation—in Spanish. You show up, close the deal. The customer didn't even know they were talking to AI. They just know you were the one business that understood them.`,
      cta: `Know a contractor who needs this? Tag them. And follow for more on AI that actually helps real businesses.`
    }
  };

  const script = scripts[painPoint.id] || {
    hook: `[HOOK addressing: ${painPoint.pain}]`,
    body: `[BODY with solution for ${painPoint.audience}]`,
    cta: `[CTA related to ${painPoint.content_angle}]`
  };

  return `---
HOOK:
${script.hook}

BODY:
${script.body}

CTA:
${script.cta}
---

METADATA:
- Topic: ${painPoint.content_angle}
- Target Audience: ${painPoint.audience}
- Emotional Trigger: ${painPoint.emotion}
- Keywords: ${painPoint.keywords.join(', ')}
- Word Count: ~${script.hook.split(' ').length + script.body.split(' ').length + script.cta.split(' ').length} words
- Estimated Duration: ~${Math.round((script.hook.split(' ').length + script.body.split(' ').length + script.cta.split(' ').length) / 2.5)} seconds
- Source: ${painPoint.source}
`;
}

// ============================================
// Main
// ============================================

async function main() {
  const seedPath = path.join(__dirname, '..', 'content-seeds', 'pain-points.json');
  const outputDir = path.join(__dirname, '..', 'generated-scripts');

  // Load seed data
  const seedData: SeedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 mpowerio Content Engine - Script Generator');
  console.log('============================================\n');
  console.log(`Loaded ${seedData.pain_points.length} pain points`);
  console.log(`Priority queue: ${seedData.priority_queue.join(', ')}\n`);

  // Generate scripts for priority queue
  for (const id of seedData.priority_queue) {
    const painPoint = seedData.pain_points.find(p => p.id === id);
    if (!painPoint) {
      console.log(`⚠️  Pain point ${id} not found, skipping`);
      continue;
    }

    console.log(`📝 Generating: ${painPoint.content_angle}`);

    const script = generateMockScript(painPoint);
    const filename = `${id}-${painPoint.content_angle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}.md`;
    const filepath = path.join(outputDir, filename);

    const fullContent = `# ${painPoint.content_angle}

## Pain Point
**Category:** ${painPoint.category}
**Pain:** ${painPoint.pain}
**Emotion:** ${painPoint.emotion}

## Script (Short Form - 45-60 seconds)

${script}

## Status
- [ ] Review script
- [ ] Approve for production
- [ ] Generate video
- [ ] Schedule posts

---
*Generated: ${new Date().toISOString()}*
*Source: ${painPoint.source}*
`;

    fs.writeFileSync(filepath, fullContent);
    console.log(`   ✅ Saved to: generated-scripts/${filename}\n`);
  }

  console.log('============================================');
  console.log('✅ Script generation complete!');
  console.log(`📁 Output: ${outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Review generated scripts');
  console.log('2. Mark approved scripts');
  console.log('3. Run video generation pipeline');
}

main().catch(console.error);
