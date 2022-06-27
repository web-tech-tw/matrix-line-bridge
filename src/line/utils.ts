import fs from 'fs';
import axios, { AxiosRequestConfig } from "axios";

const scdnClient = (() => {
    const config: AxiosRequestConfig = {
        baseURL: "https://stickershop.line-scdn.net",
    };
    return axios.create(config);
})();

export async function downloadStickerImage(stickerId: number): Promise<void> {
    const remoteFilename: string =
        `stickershop/v1/sticker/${stickerId}/android/sticker.png`
    const localFilename: string = `stickers/${stickerId}.png`;
    const response = await scdnClient.get(remoteFilename);
    response.data.pipe(fs.createWriteStream(localFilename));
}
