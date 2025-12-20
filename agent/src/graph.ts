import { AgentState, ChatOpenAI } from "@langgraph-js/pro";
import { createAgent } from "langchain";
import {
    humanInTheLoopMiddleware,
    ask_user_to_fill_form,
    ask_user_to_fill_form_config,
    wait_for_user_to_upload_file,
    wait_for_user_to_upload_file_config,
    visualize_data_with_chart,
    ask_user_with_options,
    ask_user_with_options_config,
    display_information_card,
    create_image_generation_tool,
} from "../../src/";

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
                ask_user_to_fill_form,
            ],
            middleware: [
                humanInTheLoopMiddleware({
                    interruptOn: {
                        ...ask_user_with_options_config.interruptOn,
                        ...wait_for_user_to_upload_file_config.interruptOn,
                        ...ask_user_to_fill_form_config.interruptOn,
                    },
                }),
            ],
            stateSchema: State,
        });
        return agent.invoke(state);
    })
    .addEdge(START, "a")
    .compile();
