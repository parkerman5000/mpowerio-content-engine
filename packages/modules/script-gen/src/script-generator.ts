// Script Generator Module

import {
  db,
  type Script,
  type ScriptInsert,
  type ContentFormat,
  type ResearchTopic,
  countWords,
  estimateDuration,
} from '@mpowerio/core';
import {
  SYSTEM_PROMPT,
  PROMPT_TEMPLATES,
  buildPrompt,
  TONE_PRESETS,
  type TonePreset,
  type PromptVariables,
} from './prompts';
import { getMockScript, simulateGenerationDelay } from './mock-scripts';

// ============================================
// Types
// ============================================

export interface GenerateOptions {
  format: ContentFormat;
  tone?: TonePreset | string;
  additionalContext?: string;
  useMockData?: boolean;
}

export interface GeneratedScript {
  hook: string;
  body: string;
  call_to_action: string;
  word_count: number;
  estimated_duration: number;
  ai_model: string;
  prompt_used: string;
}

export interface ScriptGenConfig {
  useMockData?: boolean;
  defaultTone?: TonePreset;
  anthropicApiKey?: string;
}

// ============================================
// Script Generator Class
// ============================================

export class ScriptGenerator {
  private config: Required<ScriptGenConfig>;

  constructor(config: ScriptGenConfig = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      defaultTone: config.defaultTone ?? 'professional',
      anthropicApiKey: config.anthropicApiKey ?? process.env.ANTHROPIC_API_KEY ?? '',
    };
  }

  /**
   * Generate a script from a research topic
   */
  async generateFromTopic(
    topic: ResearchTopic,
    options: GenerateOptions
  ): Promise<Script> {
    const variables: PromptVariables = {
      topic: topic.title,
      description: topic.description ?? undefined,
      keywords: topic.keywords,
      tone: this.resolveTone(options.tone),
      additionalContext: options.additionalContext,
    };

    const generated = await this.generate(options.format, variables, options.useMockData);

    const scriptInsert: ScriptInsert = {
      topic_id: topic.id,
      title: topic.title,
      hook: generated.hook,
      body: generated.body,
      call_to_action: generated.call_to_action,
      target_format: options.format,
      target_duration_seconds: generated.estimated_duration,
      word_count: generated.word_count,
      tone: this.resolveTone(options.tone),
      status: 'pending',
      ai_model: generated.ai_model,
      ai_prompt_template: generated.prompt_used,
      generation_metadata: {
        topic_id: topic.id,
        topic_keywords: topic.keywords,
        generated_at: new Date().toISOString(),
      },
      is_approved: false,
    };

    return db.scripts.create(scriptInsert);
  }

  /**
   * Generate a script from a custom topic (not from database)
   */
  async generateCustom(
    title: string,
    options: GenerateOptions & { description?: string; keywords?: string[] }
  ): Promise<Script> {
    const variables: PromptVariables = {
      topic: title,
      description: options.description,
      keywords: options.keywords,
      tone: this.resolveTone(options.tone),
      additionalContext: options.additionalContext,
    };

    const generated = await this.generate(options.format, variables, options.useMockData);

    const scriptInsert: ScriptInsert = {
      topic_id: null,
      title: title,
      hook: generated.hook,
      body: generated.body,
      call_to_action: generated.call_to_action,
      target_format: options.format,
      target_duration_seconds: generated.estimated_duration,
      word_count: generated.word_count,
      tone: this.resolveTone(options.tone),
      status: 'pending',
      ai_model: generated.ai_model,
      ai_prompt_template: generated.prompt_used,
      generation_metadata: {
        custom_topic: true,
        generated_at: new Date().toISOString(),
      },
      is_approved: false,
    };

    return db.scripts.create(scriptInsert);
  }

  /**
   * Core generation logic
   */
  private async generate(
    format: ContentFormat,
    variables: PromptVariables,
    useMock?: boolean
  ): Promise<GeneratedScript> {
    const shouldUseMock = useMock ?? this.config.useMockData;
    const prompt = buildPrompt(format, variables);

    if (shouldUseMock) {
      return this.generateMock(format, prompt);
    }

    // Real Claude API integration would go here
    // For now, always use mock
    return this.generateMock(format, prompt);
  }

  /**
   * Generate using mock data
   */
  private async generateMock(
    format: ContentFormat,
    prompt: string
  ): Promise<GeneratedScript> {
    await simulateGenerationDelay();

    const mockScript = getMockScript(format);
    const fullText = `${mockScript.hook} ${mockScript.body} ${mockScript.call_to_action}`;
    const wordCount = countWords(fullText);

    return {
      hook: mockScript.hook,
      body: mockScript.body,
      call_to_action: mockScript.call_to_action,
      word_count: wordCount,
      estimated_duration: estimateDuration(wordCount),
      ai_model: 'mock-generator',
      prompt_used: prompt,
    };
  }

  /**
   * Regenerate a script with modifications
   */
  async regenerate(
    scriptId: string,
    options?: {
      tone?: TonePreset | string;
      additionalContext?: string;
    }
  ): Promise<Script> {
    const original = await db.scripts.get(scriptId);

    const variables: PromptVariables = {
      topic: original.title,
      tone: options?.tone ? this.resolveTone(options.tone) : original.tone,
      additionalContext: options?.additionalContext,
    };

    const generated = await this.generate(
      original.target_format,
      variables,
      this.config.useMockData
    );

    const newVersion: ScriptInsert = {
      topic_id: original.topic_id,
      title: original.title,
      hook: generated.hook,
      body: generated.body,
      call_to_action: generated.call_to_action,
      target_format: original.target_format,
      target_duration_seconds: generated.estimated_duration,
      word_count: generated.word_count,
      tone: variables.tone ?? original.tone,
      status: 'pending',
      version: original.version + 1,
      parent_script_id: original.id,
      ai_model: generated.ai_model,
      ai_prompt_template: generated.prompt_used,
      generation_metadata: {
        regenerated_from: original.id,
        regenerated_at: new Date().toISOString(),
      },
      is_approved: false,
    };

    return db.scripts.create(newVersion);
  }

  /**
   * Approve a script for video production
   */
  async approveScript(scriptId: string): Promise<Script> {
    return db.scripts.update(scriptId, {
      is_approved: true,
      approved_at: new Date().toISOString(),
      status: 'completed',
    });
  }

  /**
   * Get scripts ready for video production
   */
  async getApprovedScripts(limit?: number): Promise<Script[]> {
    return db.scripts.list({ approved: true, limit });
  }

  /**
   * Get pending scripts for review
   */
  async getPendingScripts(limit?: number): Promise<Script[]> {
    return db.scripts.list({ status: 'pending', limit });
  }

  /**
   * Resolve tone string or preset
   */
  private resolveTone(tone?: TonePreset | string): string {
    if (!tone) {
      return TONE_PRESETS[this.config.defaultTone];
    }
    if (tone in TONE_PRESETS) {
      return TONE_PRESETS[tone as TonePreset];
    }
    return tone;
  }
}

// ============================================
// Convenience Functions
// ============================================

let defaultInstance: ScriptGenerator | null = null;

export function getScriptGenerator(config?: ScriptGenConfig): ScriptGenerator {
  if (!defaultInstance) {
    defaultInstance = new ScriptGenerator(config);
  }
  return defaultInstance;
}

export async function generateScript(
  topic: ResearchTopic,
  format: ContentFormat,
  options?: Omit<GenerateOptions, 'format'>
): Promise<Script> {
  const generator = getScriptGenerator();
  return generator.generateFromTopic(topic, { ...options, format });
}
