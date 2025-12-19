import { tool } from "langchain";
import z from "zod";
import { BaseAUK } from "./base";

export const ask_user_with_options_config = {
    name: "ask_user_with_options",
    description: `Ask the user one question with options and optional custom input.

When to use:
- Need to ask a single question with predefined options
- User needs to make a choice from a limited set of options
- Want to allow users to provide custom input in addition to selecting options
- Simple decision-making scenarios (e.g., "Which option do you prefer?", "Select a category")
- Gather user feedback for what you have done

Not to use:
- Complex multi-field forms
- Multiple independent questions
- File uploads
- Displaying information without user input
- Collecting detailed feedback with multiple question types`,
    schema: z
        .object({
            description: z.string().describe("Question text to display"),
            type: z
                .enum(["single_select", "multi_select"])
                .optional()
                .default("single_select")
                .describe("Selection mode for this question"),
            options: z
                .array(
                    z.object({
                        index: z.number().describe("Index of the option"),
                        label: z.string().describe("Optional display label"),
                    })
                )
                .describe("Selectable options for the question"),
            allow_custom_input: z
                .boolean()
                .default(true)
                .describe("Allow user to input custom text"),
        })
        .describe("The single question to ask the user"),
    output: z.string().describe("user selected option"),
    interruptOn: {
        ask_user_with_options: {
            allowedDecisions: ["respond"],
        },
    },
} satisfies BaseAUK;

export const ask_user_with_options = tool(async (args) => {
    return `user selected: answer will appear in human in the loop reject message`;
}, ask_user_with_options_config);
