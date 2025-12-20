// 基础工具类型定义
import { z } from "zod";
import { InterruptOnConfig } from "../middlewares/hitl";

export interface BaseAUK {
    name: string;
    description: string;
    schema: z.ZodObject<any>;
    output: any;
    interruptOn?: Record<string, InterruptOnConfig>;
}
export type { InterruptOnConfig };
