import { tool } from "langchain";
import z from "zod";
import { BaseAUK } from "./base";

export const wait_for_user_to_upload_file_config = {
    name: "wait_for_user_to_upload_file",
    description: "Wait for the user to upload one or more files.",
    schema: z
        .object({
            title: z.string().describe("Title for the upload section"),
            description: z
                .string()
                .optional()
                .describe("Optional description text"),
            accept: z
                .array(z.string())
                .optional()
                .describe(
                    "Accepted file types (e.g., ['image/*', '.pdf', '.docx'])"
                ),
            multiple: z
                .boolean()
                .default(false)
                .describe("Allow multiple file uploads"),
            max_size_mb: z
                .number()
                .positive()
                .optional()
                .describe("Maximum file size in MB"),
            required: z
                .boolean()
                .default(true)
                .describe("Whether file upload is required"),
        })
        .describe("File upload configuration"),
    output: z
        .array(
            z.object({
                file_name: z.string().describe("Uploaded file name"),
                file_size: z.number().describe("File size in bytes"),
                file_type: z.string().describe("MIME type of the file"),
                file_url: z.url().describe("URL to access the uploaded file"),
            })
        )
        .describe("用户上传的文件信息列表"),
    interruptOn: {
        wait_for_user_to_upload_file: {
            allowedDecisions: ["respond"],
        },
    },
} satisfies BaseAUK;

export const wait_for_user_to_upload_file = tool(async (args) => {
    // frontend will handle the file upload and return the file url
    return `user uploaded files: answer will appear in human in the loop reject message`;
}, wait_for_user_to_upload_file_config);
