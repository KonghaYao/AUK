// 基础工具类型定义
import { z } from "zod";

export interface BaseAUK {
    name: string;
    description: string;
    schema: z.ZodObject<any>;
    output: any;
    interruptOn?: Record<string, InterruptOnConfig>;
}
export type InterruptOnConfig = {
    allowedDecisions: ("respond" | "approve" | "edit" | "reject")[];
    description?: string;
    argsSchema?: z.ZodObject<any>;
};
