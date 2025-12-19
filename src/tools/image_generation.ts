import { tool } from "langchain";
import { BaseAUK } from "./base";
import z from "zod";

export const image_generation_config = {
    name: "image_generation",
    description: `Generate or edit an image. To generate, provide a 'prompt'. To edit, provide a 'prompt' and some 'inputImageUrls'. The image will be shown to the user by this tool. You don't need to show the image url to the user in your response.

inputImageUrls are reference images, which can be user-uploaded images or previously generated images.

Prompt Usage Guidelines:
- Prompt length guideline: Keep prompts concise and to the point. Avoid overly long or complex descriptions.
- When generating new images: Use detailed and accurate descriptions, ensuring the description is as specific and complete as possible
- When editing existing images: Use relatively brief descriptions, only describing the changes to be made
- When text or symbols need to appear in the image: Use the original text and symbols exactly as specified, rather than synonyms or approximations

Example 1: Generate Image (Detailed Description)
"Create a realistic photo of a golden retriever puppy sitting in a sunny meadow with wildflowers, detailed fur texture, natural lighting, 8k resolution"

Example 2: Edit Image (Brief Description)
Based on Image 1, change the dog's color to black

Example 3: Merge Multiple Images
Merge Image 1 and Image 2 together, create a double portrait scene, add a warm sunset background`,
    schema: z.object({
        prompt: z.string().describe("prompt description"),
        input_image_urls: z
            .array(z.string())
            .optional()
            .describe("input image urls"),
        resolution: z
            .enum(["1K", "2K", "4K"])
            .optional()
            .default("1K")
            .describe("image resolution"),
        aspectRatio: z
            .enum([
                "21:9",
                "16:9",
                "4:3",
                "3:2",
                "1:1",
                "9:16",
                "3:4",
                "2:3",
                "5:4",
                "4:5",
            ])
            .optional()
            .default("16:9")
            .describe("image aspect ratio"),
        model: z
            .string()
            .optional()
            .default("gemini-3-pro-image-preview")
            .describe("model name"),
    }),
    output: z.string().describe("image url"),
} satisfies BaseAUK;

export const create_image_generation_tool = (
    gen_image: (
        config: z.infer<typeof image_generation_config.schema>
    ) => Promise<string[]>
) =>
    tool(
        async (args) => {
            const images = await gen_image(args);
            return {
                image_url: images,
                hint: "The images are generated and shown to the user. You don't need to show the image url to the user in your response.",
            };
        },
        { ...image_generation_config }
    );
