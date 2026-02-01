// Script Generator Module - Entry Point

export {
  ScriptGenerator,
  getScriptGenerator,
  generateScript,
  type GenerateOptions,
  type GeneratedScript,
  type ScriptGenConfig,
} from './script-generator';

export {
  SYSTEM_PROMPT,
  PROMPT_TEMPLATES,
  buildPrompt,
  TONE_PRESETS,
  type TonePreset,
  type PromptTemplate,
  type PromptVariables,
} from './prompts';
