# AI Comic Factory - Project Documentation

## Project Overview

**AI Comic Factory** is a Next.js application that generates AI-powered comic strips using Large Language Models (LLMs) and image generation APIs. Users input a prompt, select a comic style, and the system generates a complete comic with panels, dialog, and artwork.

**Key Features:**
- Generate complete comics from a single text prompt
- Multiple comic art styles and fonts
- Support for multiple LLM providers (OpenAI, Anthropic, Groq, Hugging Face)
- Multiple image generation engines (SDXL, OpenAI DALL-E, Replicate)
- Interactive comic editor with speech bubbles and captions
- Export to CLAP format (Cinematic Language and Audio Protocol)
- Community sharing features (optional)
- OAuth integration with Hugging Face

## Technology Stack

**Frontend:**
- Next.js 14.2.7 with App Router
- React 18.3.1 with TypeScript 5.4.5
- Tailwind CSS 3.4.1 with custom comic fonts
- shadcn/ui component library (Radix UI primitives)
- Zustand for state management
- React Konva for canvas-based comic editing
- Framer Motion alternatives via Tailwind animations

**Backend/API:**
- Next.js Server Actions (9 server functions identified)
- Multiple LLM integrations: OpenAI, Anthropic Claude, Groq, Hugging Face
- Multiple rendering engines: SDXL, Replicate, VideoChain API, OpenAI DALL-E
- Image processing with Sharp, HTML2Canvas
- Docker containerization

**Key Dependencies:**
- `@aitube/clap` - CLAP format support for multimedia projects
- `@anthropic-ai/sdk` - Claude AI integration
- `@huggingface/inference` - Hugging Face model access
- `groq-sdk` - Groq API integration
- `openai` - OpenAI API integration
- `replicate` - Replicate.com API integration
- Custom font handling with 13 different comic fonts

## Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── engine/              # Core business logic
│   │   ├── presets.ts       # Comic style presets (678 lines, 4 main presets)
│   │   ├── render.ts        # Image generation engine
│   │   ├── caption.ts       # Caption generation
│   │   └── censorship.ts    # Content filtering
│   ├── interface/           # UI components (22 directories)
│   │   ├── page/           # Comic page layout
│   │   ├── panel/          # Individual comic panels
│   │   ├── bottom-bar/     # Controls and actions
│   │   ├── settings-dialog/ # Configuration UI
│   │   └── ...
│   ├── queries/            # Server-side data fetching (13 files)
│   │   ├── predict.ts      # LLM prediction orchestration
│   │   ├── predictNextPanels.ts # Panel generation logic
│   │   ├── predictWith*.ts # Provider-specific implementations
│   │   └── ...
│   ├── store/              # Zustand state management
│   │   └── index.ts        # Main app state (21KB)
│   ├── layouts/            # Comic layout definitions
│   └── main.tsx           # Main application component
├── components/
│   ├── ui/                 # shadcn/ui components (27 components)
│   └── icons/             # Custom icons
├── lib/                    # Utility functions (49 files)
│   ├── fonts.ts           # Comic font definitions
│   ├── bubble/            # Speech bubble utilities
│   └── [various utilities for image processing, parsing, etc.]
├── fonts/                  # 13 custom comic fonts
└── types.ts               # TypeScript type definitions (217 lines)
```

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking

# Node version
nvm use             # Uses Node v20.17.0 (specified in .nvmrc)
```

## Environment Configuration

The application requires extensive environment configuration in `.env.local`:

**Core Engines:**
- `LLM_ENGINE`: "INFERENCE_API" | "INFERENCE_ENDPOINT" | "OPENAI" | "GROQ" | "ANTHROPIC"
- `RENDERING_ENGINE`: "INFERENCE_API" | "INFERENCE_ENDPOINT" | "REPLICATE" | "VIDEOCHAIN" | "OPENAI"

**Authentication (configure only what you use):**
- `AUTH_HF_API_TOKEN` - Hugging Face API token
- `AUTH_OPENAI_API_KEY` - OpenAI API key
- `AUTH_GROQ_API_KEY` - Groq API key
- `AUTH_ANTHROPIC_API_KEY` - Anthropic/Claude API key
- `AUTH_REPLICATE_API_TOKEN` - Replicate.com token
- `AUTH_VIDEOCHAIN_API_TOKEN` - VideoChain API token

**LLM Configuration:**
- `LLM_HF_INFERENCE_API_MODEL` - Default: "HuggingFaceH4/zephyr-7b-beta"
- `LLM_OPENAI_API_MODEL` - Default: "gpt-4-turbo"
- `LLM_GROQ_API_MODEL` - Default: "mixtral-8x7b-32768"
- `LLM_ANTHROPIC_API_MODEL` - Default: "claude-3-opus-20240229"

**Rendering Configuration:**
- `RENDERING_HF_INFERENCE_API_BASE_MODEL` - Default: "stabilityai/stable-diffusion-xl-base-1.0"
- `RENDERING_REPLICATE_API_MODEL` - Default: "stabilityai/sdxl"
- `MAX_NB_PAGES` - Default: 6

## Architecture Patterns

**State Management:**
- Zustand store with typed selectors and actions
- Complex state includes: panels, speeches, captions, renderedScenes, layouts
- Real-time panel generation status tracking

**LLM Integration Pattern:**
- Abstracted provider interface through `predict()` function
- Provider-specific implementations in separate files
- Standardized prompt templates and response parsing
- Support for multiple prompt formats (Zephyr, Llama, etc.)

**Image Generation Flow:**
1. User provides prompt + selects preset
2. LLM generates panel descriptions, speech, and captions
3. Each panel description is sent to rendering engine
4. Images are generated and cached
5. User can edit speech bubbles and captions
6. Final comic can be exported as image or CLAP file

**Server Actions Architecture:**
- 9 server actions for LLM predictions and rendering
- Clean separation between UI and server logic
- Error handling and fallbacks for API failures

**Comic Preset System:**
- 4 main preset categories with 678 lines of configuration
- Each preset defines: art style, color scheme, font, LLM prompts, image prompts
- Extensible system for adding new comic styles

**Font System:**
- 13 custom comic fonts loaded as local fonts
- Includes both Google Fonts (Indie Flower, The Girl Next Door) and custom fonts
- Proper CSS variable integration for consistent typography

## Key Business Logic

**Panel Generation (`predictNextPanels`):**
- Generates multiple comic panels from a single prompt
- Handles continuation of existing stories
- Parses LLM responses into structured panel data (instructions, speech, captions)
- Error recovery and retry logic

**Rendering Pipeline (`render.ts`):**
- Multi-provider image generation (Replicate, HF, OpenAI, VideoChain)
- Automatic fallbacks between providers
- Image caching and optimization
- Support for different aspect ratios and resolutions

**State Persistence:**
- LocalStorage integration for user settings
- CLAP file format support for project serialization
- OAuth state management with Hugging Face

## Development Patterns

**Component Organization:**
- Feature-based component structure in `app/interface/`
- Reusable UI components in `components/ui/`
- Custom hooks in `lib/` for complex logic

**Type Safety:**
- Comprehensive TypeScript definitions in `types.ts`
- Strict typing for LLM engines, rendering engines, and data flows
- Generic interfaces for extensible provider support

**Error Handling:**
- Graceful degradation for API failures
- User feedback through toast notifications
- Fallback content for missing images/data

**Performance Considerations:**
- Image optimization with Sharp
- Lazy loading of comic panels
- Efficient state updates with Zustand
- Canvas-based rendering for complex layouts

## Testing & Quality

- **Linting**: ESLint with Next.js configuration
- **No test files found** - this is an area for improvement
- **Type checking**: Strict TypeScript configuration
- **Docker**: Production containerization available

## Deployment

- Designed for Hugging Face Spaces deployment
- Docker containerization with Node.js Alpine
- Standalone Next.js output for containerized deployment
- Environment-based configuration for different deployment targets

## Community & Contributions

- Open source project on Hugging Face
- Community contributions documented in `CONTRIBUTORS.md`
- Optional community sharing features
- OAuth integration for user management

## Development Notes

- **No API routes found** - uses Server Actions exclusively
- **Canvas-based editing** with React Konva for interactive panels
- **Multi-provider architecture** allows switching between AI services
- **Extensive font library** for authentic comic typography
- **CLAP format integration** for multimedia project export
- **Rate limiting** configurable for production usage

## Quick Start for Developers

1. Copy `.env` to `.env.local` and configure your API keys
2. Choose your LLM_ENGINE and RENDERING_ENGINE
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. The app will guide you through first-time setup

Most common development setup:
- LLM_ENGINE: "OPENAI" with OpenAI API key
- RENDERING_ENGINE: "REPLICATE" with Replicate token
- This provides reliable, high-quality results for testing