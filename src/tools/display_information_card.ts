import { tool } from "langchain";
import z from "zod";
import { BaseAUK } from "./base";

export const display_information_card_config = {
    name: "display_information_card",
    description: "Display an information card to the user.",
    schema: z
        .object({
            image_url: z
                .url()
                .optional()
                .describe("Optional image URL (for info card type)"),
            title: z.string().describe("Card title"),
            content: z.string().describe("Main content text"),
            type: z
                .enum(["info", "success", "warning", "error"])
                .optional()
                .default("info")
                .describe("Card style (for info card type)"),
            actions: z
                .array(
                    z.object({
                        label: z.string().describe("Button label"),
                        action_id: z.string().describe("Action identifier"),
                        link: z.url().optional(),
                    })
                )
                .optional()
                .describe("Action buttons"),
        })
        .describe("Information card configuration"),
    output: z
        .union([
            z.string().describe("用户点击的操作 ID（如果有操作按钮）"),
            z
                .array(z.string())
                .describe(
                    "用户选择的图片 URL 列表（image_gallery 类型且允许选择时）"
                ),
        ])
        .optional()
        .describe("用户交互结果"),
} satisfies BaseAUK;

export const display_information_card = tool(async (args) => {
    return `information card displayed: answer will appear in human in the loop reject message`;
}, display_information_card_config);
