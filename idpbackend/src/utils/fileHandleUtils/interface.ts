
interface IFileSystem {
    readFile: (filePath: string) => Promise<string>;
    readDir: (filePath: string) => Promise<string[]>;
    writeFile: (filePath: string, fileContent: string) => Promise<void>;
    downloadFile: (fileUrl: string, destinationPath: string) => Promise<void>;
    isDirectoryExist: (filePath: string) => Promise<boolean>;
    createDirectoryIfNotExist: (filePath: string) => Promise<void>;
    mkdir: (dirPath: string) => Promise<void>;
    getCwd: () => string;
    deleteFile: (filePath: string) => Promise<void>;
    copyFile: (filePath: string, destinationPath: string) => Promise<void>;
    // archiver: {
    //     zip: (srcFilePath: string | string[], dstFilePath: string) => Promise<string>;
    //     unzip: (srcFilePath: string, dstFilePath: string, charset?: string) => Promise<string>;
    // };
    clearFiles: () => Promise<void>;
}
