// Repurpose Engine - Transform content for multiple platforms

import {
  db,
  type Video,
  type Script,
  type ContentPiece,
  type ContentPieceInsert,
  type PlatformType,
  type ContentFormat,
  PLATFORM_CONFIG,
  truncateText,
  formatHashtags,
  sleep,
} from '@mpowerio/core';

// ============================================
// Types
// ============================================

export interface RepurposeConfig {
  useMockData?: boolean;
  targetPlatforms?: PlatformType[];
}

export interface RepurposeResult {
  video: Video;
  pieces: ContentPiece[];
  errors: Array<{ platform: PlatformType; error: string }>;
}

export interface PlatformTransform {
  platform: PlatformType;
  format: ContentFormat;
  transform: (video: Video, script: Script) => ContentPieceInsert;
}

// ============================================
// Platform-Specific Transforms
// ============================================

const PLATFORM_TRANSFORMS: PlatformTransform[] = [
  {
    platform: 'youtube',
    format: 'short_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'youtube',
      format: 'short_form',
      title: truncateText(script.title, 100),
      caption: generateYouTubeDescription(script),
      hashtags: generateHashtags(script.title, 'youtube'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {
        videoType: 'shorts',
        category: 'Science & Technology',
      },
    }),
  },
  {
    platform: 'youtube',
    format: 'long_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'youtube',
      format: 'long_form',
      title: truncateText(script.title, 100),
      caption: generateYouTubeDescription(script),
      hashtags: generateHashtags(script.title, 'youtube'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {
        videoType: 'regular',
        category: 'Science & Technology',
      },
    }),
  },
  {
    platform: 'tiktok',
    format: 'short_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'tiktok',
      format: 'short_form',
      title: truncateText(script.title, 80),
      caption: generateTikTokCaption(script),
      hashtags: generateHashtags(script.title, 'tiktok'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {
        duetEnabled: true,
        stitchEnabled: true,
      },
    }),
  },
  {
    platform: 'instagram',
    format: 'short_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'instagram',
      format: 'short_form',
      title: truncateText(script.title, 80),
      caption: generateInstagramCaption(script),
      hashtags: generateHashtags(script.title, 'instagram'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {
        shareToFeed: true,
        shareToStory: false,
      },
    }),
  },
  {
    platform: 'twitter',
    format: 'short_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'twitter',
      format: 'short_form',
      title: truncateText(script.title, 60),
      caption: generateTwitterCaption(script),
      hashtags: generateHashtags(script.title, 'twitter'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {},
    }),
  },
  {
    platform: 'linkedin',
    format: 'short_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'linkedin',
      format: 'short_form',
      title: truncateText(script.title, 100),
      caption: generateLinkedInCaption(script),
      hashtags: generateHashtags(script.title, 'linkedin'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {
        visibility: 'PUBLIC',
      },
    }),
  },
  {
    platform: 'threads',
    format: 'short_form',
    transform: (video, script) => ({
      video_id: video.id,
      script_id: script.id,
      platform: 'threads',
      format: 'short_form',
      title: truncateText(script.title, 80),
      caption: generateThreadsCaption(script),
      hashtags: generateHashtags(script.title, 'threads'),
      mentions: [],
      media_url: video.heygen_video_url,
      thumbnail_url: video.thumbnail_url,
      platform_metadata: {},
    }),
  },
];

// ============================================
// Caption Generators
// ============================================

function generateYouTubeDescription(script: Script): string {
  return `${script.hook}

${script.body.slice(0, 500)}...

${script.call_to_action}

---
Follow for more AI content!
`;
}

function generateTikTokCaption(script: Script): string {
  const maxLength = PLATFORM_CONFIG.tiktok.maxCaptionLength;
  const caption = `${script.hook} ${script.call_to_action}`;
  return truncateText(caption, maxLength - 50); // Leave room for hashtags
}

function generateInstagramCaption(script: Script): string {
  return `${script.hook}

${truncateText(script.body, 500)}

${script.call_to_action}

.
.
.
`;
}

function generateTwitterCaption(script: Script): string {
  const maxLength = PLATFORM_CONFIG.twitter.maxCaptionLength;
  return truncateText(script.hook, maxLength - 30); // Leave room for hashtags
}

function generateLinkedInCaption(script: Script): string {
  return `${script.hook}

${script.body}

${script.call_to_action}

What's your take? Drop your thoughts in the comments.`;
}

function generateThreadsCaption(script: Script): string {
  const maxLength = PLATFORM_CONFIG.threads.maxCaptionLength;
  return truncateText(`${script.hook} ${script.call_to_action}`, maxLength - 30);
}

// ============================================
// Hashtag Generator
// ============================================

function generateHashtags(title: string, platform: PlatformType): string[] {
  // Extract keywords from title
  const words = title.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'in', 'on', 'for', 'to', 'of', 'and', 'or'];

  const keywords = words
    .filter((word) => word.length > 3 && !stopWords.includes(word))
    .map((word) => word.replace(/[^a-z0-9]/g, ''))
    .filter((word) => word.length > 0);

  // Add common AI/tech hashtags
  const commonTags = ['ai', 'tech', 'artificialintelligence', 'machinelearning', 'innovation'];

  const allTags = [...new Set([...keywords, ...commonTags])];

  return formatHashtags(allTags, platform).map((tag) => tag.replace('#', ''));
}

// ============================================
// Repurpose Engine Class
// ============================================

export class RepurposeEngine {
  private config: Required<RepurposeConfig>;

  constructor(config: RepurposeConfig = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      targetPlatforms: config.targetPlatforms ?? [
        'youtube',
        'tiktok',
        'instagram',
        'twitter',
        'linkedin',
        'threads',
      ],
    };
  }

  /**
   * Repurpose a video for all target platforms
   */
  async repurposeVideo(video: Video): Promise<RepurposeResult> {
    // Get the associated script
    if (!video.script_id) {
      throw new Error('Video has no associated script');
    }

    const script = await db.scripts.get(video.script_id);
    const pieces: ContentPiece[] = [];
    const errors: Array<{ platform: PlatformType; error: string }> = [];

    // Determine which format to use based on video duration
    const isShortForm = (video.duration_seconds ?? 60) <= 60;
    const targetFormat: ContentFormat = isShortForm ? 'short_form' : 'long_form';

    // Get applicable transforms
    const transforms = PLATFORM_TRANSFORMS.filter(
      (t) =>
        this.config.targetPlatforms.includes(t.platform) &&
        (t.format === targetFormat || t.platform === 'youtube') // YouTube gets both
    );

    // Apply each transform
    for (const transform of transforms) {
      // Skip if format doesn't match (except YouTube which gets both)
      if (transform.format !== targetFormat && transform.platform !== 'youtube') {
        continue;
      }

      // For YouTube, only include the matching format
      if (transform.platform === 'youtube' && transform.format !== targetFormat) {
        continue;
      }

      try {
        await sleep(100); // Small delay to simulate processing

        const pieceInsert = transform.transform(video, script);
        const piece = await db.contentPieces.create(pieceInsert);
        pieces.push(piece);
      } catch (error) {
        errors.push({
          platform: transform.platform,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { video, pieces, errors };
  }

  /**
   * Generate a thread version of a script
   */
  async generateThread(script: Script): Promise<ContentPiece> {
    // Split script into thread-sized chunks
    const threadContent = this.splitIntoThread(script);

    const pieceInsert: ContentPieceInsert = {
      script_id: script.id,
      platform: 'twitter',
      format: 'thread',
      title: script.title,
      caption: threadContent,
      hashtags: generateHashtags(script.title, 'twitter'),
      mentions: [],
      platform_metadata: {
        threadParts: threadContent.split('\n---\n').length,
      },
    };

    return db.contentPieces.create(pieceInsert);
  }

  /**
   * Generate a carousel version of a script
   */
  async generateCarousel(script: Script, platform: 'instagram' | 'linkedin'): Promise<ContentPiece> {
    const slides = this.splitIntoCarousel(script);

    const pieceInsert: ContentPieceInsert = {
      script_id: script.id,
      platform,
      format: 'carousel',
      title: script.title,
      caption: slides.join('\n\n---\n\n'),
      hashtags: generateHashtags(script.title, platform),
      mentions: [],
      platform_metadata: {
        slideCount: slides.length,
        slides,
      },
    };

    return db.contentPieces.create(pieceInsert);
  }

  /**
   * Split script into Twitter thread format
   */
  private splitIntoThread(script: Script): string {
    const maxTweetLength = 280;
    const parts: string[] = [];

    // First tweet is the hook
    parts.push(truncateText(script.hook, maxTweetLength));

    // Split body into chunks
    const sentences = script.body.split(/[.!?]+\s+/);
    let currentPart = '';

    for (const sentence of sentences) {
      const testPart = currentPart ? `${currentPart}. ${sentence}` : sentence;
      if (testPart.length <= maxTweetLength - 10) {
        currentPart = testPart;
      } else {
        if (currentPart) parts.push(currentPart + '.');
        currentPart = sentence;
      }
    }
    if (currentPart) parts.push(currentPart + '.');

    // Last tweet is CTA
    if (script.call_to_action) {
      parts.push(truncateText(script.call_to_action, maxTweetLength));
    }

    return parts.map((p, i) => `${i + 1}/${parts.length} ${p}`).join('\n---\n');
  }

  /**
   * Split script into carousel slides
   */
  private splitIntoCarousel(script: Script): string[] {
    const slides: string[] = [];

    // Slide 1: Hook/Title
    slides.push(script.title);

    // Middle slides: Key points from body
    const paragraphs = script.body.split(/\n\n+/);
    for (const para of paragraphs.slice(0, 5)) {
      if (para.trim()) {
        slides.push(truncateText(para, 200));
      }
    }

    // Final slide: CTA
    if (script.call_to_action) {
      slides.push(script.call_to_action);
    }

    return slides;
  }

  /**
   * Get all content pieces for a video
   */
  async getContentPieces(videoId: string): Promise<ContentPiece[]> {
    const allPieces = await db.contentPieces.list();
    return allPieces.filter((p) => p.video_id === videoId);
  }

  /**
   * Get content pieces by platform
   */
  async getByPlatform(platform: PlatformType): Promise<ContentPiece[]> {
    return db.contentPieces.list({ platform });
  }
}

// ============================================
// Convenience Functions
// ============================================

let defaultInstance: RepurposeEngine | null = null;

export function getRepurposeEngine(config?: RepurposeConfig): RepurposeEngine {
  if (!defaultInstance) {
    defaultInstance = new RepurposeEngine(config);
  }
  return defaultInstance;
}

export async function repurposeVideo(video: Video): Promise<RepurposeResult> {
  const engine = getRepurposeEngine();
  return engine.repurposeVideo(video);
}
