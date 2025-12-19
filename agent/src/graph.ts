import { z } from "zod";
import { createStateEntrypoint } from "@langgraph-js/pure-graph";
import { AgentState, ChatOpenAI } from "@langgraph-js/pro";
import { BaseMessage, createAgent } from "langchain";
import { humanInTheLoopMiddleware } from "./hitl";
import {
    ask_user_with_options,
    ask_user_with_options_config,
} from "../../src/tools/ask_user_with_options";
import { display_information_card } from "../../src/tools/display_information_card";
import { create_image_generation_tool } from "../../src/tools/image_generation";
import {
    wait_for_user_to_upload_file,
    wait_for_user_to_upload_file_config,
} from "../../src/tools/wait_for_user_to_upload_file";
import { visualize_data_with_chart } from "../../src/tools/visualize_data_with_chart";
import { StateGraph, START } from "@langchain/langgraph";
const State = AgentState.extend({});

export const graph = new StateGraph(State)
    .addNode("a", async (state) => {
        const agent = createAgent({
            model: new ChatOpenAI({
                model: "mimo-v2-flash",
            }),
            systemPrompt: "你是一个智能助手",
            tools: [
                ask_user_with_options,
                display_information_card,
                create_image_generation_tool(async () => {
                    return [
                        "https://ik.imagekit.io/siteli6503/generated-images/gemini-1765890124897-0_ly5MpqXId.png",
                    ];
                }),
                wait_for_user_to_upload_file,
                visualize_data_with_chart,
            ],
            middleware: [
                humanInTheLoopMiddleware({
                    interruptOn: {
                        ...ask_user_with_options_config.interruptOn,
                        ...wait_for_user_to_upload_file_config.interruptOn,
                    },
                }),
            ],
            stateSchema: State,
        });
        return agent.invoke(state);
    })
    .addEdge(START, "a")
    .compile();
