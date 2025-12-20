# AUK (Agent UI Kit) Usage Guide

AUK is a generative UI protocol designed specifically for LangGraph agents. Its core concept is to encapsulate advanced frontend interactive components as "tools" that agents can call.

When an agent calls these tools, instead of executing immediately like regular functions and returning results, it **pauses** the current execution flow and sends a rendering instruction to the frontend. The frontend renders the corresponding UI (such as forms, option selectors, file uploaders, etc.) based on the instruction. After the user completes the interaction, the data is sent back to the agent, and the agent resumes execution.

This mechanism allows agents to "request" user input and "display" rich media information without pre-hardcoding all interaction logic.

---

## 1. Quick Start

Using AUK in your LangGraph or LangChain agent is very simple—just import them as standard tools and bind them to the LLM.

```typescript
import {
    ask_user_with_options,
    ask_user_with_options_config,
    ask_user_to_fill_form,
    ask_user_to_fill_form_config,
    wait_for_user_to_upload_file,
    wait_for_user_to_upload_file_config,
    display_information_card,
    visualize_data_with_chart,
    create_image_generation_tool, // Image generation tool builder function
    humanInTheLoopMiddleware, // Human-in-the-loop middleware
} from "@langgraph-js/auk";

const agent = createAgent({
    model: new ChatOpenAI({ model: "gpt-4" }),
    systemPrompt: "You are an intelligent assistant...",
    tools: [
        ask_user_with_options,
        ask_user_to_fill_form,
        wait_for_user_to_upload_file,
        display_information_card,
        visualize_data_with_chart,
        create_image_generation_tool(async () => [
            "https://example.com/img.png",
        ]),
    ],
    // Key: Configure Middleware to support Human-in-the-loop
    middleware: [
        humanInTheLoopMiddleware({
            interruptOn: {
                // Merge interrupt configurations from all tools
                ...ask_user_with_options_config.interruptOn,
                ...wait_for_user_to_upload_file_config.interruptOn,
                ...ask_user_to_fill_form_config.interruptOn,
            },
        }),
    ],
});
```

### Development Debugger

You can quickly test and debug your AUK-powered agent using the built-in development UI. The debugger comes with pre-configured AUK frontend components, so you only need to set up your backend service using `@langgraph-js/pure-graph`.

Run the following command to start the debugger:

```bash
npx @langgraph-js/ui
```

For detailed setup instructions, see the [LangGraph Server documentation](https://open-langgraph-server.agent-aura.top/docs/getting-started/overview).

---

## 2. Tool Details and Prompt Guidelines

The following are the currently available AUK tools and their use cases. When writing System Prompts for agents, you can refer to these descriptions to teach the agent when to use which tool.

### 2.1 Option Selection Tool (`ask_user_with_options`)

**Purpose**: The most commonly used decision-making tool. Used to let users make choices from predefined options or input short text.

-   **Use Cases**:

    -   When users need to make single or multiple selections (e.g., "Please select your preferred style").
    -   Simple next-step operation confirmation (e.g., "Would you like to continue generating or modify parameters?").
    -   When users need to input short custom requirements.

-   **Prompt Example**:

    > "When you need users to make decisions among several preset options, use `ask_user_with_options`. Don't ask users directly; instead, provide a specific list of options."

-   **Key Parameters**:
    -   `description`: Question description.
    -   `options`: List of options (containing `label` and `index`).
    -   `type`: `single_select` (single selection) or `multi_select` (multiple selection).
    -   `allow_custom_input`: Whether to allow users to input content outside the options.

---

### 2.2 Form Filling Tool (`ask_user_to_fill_form`)

**Purpose**: Used to collect structured complex data. Based on react-jsonschema-form standards.

-   **Use Cases**:

    -   Collecting user information (such as name, address, email).
    -   Complex parameter configuration (such as multiple detailed parameters for image generation).
    -   Data input that requires validation.

-   **Prompt Example**:

    > "If you need to collect detailed user information or multiple related parameters, don't ask multiple times. Use `ask_user_to_fill_form` to generate a form for users to fill out at once."

-   **Key Parameters**:
    -   `schema`: Object definition conforming to JSON Schema specifications.
    -   `ui_schema`: Defines UI presentation (optional).

---

### 2.3 File Upload Tool (`wait_for_user_to_upload_file`)

**Purpose**: Request users to upload files.

-   **Use Cases**:

    -   When users need to upload images for analysis.
    -   When users need to upload documents (PDF, Docx) for processing.

-   **Prompt Example**:

    > "When you need to analyze images or process documents, but there are no relevant files in the context, use `wait_for_user_to_upload_file` to request users to upload."

-   **Key Parameters**:
    -   `accept`: Accepted file types (e.g., `['image/*', '.pdf']`).
    -   `multiple`: Whether to allow multiple file uploads.

---

### 2.4 Information Card Display (`display_information_card`)

**Purpose**: Display rich text information, images, or simple confirmation messages to users. This is the most versatile display tool.

-   **Use Cases**:

    -   Display summaries of processing results.
    -   Display an image (optionally with title and description).
    -   Display notifications with action buttons (e.g., "Task completed, click to view details").
    -   **Don't overuse**: If user interaction is not needed and it's just a text reply, output text directly without using this tool.

-   **Prompt Example**:

    > "When you need to display formatted notifications, images, or result cards with clear action buttons, use `display_information_card`. If it's just a regular text reply, don't use this tool."

-   **Key Parameters**:
    -   `title`: Title.
    -   `content`: Main content.
    -   `image_url`: (Optional) Main image URL.
    -   `actions`: (Optional) List of action buttons, each containing `label` and `action_id` (or `link`).

---

### 2.5 Data Visualization Tool (`visualize_data_with_chart`)

**Purpose**: Generate dynamic charts to visually display data.

-   **Use Cases**:

    -   Display data analysis results (trend charts, distribution charts).
    -   Statistical data comparison.

-   **Prompt Example**:

    > "When you have structured data and need to visually display trends or distributions, use `visualize_data_with_chart` to generate charts."

-   **Key Parameters**:
    -   `chart_type`: Chart type (`bar`, `line`, `pie`, `scatter`, etc.).
    -   `data`: Array of data points.
    -   `x_axis` / `y_axis`: Axis configuration.

---

### 2.6 Image Generation Tool (`image_generation`)

**Purpose**: Generate or edit images.

-   **Note**: This tool usually requires you to inject an actual image generation function in your code (such as calling DALL-E, Midjourney, or Stable Diffusion API).

-   **Prompt Example**:
    > "When users explicitly request image generation, or you need visual content to assist in explanation, use `image_generation`. When generating new prompts, be as detailed as possible."

---

## 3. Agent Development Best Practices

### 3.1 Clarify Tool Call Timing

In System Prompts, clearly tell the agent that **AUK tools are its only rich media channel for interacting with users**.
For example:

> "You are an intelligent assistant capable of interacting with users using advanced UI components.
>
> -   Use `ask_user_with_options` for decisions.
> -   Use `ask_user_to_fill_form` to collect information.
> -   Use `display_information_card` or `visualize_data_with_chart` to display results."

### 3.2 Don't Overuse

-   If it's just a simple chat reply, return text directly. Don't use tools just for the sake of using them.
-   **Avoid consecutive calls**: Usually only call one interactive tool (such as a form or options) per reply. The agent will pause at the tool call to wait for the user. Consecutive calls may cause workflow confusion (depending on your Runtime implementation).

### 3.3 Handling Human-in-the-loop

The essence of AUK is Human-in-the-loop. When a tool is called, your backend Agent Runtime should:

1. Recognize the tool_call.
2. Pause execution.
3. Send the tool_call parameters to the frontend.
4. Frontend renders the UI.
5. After user interaction, the frontend sends the result back to the backend as tool_output.
6. Backend resumes agent execution, passes tool_output to the LLM, and generates subsequent replies.

### 3.4 Example Conversation Flow

**User**: Help me generate a weekly report.
**Agent (thinking)**: The user needs to generate a weekly report. I need to know this week's work content and next week's plan. This is an information collection scenario.
**Agent (calls tool)**: `ask_user_to_fill_form({ title: "Weekly Report Generator", schema: { ... } })`
**(System pauses, frontend displays form)**
**User**: (Fills out form and submits)
**(System resumes, passes form data)**
**Agent**: Received, generating your weekly report... (processing logic)
**Agent (calls tool)**: `display_information_card({ title: "Weekly Report Generated", content: "...", actions: [{ label: "Send Email", action_id: "send_email" }] })`
