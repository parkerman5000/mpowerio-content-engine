// Script Generator - Claude Prompt Templates

import type { ContentFormat } from '@mpowerio/core';

// ============================================
// Base System Prompt
// ============================================

export const SYSTEM_PROMPT = `You are a professional video scriptwriter specializing in AI/tech content for social media.

Your scripts are:
- Engaging and hook-driven (the first 3 seconds must grab attention)
- Educational but accessible (explain complex topics simply)
- Conversational and authentic (avoid corporate jargon)
- Optimized for the target platform and format

Brand voice: Confident, knowledgeable, slightly casual. Think "smart friend explaining tech" not "corporate presentation."

IMPORTANT: Always structure scripts with:
1. HOOK - Attention-grabbing opening (pattern interrupt, bold claim, or question)
2. BODY - Main content with clear value delivery
3. CTA - Call to action (follow, comment, check link, etc.)`;

// ============================================
// Format-Specific Templates
// ============================================

export interface PromptTemplate {
  name: string;
  format: ContentFormat;
  targetDuration: number; // seconds
  targetWords: number;
  template: string;
}

export const PROMPT_TEMPLATES: Record<ContentFormat, PromptTemplate> = {
  short_form: {
    name: 'Short-Form Video',
    format: 'short_form',
    targetDuration: 45,
    targetWords: 110,
    template: `Create a short-form video script (TikTok/Reels/Shorts style) about:

TOPIC: {{topic}}
DESCRIPTION: {{description}}
KEYWORDS: {{keywords}}

Requirements:
- Duration: 30-60 seconds (approximately 80-150 words)
- Start with an immediate hook (first 3 seconds critical)
- Use pattern interrupts to maintain attention
- End with a clear, simple CTA
- Speak directly to the viewer ("you")
- No section headers in final script (just flowing speech)

Output format:
HOOK: [The opening line that grabs attention]
BODY: [Main content - keep it punchy and fast-paced]
CTA: [What you want them to do next]

Now write the script:`,
  },

  long_form: {
    name: 'Long-Form Video',
    format: 'long_form',
    targetDuration: 300,
    targetWords: 750,
    template: `Create a long-form video script (YouTube style) about:

TOPIC: {{topic}}
DESCRIPTION: {{description}}
KEYWORDS: {{keywords}}

Requirements:
- Duration: 4-6 minutes (approximately 600-900 words)
- Strong hook in first 15 seconds
- Include 3-5 key points with clear structure
- Add retention hooks throughout ("but here's the thing...")
- Include a "value bomb" around the 2-minute mark
- End with CTA + tease for next video
- Can include natural pause points for b-roll

Output format:
HOOK: [Opening that creates curiosity]
INTRO: [Brief context setting]
POINT 1: [First key insight]
POINT 2: [Second key insight]
POINT 3: [Third key insight]
CONCLUSION: [Wrap up + value recap]
CTA: [Subscribe, comment, etc.]

Now write the script:`,
  },

  carousel: {
    name: 'Carousel Post',
    format: 'carousel',
    targetDuration: 0,
    targetWords: 200,
    template: `Create carousel slide content (Instagram/LinkedIn style) about:

TOPIC: {{topic}}
DESCRIPTION: {{description}}
KEYWORDS: {{keywords}}

Requirements:
- 5-8 slides total
- Slide 1: Bold hook/title (grab attention in feed)
- Middle slides: One key point per slide (keep text minimal)
- Last slide: CTA (save, share, follow)
- Each slide should be 10-20 words max
- Use power words and numbers when possible

Output format:
SLIDE 1: [Hook/Title]
SLIDE 2: [Point 1]
SLIDE 3: [Point 2]
SLIDE 4: [Point 3]
SLIDE 5: [Point 4]
SLIDE 6: [Key takeaway]
SLIDE 7: [CTA]

CAPTION: [Full caption with hashtags]

Now write the carousel:`,
  },

  thread: {
    name: 'Twitter/X Thread',
    format: 'thread',
    targetDuration: 0,
    targetWords: 350,
    template: `Create a Twitter/X thread about:

TOPIC: {{topic}}
DESCRIPTION: {{description}}
KEYWORDS: {{keywords}}

Requirements:
- 7-12 tweets in the thread
- Tweet 1: Hook + promise of value (this gets retweeted most)
- Each tweet should be standalone valuable
- Use short sentences and line breaks
- Include numbers and specifics
- End with CTA and thread recap
- Each tweet max 280 characters

Output format:
TWEET 1: [Hook with promise]
TWEET 2: [Context/setup]
TWEET 3-N: [Key points]
FINAL TWEET: [CTA + thread summary]

Now write the thread:`,
  },

  article: {
    name: 'LinkedIn Article',
    format: 'article',
    targetDuration: 0,
    targetWords: 800,
    template: `Create a LinkedIn article about:

TOPIC: {{topic}}
DESCRIPTION: {{description}}
KEYWORDS: {{keywords}}

Requirements:
- 600-1000 words
- Professional but personable tone
- Start with a story or bold statement
- Include personal experience/insights
- Use subheadings for scannability
- End with thought-provoking question or CTA
- No hashtags in body (save for post)

Output format:
HEADLINE: [Compelling article title]
HOOK: [Opening paragraph that draws reader in]
BODY: [Main content with subheadings]
CONCLUSION: [Key takeaway + CTA]

POST CAPTION: [Short caption for the LinkedIn post linking to article]

Now write the article:`,
  },
};

// ============================================
// Prompt Building
// ============================================

export interface PromptVariables {
  topic: string;
  description?: string;
  keywords?: string[];
  tone?: string;
  additionalContext?: string;
}

export function buildPrompt(
  format: ContentFormat,
  variables: PromptVariables
): string {
  const template = PROMPT_TEMPLATES[format];

  let prompt = template.template
    .replace('{{topic}}', variables.topic)
    .replace('{{description}}', variables.description ?? 'Not provided')
    .replace('{{keywords}}', (variables.keywords ?? []).join(', ') || 'Not provided');

  if (variables.tone) {
    prompt += `\n\nTone: ${variables.tone}`;
  }

  if (variables.additionalContext) {
    prompt += `\n\nAdditional context: ${variables.additionalContext}`;
  }

  return prompt;
}

// ============================================
// Tone Presets
// ============================================

export const TONE_PRESETS = {
  professional: 'Professional but accessible. Clear and authoritative without being stiff.',
  casual: 'Relaxed and conversational. Like explaining to a friend over coffee.',
  excited: 'High energy and enthusiastic. Lots of excitement and momentum.',
  educational: 'Teacher-like. Patient explanations with helpful analogies.',
  contrarian: 'Bold and opinionated. Challenge common assumptions.',
  storytelling: 'Narrative-driven. Lead with stories and examples.',
} as const;

export type TonePreset = keyof typeof TONE_PRESETS;
