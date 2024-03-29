import * as push from "./push";
import * as notify from "./notify";

import {
    Sender,
} from "../../../sender";

import {
    MessageAPIResponseBase,
} from "@line/bot-sdk";

import {
    AxiosResponse,
} from "axios";

const client = process.env.LINE_SEND_MESSAGE_MODE === "push" ? push : notify;

export type ImageMessageOptions = {
    thumbnailUrl?: string;
};

/**
 * Send a text message to the chat room.
 * @param {Sender} sender The sender of the message.
 * @param {string} text The text to send.
 * @param {string} roomId ID of the chat room.
 * @return {Promise<MessageAPIResponseBase | AxiosResponse>}
 */
export function sendTextMessage(
    sender: Sender,
    text: string,
    roomId: string,
): Promise<MessageAPIResponseBase | AxiosResponse> {
    return client.sendTextMessage(sender, text, roomId);
}

/**
 * Send an image message to the chat room.
 * @param {Sender} sender The sender of the message.
 * @param {string} imageUrl URL of the image.
 * @param {string} roomId ID of the chat room.
 * @param {ImageMessageOptions} options The options to send image message.
 * @return {Promise<MessageAPIResponseBase | AxiosResponse>}
 */
export function sendImageMessage(
    sender: Sender,
    imageUrl: string,
    roomId: string,
    options: ImageMessageOptions = {},
): Promise<MessageAPIResponseBase | AxiosResponse> {
    return client.sendImageMessage(sender, imageUrl, roomId, options);
}
