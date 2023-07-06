import fs from 'fs'

async function createPath(dirPath: string): Promise<void> {
	let destinationPath = FileSystem.getCwd();

	const relativeFilePath = dirPath.replace(FileSystem.getCwd(), '');
	const directories = relativeFilePath.split('/');

	for (const directoryItem of directories.slice(1)) {
		destinationPath = destinationPath + '/' + directoryItem;
		try {
			console.log('destinationPath', destinationPath);

			await new Promise<void>((resolve, reject) => {
				FileSystem.isDirectoryExist(destinationPath)
					.then((isDirectory) => {
						if (!isDirectory) {
							FileSystem.mkdir(destinationPath)
								.then(() => {
									resolve();
								})
								.catch((mkDirError) => {
									reject(mkDirError);
								});
						} else {
							resolve();
						}
					})
					.catch((isDirectoryExistError) => {
						reject(isDirectoryExistError);
					});
			});
		} catch (error) {
			throw new Error(error as string);
		}
	}

}

export const FileSystem: IFileSystem = {
	readFile: function (filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, (err) => {
				if (err) {
					return reject(err)
				}
				resolve(filePath);
			});
		});
	},

	readDir: function (dirPath: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readdir(dirPath, (err, files: string[]) => {
				if (err) {
					return reject(err)
				}
				resolve(files)
			});
		});
	},

	writeFile: function (filePath: string, fileContent: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const fileDirectoryPath = new Array(...filePath.split('/').slice(0, -1)).join('/');
			console.log('fileDirectoryPath', fileDirectoryPath);

			this.createDirectoryIfNotExist(fileDirectoryPath)
				.then(() => {
					fs.writeFile(filePath, fileContent, (err) => {
						if (err) {
							return reject(err)
						}
						resolve()
					});
				})
				.catch((writeFileError) => {
					reject(writeFileError);
				});
		});
	},

	isDirectoryExist: function (dirPath: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve(fs.existsSync(dirPath))
		});
	},

	createDirectoryIfNotExist: function (dirPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			createPath(dirPath).then(() => { resolve() }).catch((err) => {
				return reject(err)
			})
		});
	},

	mkdir: function (dirPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			fs.mkdir(dirPath, (err) => {
				if (err) {
					return reject(err)
				}
				resolve()
			});
		});
	},

	getCwd: function (): string {
		return './public';
	},

	deleteFile: function (filePath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			fs.unlink(filePath, (err) => {
				if (err) {
					return reject(err);
				}
				resolve();

			});
		});
	},

	copyFile: function (srcFilePath: string, destinationPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const fileDirectoryPath = new Array(...destinationPath.split('/').slice(0, -1)).join('/')
			this.createDirectoryIfNotExist(fileDirectoryPath)
				.then(() => {
					fs.copyFile(srcFilePath, destinationPath, (err) => {
						if (err) {
							return reject(err)
						}
						resolve()
					})
				})
				.catch((createFileError) => {
					console.log(createFileError);
				});
		});
	},

	clearFiles: function (): Promise<void> {
		return new Promise((resolve, reject) => {
			const rootPath = this.getCwd();
			fs.readdir(rootPath, (err) => {
				if (err) {
					return reject(err)
				}
				resolve()
			})
		});
	},

	downloadFile: function (fileUrl: string, destinationPath: string): Promise<void> {
		throw new Error('Function not implemented.');
	}
};


