// Script Generator - Mock Script Generation

import type { ContentFormat } from '@mpowerio/core';

export interface MockScript {
  hook: string;
  body: string;
  call_to_action: string;
  word_count: number;
  target_duration_seconds: number;
}

// Sample generated scripts based on format
export const MOCK_SCRIPTS: Record<ContentFormat, MockScript[]> = {
  short_form: [
    {
      hook: "Everyone's talking about AI agents, but nobody's explaining WHY they're about to change everything.",
      body: `Here's the thing about AI agents that most people miss.

Traditional automation follows rigid rules. If this, then that. No flexibility.

AI agents? They think. They adapt. They figure things out.

Imagine telling an AI: "Book me a flight to Tokyo next month, find me a good hotel near Shibuya, and make dinner reservations at that ramen place everyone's talking about."

One prompt. Multiple tasks. Zero hand-holding.

That's not automation. That's delegation.

The companies that figure this out first are going to operate at 10x the efficiency of everyone else.`,
      call_to_action: "Follow for more AI insights. What would you delegate to an AI agent first? Drop it in the comments.",
      word_count: 115,
      target_duration_seconds: 45,
    },
    {
      hook: "Stop using ChatGPT like a search engine. Here's what the pros do instead.",
      body: `Most people type one prompt and accept whatever comes out.

That's like asking a chef to make dinner and walking away.

Pro move number one: Give context. Tell the AI who you are, what you're working on, and what success looks like.

Pro move number two: Iterate. The first response is a draft, not a final answer. Push back. Ask for alternatives.

Pro move number three: Chain your prompts. Use the output of one prompt as input for the next.

The AI isn't getting smarter. You are.`,
      call_to_action: "Save this for later. Which tip are you trying first?",
      word_count: 98,
      target_duration_seconds: 40,
    },
  ],

  long_form: [
    {
      hook: "I spent the last month testing every AI video tool on the market. Here's which ones are actually worth your money.",
      body: `Let me save you hundreds of dollars and countless hours.

When I started this channel, creating video content was painful. Scripting, filming, editing - it would take me an entire day to produce one video.

Now? I can create a week's worth of content in a few hours. And it's all because of these three tools.

[FIRST TOOL: HEYGEN]
HeyGen is the closest thing to cloning yourself that exists. You record a few minutes of training data, and it creates a digital avatar that looks and sounds like you.

The quality is insane. Natural head movements, proper lip sync, even subtle facial expressions.

Best use case? Repurposing content. Record one long video, then have your avatar create shorts, reels, and clips.

[SECOND TOOL: ELEVENLABS]
If you've ever been jealous of those smooth, professional voiceovers - ElevenLabs is the answer.

Clone your voice with just 30 seconds of audio. Then generate any script in your voice, in any language.

The emotional range is what gets me. It doesn't sound robotic. It sounds human.

[THIRD TOOL: DESCRIPT]
Editing used to mean hours in Premiere Pro. Now I edit text.

Descript transcribes your video, and you edit like a document. Delete a word from the transcript? It's gone from the video.

They also have AI features for removing filler words, studio sound, and green screen replacement.

[THE SECRET SAUCE]
Here's what nobody tells you. These tools work better together.

Write script with Claude → Generate voice with ElevenLabs → Create avatar video with HeyGen → Polish in Descript.

That's a complete production pipeline that runs while you sleep.`,
      call_to_action: "Which tool are you trying first? Let me know in the comments. And if you want to see my full workflow breakdown, make sure to subscribe - I'm dropping that next week.",
      word_count: 310,
      target_duration_seconds: 180,
    },
  ],

  carousel: [
    {
      hook: "The AI Tools I Actually Use Daily",
      body: `SLIDE 2: For Writing
Claude for long-form. ChatGPT for quick tasks.

SLIDE 3: For Research
Perplexity AI. Faster than Google with sources.

SLIDE 4: For Images
Midjourney for quality. DALL-E for speed.

SLIDE 5: For Video
HeyGen avatars. ElevenLabs voice.

SLIDE 6: For Code
GitHub Copilot. Claude for debugging.

SLIDE 7: Key Insight
The tool doesn't matter. The workflow does.`,
      call_to_action: "Save this for reference 📌\n\nWhich one are you adding to your stack?",
      word_count: 78,
      target_duration_seconds: 0,
    },
  ],

  thread: [
    {
      hook: "I've helped 50+ creators build AI content pipelines.\n\nHere's the framework that works every time:",
      body: `2/ First, understand the Content Funnel:

Research → Script → Record → Edit → Repurpose → Post

Every piece of content flows through these stages.

3/ The mistake most people make?

They try to automate recording first.

Wrong order.

Start with repurposing. That's where AI gives you 10x returns.

4/ Here's why:

One 10-minute video can become:
- 5 short clips
- 1 Twitter thread
- 1 LinkedIn post
- 3 carousels
- 10 quote graphics

Same content. 20 pieces. One hour of work.

5/ My repurposing stack:

• OpusClip - finds viral moments automatically
• Claude - rewrites for each platform
• Canva - generates graphics from templates

6/ Once repurposing is dialed in, move to scripting.

Claude with custom prompts writes 80% of my scripts.

The key is feeding it your voice samples and past content.

7/ Recording is actually the LAST thing to automate.

Why? Because authentic content still wins.

But if you must automate, HeyGen avatars are the best right now.

8/ The complete pipeline:

Morning: Review AI research → approve topics
Midday: Record 2-3 pieces → upload to Descript
Evening: AI handles repurposing while you sleep

9/ Time investment:

Before AI: 20 hours/week on content
After AI: 5 hours/week, 3x the output

10/ The real unlock?

You stop being a content creator and become a content director.

AI does the work. You make the decisions.`,
      call_to_action: "11/ Want my full prompt library for content creation?\n\nDrop a 🔥 and I'll DM you the link.\n\nRetweet to help other creators.",
      word_count: 285,
      target_duration_seconds: 0,
    },
  ],

  article: [
    {
      hook: "Last year, I was burning out creating content. Sixty-hour weeks, endless editing sessions, and a backlog that never got smaller. Then I discovered something that changed everything.",
      body: `The Content Creator's Dilemma

We're all familiar with the treadmill. Create more. Post more. Engage more. The algorithm demands constant feeding, and we sacrifice our wellbeing at its altar.

But here's what I've learned: the problem isn't the volume. It's the process.

The AI-Augmented Workflow

I'm not talking about having ChatGPT write your posts. That's a recipe for generic, forgettable content.

I'm talking about strategic automation of the parts that don't require your unique perspective.

Think about where you actually add value:
- Your ideas and experiences
- Your voice and personality
- Your strategic decisions

Now think about what's just... work:
- Formatting for different platforms
- Basic editing and cleanup
- Scheduling and posting
- Research and fact-checking

The second list? That's where AI shines.

My Actual Workflow

Every Monday morning, I spend two hours on what I call "Content Direction."

I review trending topics in my space. I brainstorm angles. I approve the AI-suggested scripts that match my voice.

Then I batch-record for two hours. No scripts in front of me - just talking points and key messages.

The rest? Automated.

AI clips my long videos into shorts. It rewrites my scripts for each platform. It even generates the thumbnails.

The Human Touch

Here's what I DON'T automate:

The ideas themselves. My hot takes. My personal stories. The strategic decisions about what to create and why.

AI is a force multiplier, not a replacement. It makes your human creativity go further.

The Results

My content output tripled. My burnout disappeared. And counterintuitively, my engagement went up - because I had more energy to actually engage with my community.`,
      call_to_action: "I'm curious: what part of your content workflow takes the most time? Comment below - I might just have an AI solution for it.\n\nAnd if you found this valuable, consider sharing it with a creator who could use a break from the grind.",
      word_count: 340,
      target_duration_seconds: 0,
    },
  ],
};

/**
 * Get a mock script for the given format
 */
export function getMockScript(format: ContentFormat): MockScript {
  const scripts = MOCK_SCRIPTS[format];
  const randomIndex = Math.floor(Math.random() * scripts.length);
  return scripts[randomIndex] ?? scripts[0]!;
}

/**
 * Simulate AI generation delay
 */
export function simulateGenerationDelay(): Promise<void> {
  const delay = 1000 + Math.random() * 2000; // 1-3 seconds
  return new Promise((resolve) => setTimeout(resolve, delay));
}
