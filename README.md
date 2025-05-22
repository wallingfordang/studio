
# Agent-Computer

## Overview
Agent-Computer is a revolutionary, full-screen online operating environment designed to enhance productivity and creativity through AI-powered tools and agents. It provides a unified workspace where users can seamlessly switch between specialized applications, each augmented by its own contextual AI assistant. The core philosophy is to have AI as an intelligent partner, deeply integrated into the user's workflow.

## Features
*   **Tool-Based Architecture**: A suite of tools including Document Processor, Web Navigator, Comms Hub, Creative Suite, Task Manager, Spreadsheet Tool, Presentation Builder, Code Editor, Game Center, and Settings.
*   **Integrated Agent Stream**: Each tool features its own dedicated AI agent accessible via an embedded "Agent Stream." This stream provides:
    *   A chat interface for natural language interaction.
    *   Real-time logs of agent actions.
    *   Contextual action buttons (Approve, Undo, Modify).
    *   Smart suggestions relevant to the active tool and task.
*   **Orchestration Command Center**: The main page when no tool is active, allowing users to define and initiate complex, multi-tool tasks with a central Orchestration Agent.
*   **Quick Access**: Easily launch specific tools or connect to new services directly from the Orchestration Center.
*   **Responsive Design**: Adapts to various screen sizes with a collapsible sidebar.
*   **Themeable UI**: Light and dark mode support, switchable via the sidebar.
*   **Tutorial Modal**: An in-app guide to help users get started.
*   **AI-Powered Capabilities**:
    *   Document drafting assistance.
    *   Webpage summarization.
    *   Smart suggestions for tool usage.
    *   (Placeholders for future AI integrations within each tool)

## Tech Stack
*   **Frontend**:
    *   Next.js (App Router)
    *   React
    *   TypeScript
*   **UI**:
    *   ShadCN UI Components
    *   Tailwind CSS
    *   Lucide React (Icons)
*   **AI Integration**:
    *   Google Genkit (leveraging Gemini models)
*   **Deployment**:
    *   Firebase Hosting (as indicated by `firebase.json`)

## Getting Started

### Prerequisites
*   Node.js (version recommended by Next.js, typically LTS)
*   npm, yarn, or pnpm

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd agent-computer
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Running the Development Server
To start the Next.js development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
The application will typically be available at `http://localhost:9002`.

### Running Genkit Flows (for AI features)
Genkit flows are part of the Next.js server environment. To run them locally for development and testing separate from the main Next.js dev server (e.g., using the Genkit Developer UI):

1.  Ensure you have Google Cloud CLI configured with Application Default Credentials if using Google AI models locally. You might need to set up a `.env` file with your `GOOGLE_API_KEY`.
2.  Start the Genkit development server:
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```
    This will typically start the Genkit Developer UI on `http://localhost:4000`.

## Key Components & Architecture

*   **`src/app/agent-computer-layout.tsx`**: The main layout component that sets up the sidebar and the central "Space".
*   **`src/components/cognicanvas/`**: Contains the core UI elements (note: "cognicanvas" is likely a legacy name in the codebase, the service is "Agent-Computer").
    *   **`dock.tsx`**: The sidebar tool launcher.
    *   **`space.tsx`**: The main content area that hosts either the `OrchestrationCenter` or the active tool.
    *   **`orchestration-center.tsx`**: The main dashboard for high-level task management with the primary AI agent.
    *   **`agent-stream.tsx`**: The UI component for interacting with individual tool agents (chat, logs, actions).
    *   **`smart-suggestions.tsx`**: Displays AI-generated suggestions relevant to the active tool.
    *   **`tools/`**: Directory containing individual tool components (e.g., `document-processor.tsx`, `web-navigator.tsx`, etc.). Each tool integrates its own `AgentStream` and `SmartSuggestions`.
*   **`src/components/ui/`**: ShadCN UI components used throughout the application.
*   **`src/ai/`**: Contains Genkit AI flows.
    *   **`genkit.ts`**: Initializes and configures Genkit.
    *   **`flows/`**: Individual Genkit flows like `ai-assisted-drafting.ts`, `web-navigator-summarization.ts`, etc.

## AI Integration with Genkit
The application leverages Genkit for its AI capabilities:
*   **Flows**: AI logic is encapsulated in Genkit flows, typically found in `src/ai/flows/`. These flows define how the application interacts with AI models (like Gemini) for tasks such as document drafting and webpage summarization.
*   **Models**: The primary model used is Gemini 2.0 Flash, configured in `src/ai/genkit.ts`.
*   **Schema**: Zod schemas are used to define the input and output types for AI flows, ensuring type safety and clear contracts.
*   **Server Actions**: Genkit flows are exposed as server actions, allowing client components to securely call them.

## How to Use Agent-Computer
1.  **Orchestration Center**: Upon loading, you'll see the Orchestration Center. Use the chat interface to describe complex tasks to the main AI agent.
2.  **Launching Tools**:
    *   Use the "Quick Access" section in the Orchestration Center to directly launch tools.
    *   Or, select tools from the sidebar Dock.
3.  **Interacting with Tool Agents**: Once a tool is open, its dedicated Agent Stream panel will be visible. Use this to:
    *   Give instructions to the tool's AI assistant.
    *   Monitor the agent's actions through real-time logs.
    *   Utilize contextual action buttons (e.g., "Approve", "Undo").
    *   Benefit from smart suggestions.
4.  **Navigation**:
    *   Click the "Agent-Computer" logo in the sidebar header to return to the Orchestration Center.
    *   Use the sidebar Dock to switch between different tools.
5.  **Customization**:
    *   Toggle between light and dark themes using the palette icon in the sidebar footer.
    *   Access the tutorial via the help icon in the sidebar footer.

## Firebase Integration
This project is set up for deployment with Firebase Hosting. The `firebase.json` file configures how the Next.js application is served.

## Future Development Ideas
*   Implement full functionality for all placeholder tools.
*   Develop sophisticated Genkit flows for the Orchestration Agent to manage multi-tool tasks.
*   Introduce persistent learning for agents based on user feedback.
*   Add more advanced window management features within the "Space".
*   Expand AI capabilities within each tool (e.g., image editing in Creative Suite, code generation in Code Editor).
*   Implement user accounts and data persistence.

---

*This README provides an overview of the Agent-Computer application as of the current development stage.*
