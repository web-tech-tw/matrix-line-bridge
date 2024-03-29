import {
    Sender,
} from "../../../../sender";

import {
    MessageEvent,
    FileMessageEventContent,
} from "matrix-bot-sdk";

import {
    MatrixListenerClient,
} from "../client";

import {
    sendImageMessage,
    ImageMessageOptions,
} from "../../../line/sender";

const matrixChatRoomId = process.env.MATRIX_CHAT_ROOM_ID || "";
const lineChatRoomId = process.env.LINE_CHAT_ROOM_ID || "";

export default async (
    listenerClient: MatrixListenerClient,
    roomId: string,
    event: MessageEvent<any>,
): Promise<undefined> => {
    const messageEvent = new MessageEvent<FileMessageEventContent>(event.raw);

    if (roomId !== matrixChatRoomId) return;

    const senderProfile =
        await listenerClient.getUserProfile(messageEvent.sender);
    const senderIconHttp =
        listenerClient.mxcToHttp(senderProfile.avatar_url);
    const sender: Sender = new Sender({
        displayName: senderProfile.displayname,
        pictureUrl: senderIconHttp,
    });

    const mxcUrl = messageEvent.content.url;
    const thumbnailMxcUrl =
        messageEvent.content.info?.thumbnail_url || messageEvent.content.url;

    const httpUrl = listenerClient.mxcToHttp(mxcUrl);
    const thumbnailHttpUrl = listenerClient.mxcToHttp(thumbnailMxcUrl);

    const sendOptions: ImageMessageOptions = {
        thumbnailUrl: thumbnailHttpUrl,
    };

    sendImageMessage(sender, httpUrl, lineChatRoomId, sendOptions);
};
