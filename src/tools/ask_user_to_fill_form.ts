import { tool } from "langchain";
import z from "zod";
import { BaseAUK } from "./base";

export const ask_user_to_fill_form_config = {
    name: "ask_user_to_fill_form",
    description:
        "Present a form to the user for filling out. Schema follows react-jsonschema-form format.",
    schema: z
        .object({
            title: z.string().describe("Form title"),
            description: z
                .string()
                .optional()
                .describe("Optional form description"),
            schema: z
                .record(z.string(), z.any())
                .describe(
                    "JSON Schema for the form (react-jsonschema-form compatible)"
                ),
        })
        .describe("Form configuration following react-jsonschema-form"),
    output: z.record(z.string(), z.any()).describe("用户填写的表单数据"),
    interruptOn: {
        ask_user_to_fill_form: {
            allowedDecisions: ["respond"],
        },
    },
} satisfies BaseAUK;

export const ask_user_to_fill_form = tool(async (args) => {
    return `user filled form: answer will appear in human in the loop reject message`;
}, ask_user_to_fill_form_config);
