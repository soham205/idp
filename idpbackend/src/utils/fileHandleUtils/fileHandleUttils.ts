import { IBase64Data } from '../../fileHandleUtils/fileHandleUttils';
import { FileSystem } from './index'

/*Get base64 Image*/
function base64TrimString(base64String: string) {
    const base64TrimString = base64String.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64TrimString, 'base64');
    return imageBuffer
}

/*Trim Email After "@"*/
function trimEmail(email: string) {
    return email.split('@')[0];
}

/*Write Image To Specific Directory*/
async function writeImage(email: string, name: string, imageBuffer: Buffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const imagePath = `${FileSystem.getCwd()}/uploads/vcards/${trimEmail(email)}/${name}.png`
        const fileUri = `/uploads/vcards/${trimEmail(email)}/${name}.png`
        FileSystem.writeFile(`${imagePath}`, imageBuffer as unknown as string)
            .then(() => {
                resolve(fileUri);
            }).catch((writeImageerror) => {
                reject(writeImageerror)
            })
    })
}

/*Main function which Returns the image Url*/
export const base64ToImage = (base64Data: IBase64Data): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const getBase64TrimString: Buffer = base64TrimString(base64Data.profilePhoto)
        resolve(writeImage(base64Data.email, base64Data.name, getBase64TrimString));
    })
}
