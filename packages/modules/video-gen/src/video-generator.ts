// Video Generator Module - Stub Implementation

import {
  db,
  type Video,
  type VideoInsert,
  type Script,
  generateId,
  sleep,
} from '@mpowerio/core';

// ============================================
// Types
// ============================================

export interface VideoJob {
  id: string;
  scriptId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoGenConfig {
  useMockData?: boolean;
  heygenApiKey?: string;
  heygenAvatarId?: string;
  elevenlabsApiKey?: string;
  elevenlabsVoiceId?: string;
  defaultResolution?: string;
}

export interface CreateVideoOptions {
  avatarId?: string;
  voiceId?: string;
  resolution?: string;
}

// ============================================
// Video Generator Class
// ============================================

export class VideoGenerator {
  private config: Required<VideoGenConfig>;
  private jobs: Map<string, VideoJob> = new Map();

  constructor(config: VideoGenConfig = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      heygenApiKey: config.heygenApiKey ?? process.env.HEYGEN_API_KEY ?? '',
      heygenAvatarId: config.heygenAvatarId ?? process.env.HEYGEN_AVATAR_ID ?? '',
      elevenlabsApiKey: config.elevenlabsApiKey ?? process.env.ELEVENLABS_API_KEY ?? '',
      elevenlabsVoiceId: config.elevenlabsVoiceId ?? process.env.ELEVENLABS_VOICE_ID ?? '',
      defaultResolution: config.defaultResolution ?? '1080x1920',
    };
  }

  /**
   * Create a video from an approved script
   */
  async createVideo(script: Script, options?: CreateVideoOptions): Promise<Video> {
    // Create the video record in pending state
    const videoInsert: VideoInsert = {
      script_id: script.id,
      title: script.title,
      description: `Generated from script: ${script.title}`,
      status: 'pending',
      heygen_avatar_id: options?.avatarId ?? this.config.heygenAvatarId,
      elevenlabs_voice_id: options?.voiceId ?? this.config.elevenlabsVoiceId,
      resolution: options?.resolution ?? this.config.defaultResolution,
    };

    const video = await db.videos.create(videoInsert);

    // Start processing (mock or real)
    if (this.config.useMockData) {
      this.startMockProcessing(video.id);
    } else {
      // Real API integration would go here
      this.startMockProcessing(video.id);
    }

    return video;
  }

  /**
   * Get video by ID
   */
  async getVideo(videoId: string): Promise<Video> {
    return db.videos.get(videoId);
  }

  /**
   * Get video job status
   */
  getJobStatus(videoId: string): VideoJob | undefined {
    return this.jobs.get(videoId);
  }

  /**
   * List all videos
   */
  async listVideos(options?: { status?: string; limit?: number }): Promise<Video[]> {
    return db.videos.list(options);
  }

  /**
   * Retry a failed video
   */
  async retryVideo(videoId: string): Promise<Video> {
    const video = await db.videos.get(videoId);

    if (video.status !== 'failed') {
      throw new Error('Can only retry failed videos');
    }

    const updated = await db.videos.update(videoId, {
      status: 'pending',
      error_message: null,
      retry_count: video.retry_count + 1,
    });

    this.startMockProcessing(videoId);

    return updated;
  }

  /**
   * Cancel a pending/processing video
   */
  async cancelVideo(videoId: string): Promise<Video> {
    const job = this.jobs.get(videoId);
    if (job) {
      job.status = 'failed';
      job.errorMessage = 'Cancelled by user';
    }

    return db.videos.update(videoId, {
      status: 'failed',
      error_message: 'Cancelled by user',
    });
  }

  /**
   * Start mock video processing
   */
  private async startMockProcessing(videoId: string): Promise<void> {
    const job: VideoJob = {
      id: generateId(),
      scriptId: videoId,
      status: 'queued',
      progress: 0,
      videoUrl: null,
      thumbnailUrl: null,
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.set(videoId, job);

    // Update to processing
    await db.videos.update(videoId, {
      status: 'processing',
      processing_started_at: new Date().toISOString(),
    });

    job.status = 'processing';
    job.updatedAt = new Date();

    // Simulate processing progress
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await sleep(500); // 500ms per step = 5 seconds total

      job.progress = (step / totalSteps) * 100;
      job.updatedAt = new Date();

      // Random failure chance (10% for testing)
      if (Math.random() < 0.1 && step > 5) {
        job.status = 'failed';
        job.errorMessage = 'Mock processing failed - random error for testing';

        await db.videos.update(videoId, {
          status: 'failed',
          error_message: job.errorMessage,
        });

        return;
      }
    }

    // Complete successfully
    const mockVideoUrl = `https://mock.heygen.com/videos/${videoId}.mp4`;
    const mockThumbnailUrl = `https://mock.heygen.com/thumbnails/${videoId}.jpg`;

    job.status = 'completed';
    job.progress = 100;
    job.videoUrl = mockVideoUrl;
    job.thumbnailUrl = mockThumbnailUrl;
    job.updatedAt = new Date();

    await db.videos.update(videoId, {
      status: 'completed',
      heygen_job_id: job.id,
      heygen_video_url: mockVideoUrl,
      thumbnail_url: mockThumbnailUrl,
      duration_seconds: 45 + Math.floor(Math.random() * 60), // 45-105 seconds
      file_size_bytes: 5000000 + Math.floor(Math.random() * 10000000), // 5-15 MB
      processing_completed_at: new Date().toISOString(),
    });
  }

  /**
   * Generate audio from script text (ElevenLabs stub)
   */
  async generateAudio(
    text: string,
    voiceId?: string
  ): Promise<{ audioUrl: string; durationSeconds: number }> {
    await sleep(1000); // Simulate API call

    // Mock response
    const audioId = generateId();
    return {
      audioUrl: `https://mock.elevenlabs.com/audio/${audioId}.mp3`,
      durationSeconds: Math.ceil(text.split(/\s+/).length / 2.5), // ~150 words per minute
    };
  }

  /**
   * Get available avatars (HeyGen stub)
   */
  async getAvailableAvatars(): Promise<
    Array<{ id: string; name: string; previewUrl: string }>
  > {
    await sleep(300);

    return [
      {
        id: 'avatar_professional_male',
        name: 'Professional Male',
        previewUrl: 'https://mock.heygen.com/avatars/professional_male.jpg',
      },
      {
        id: 'avatar_professional_female',
        name: 'Professional Female',
        previewUrl: 'https://mock.heygen.com/avatars/professional_female.jpg',
      },
      {
        id: 'avatar_casual_male',
        name: 'Casual Male',
        previewUrl: 'https://mock.heygen.com/avatars/casual_male.jpg',
      },
      {
        id: 'avatar_casual_female',
        name: 'Casual Female',
        previewUrl: 'https://mock.heygen.com/avatars/casual_female.jpg',
      },
    ];
  }

  /**
   * Get available voices (ElevenLabs stub)
   */
  async getAvailableVoices(): Promise<
    Array<{ id: string; name: string; previewUrl: string }>
  > {
    await sleep(300);

    return [
      {
        id: 'voice_adam',
        name: 'Adam - Deep & Professional',
        previewUrl: 'https://mock.elevenlabs.com/voices/adam_preview.mp3',
      },
      {
        id: 'voice_rachel',
        name: 'Rachel - Warm & Friendly',
        previewUrl: 'https://mock.elevenlabs.com/voices/rachel_preview.mp3',
      },
      {
        id: 'voice_josh',
        name: 'Josh - Energetic & Young',
        previewUrl: 'https://mock.elevenlabs.com/voices/josh_preview.mp3',
      },
      {
        id: 'voice_elli',
        name: 'Elli - Crisp & Clear',
        previewUrl: 'https://mock.elevenlabs.com/voices/elli_preview.mp3',
      },
    ];
  }
}

// ============================================
// Convenience Functions
// ============================================

let defaultInstance: VideoGenerator | null = null;

export function getVideoGenerator(config?: VideoGenConfig): VideoGenerator {
  if (!defaultInstance) {
    defaultInstance = new VideoGenerator(config);
  }
  return defaultInstance;
}

export async function createVideo(
  script: Script,
  options?: CreateVideoOptions
): Promise<Video> {
  const generator = getVideoGenerator();
  return generator.createVideo(script, options);
}
