
import { Request } from 'express'
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs'


interface IInitMulterOptions {
    fileSize: number,
    uploadDirectory: string
}

interface IMulterUpload {
    init: (initMulterOptions: IInitMulterOptions) => void
    upload: Multer,
    getImageUrls: (request: Request, imagesToBeRemoved?: string[]) => Express.Multer.File[]
}
let uploadDirectory = 'public/uploads';
let fileCounter = 0;
let fileSizeLimit = 0;

function ensureExists(path: string, mask: string, cb: (err: null | unknown) => void) {
    fs.mkdir(path, mask, function (err) {
        if (err) {
            if (err.code == "EEXIST") cb(null)
            // ignore the error if the folder already exists
            else cb(err) // something else went wrong
        } else cb(null) // successfully created folder
    })
}

function getModelName(originalUrl: string): string {
    let destinationSubDirectory: string[] | string = []
    let destinationSubDirectoryResult = ''
    if (originalUrl) {
        destinationSubDirectory = originalUrl.split("/");
        destinationSubDirectoryResult = destinationSubDirectory[3];
    }
    return destinationSubDirectoryResult
}


const multerDiskStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        let destinationDirectory = uploadDirectory + "/"
        let destinationSubDirectory = getModelName(req.originalUrl)
        if (destinationSubDirectory) {
            destinationDirectory += destinationSubDirectory + "/"
        }

        ensureExists(destinationDirectory, '0744', function (err) {
            if (err) {
                console.error("ERROR: ", err)
            } else {
                cb(null, destinationDirectory)
            }
        })
    },

    filename: (req: Request, file: Express.Multer.File, cb) => {
        let imageName = ""
        let modelName = getModelName(req.originalUrl)
        if (modelName) {
            imageName += modelName
        }
        imageName += "_" + new Date().getTime()
        imageName += "_" + fileCounter + path.extname(file.originalname)

        if (fileCounter > 100) fileCounter = 0
        else fileCounter++

        cb(null, imageName)
    },
})

function fileFilter(req: Request, file: Express.Multer.File, cb: (error: null | unknown, info?: boolean) => void) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    }
}
let multerInstance = null;

export const multerStorage: IMulterUpload = {
    init: (initMulterOptions: IInitMulterOptions) => {
        uploadDirectory = initMulterOptions.uploadDirectory
        fileSizeLimit = initMulterOptions.fileSize
    },
    upload: multer({ storage: multerDiskStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }),
    getImageUrls: (request: Request, imagesToBeRemoved?: string[]) => {
        let imageUrls: Express.Multer.File[] = [];
        if (request.files) {
            imageUrls = Object.values(request.files).map(item => { return { ...item, path: item.path.split('public/')[1] } });
        }
        return imageUrls;
    }
}