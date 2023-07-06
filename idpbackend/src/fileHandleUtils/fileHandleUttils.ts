import fs from 'fs-extra'

export interface IBase64Data {
	profilePhoto: string;
	email: string;
	name: string;
}

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

/*Check If Directory exists or Not Else Create Directory*/
async function checkDirectory(email: string) {
    const uploadDirName = trimEmail(email)
    const uploadDir = `./public/uploads/vcards/${uploadDirName}`;
    if (!fs.existsSync(uploadDir)) {
        try {
            await fs.mkdirp(uploadDir)
        } catch (error) {
            console.log('fs.mkdirp :: checkDirectory :: fileHandleUttils', error);
        }
        try {
            await fs.chmod(uploadDir, '777')
        } catch (error) {
            console.log('fs.chmod :: checkDirectory :: fileHandleUttils', error);
        }
    }
}

/*Write Image To Specific Directory*/
async function writeImage(email: string, name: string, imageBuffer: Buffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.writeFile(`public/uploads/vcards/${trimEmail(email)}/${name}.png`, imageBuffer, (err) => {
            const imageUrl = `/uploads/vcards/${trimEmail(email)}/${name}.png`
            if (err) {
                reject(err)
            } else {
                resolve(imageUrl)
            }
        })
    })
}

/*Main function which Returns the image Url*/
export const base64ToImage = (base64Data: IBase64Data): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const getBase64TrimString: Buffer = base64TrimString(base64Data.profilePhoto)
        await checkDirectory(base64Data.email)

        writeImage(base64Data.email, base64Data.name, getBase64TrimString)
            .then((imageUrl: string) => {
                resolve(imageUrl)
            }).catch((error) => {
                console.log(error);
                reject(error)
            })
    })
}
