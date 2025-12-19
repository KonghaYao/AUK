import { tool } from "langchain";
import z from "zod";
import { BaseAUK } from "./base";

export const visualize_data_with_chart_config = {
    name: "visualize_data_with_chart",
    description:
        "Generate a dynamic chart for data visualization and user review.",
    schema: z
        .object({
            title: z.string().describe("Chart title"),
            description: z
                .string()
                .optional()
                .describe("Optional chart description"),
            chart_type: z
                .enum([
                    "line",
                    "bar",
                    "pie",
                    "scatter",
                    "area",
                    "radar",
                    "heatmap",
                    "histogram",
                ])
                .describe("Type of chart to render"),
            data: z
                .array(z.record(z.string(), z.any()))
                .describe("Chart data points"),
            x_axis: z
                .object({
                    label: z.string().describe("X-axis label"),
                    field: z.string().describe("Data field for X-axis"),
                })
                .optional()
                .describe("X-axis configuration"),
            y_axis: z
                .object({
                    label: z.string().describe("Y-axis label"),
                    field: z.string().describe("Data field for Y-axis"),
                })
                .optional()
                .describe("Y-axis configuration"),
            options: z
                .record(z.string(), z.any())
                .optional()
                .describe("Additional chart configuration options"),
        })
        .describe("Chart visualization configuration"),
    output: z.string().optional().describe("用户对图表的反馈或确认"),
} satisfies BaseAUK;

export const visualize_data_with_chart = tool(async (args) => {
    return `chart visualized: answer will appear in human in the loop reject message`;
}, visualize_data_with_chart_config);
