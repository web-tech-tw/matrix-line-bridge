import {
    Sender,
} from "../../../../sender";

import {
    MessageEvent,
    TextEventMessage,
    TextMessage,
    MessageAPIResponseBase,
} from "@line/bot-sdk";

import {
    getSourceIdFromEvent,
} from "../../utils";

import {
    sendTextMessage,
} from "../../../matrix/sender";

import {
    client as lineClient,
} from "../../index";

const matrixChatRoomId = process.env.MATRIX_CHAT_ROOM_ID || "";
const lineChatRoomId = process.env.LINE_CHAT_ROOM_ID || "";

type CommandMethod = (event: MessageEvent) =>
    Promise<MessageAPIResponseBase | undefined>;

type CommandMethodList = {
    [key: string]: CommandMethod
};

const commands: CommandMethodList = {
    "getChatRoomId": (event: MessageEvent) => {
        const sourceId = getSourceIdFromEvent(event, false) as string;
        console.info(sourceId);
        const replyMessage: TextMessage = {
            type: "text",
            text: sourceId,
        };
        return lineClient.replyMessage(event.replyToken, replyMessage);
    },
};

// Function handler to receive the text.
export default async (
    event: MessageEvent,
): Promise<MessageAPIResponseBase | undefined> => {
    const message: TextEventMessage = event.message as TextEventMessage;
    const {text} = message;

    if (text.startsWith("#") && text.substring(1).length > 0) {
        const command = text.substring(1);
        if (command in commands) {
            return await commands[command](event);
        }
    }

    const [sourceId, senderId] =
        getSourceIdFromEvent(event, true) as Array<string>;
    if (sourceId !== lineChatRoomId) return;

    const senderProfile =
        await lineClient.getGroupMemberProfile(sourceId, senderId);
    const sender: Sender = new Sender(senderProfile);

    sendTextMessage(sender, text, matrixChatRoomId);
};
