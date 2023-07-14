import { IRouteTableEntry, ROUTES_SUFFIXES_E, ROUTE_LOCATIONS_E } from './routes/interfaces';
import fs, { readdir } from 'fs';

import resolveCwd from 'resolve-cwd';

type IRouteEntryExtended = IRouteTableEntry[] | null;

function readDirectory(dirPath: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		readdir(dirPath, null, (err: NodeJS.ErrnoException | null, files: string[]) => {
			if (err) {
				return reject(err);
			}
			return resolve(files);
		});
	});
}

function statFile(filePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.stat(filePath, (statFileError: NodeJS.ErrnoException | null, stats: fs.Stats) => {
			if (statFileError) {
				return reject(statFileError);
			}
			return resolve();
		});
	});
}

async function setRouteTable(rootDir: string, routeSuffix: ROUTES_SUFFIXES_E): Promise<IRouteTableEntry[]> {
	return new Promise((resolve, reject) => {
		let rooDirLoc = `${__dirname}/${rootDir}`;
		readDirectory(rooDirLoc)
			.then((moduleDirectories: string[]) => {
				const routeTableResult: Promise<IRouteTableEntry[] | null>[] = [];
				for (const moduleDirectory of moduleDirectories) {
					const routeEntryPromise: Promise<IRouteTableEntry[] | null> = new Promise((resolve, reject) => {
						let routesDirectoryPath = `${rooDirLoc}/${moduleDirectory}/routes`;
						statFile(routesDirectoryPath)
							.then(() => {
								let isRoutesDirectory = fs.lstatSync(routesDirectoryPath).isDirectory();

								if (!isRoutesDirectory) {
									console.error('Routes should be directory inside module.');
									return reject(new Error('Routes should be directory inside module.'));
								}

								readDirectory(routesDirectoryPath)
									.then(async (routesFiles: string[]) => {
										if (!(routesFiles.length > 0)) {
											return resolve(null);
										}

										const routeEntries: IRouteTableEntry[] = [];

										for (let routesFile of routesFiles) {
											let checkSuffixes = Object.values(ROUTES_SUFFIXES_E);
											checkSuffixes = checkSuffixes.filter((routeSuffixItem) => routeSuffixItem != routeSuffix);

											let checkFileNames: string[] = [];

											let routeFileSplitArr = routesFile.split('.');

											if (routeFileSplitArr.length < 3) {
												// process.exit(1);
												return reject(new Error('Error with route file syntax. '));
											}

											let moduleName = routeFileSplitArr[0] as string;

											let fileRouteSuffix: string | string[] = [...routeFileSplitArr];

											fileRouteSuffix.splice(0, 1);

											fileRouteSuffix.splice(fileRouteSuffix.length - 1, 1);

											fileRouteSuffix = fileRouteSuffix.join('.');

											if (routeSuffix === fileRouteSuffix) {
												for (let checkSuffixItem of checkSuffixes) {
													checkFileNames.push(moduleName + '.' + checkSuffixItem);
												}
												let requiredFile = `${rooDirLoc}/${moduleDirectory}/routes/${routesFile}`;

												let checkRequiredFiles = [];

												for (let checkFileNameItem of checkFileNames) {
													checkRequiredFiles.push(`${rooDirLoc}/${moduleDirectory}/routes/${checkFileNameItem}`);
												}
												const cmdPath = resolveCwd.silent(requiredFile);

												let checkCmdPaths = [];

												for (let checkRequiredFileItem of checkRequiredFiles) {
													checkCmdPaths.push(resolveCwd.silent(checkRequiredFileItem));
												}

												if (!cmdPath) {
													let isRouteFileMissing = true;

													for (let checkCmdPathItem of checkCmdPaths) {
														if (checkCmdPathItem) {
															isRouteFileMissing = isRouteFileMissing && false;
														}
													}

													if (isRouteFileMissing) {
														return reject(new Error('Route file missing'));
													}
													continue;
												}
												try {
													const importedModule = await import(requiredFile);
													routeEntries.push({
														module: moduleName,
														table: importedModule.default
													});
												} catch (importModuleError) {
													console.error('importModuleError :: ', importModuleError);
													return reject(importModuleError);
												}
											} else {
												continue;
											}
										}
										resolve(routeEntries);
									})
									.catch((readRouteDirError) => {
										console.error('readRouteDirError :: ', readRouteDirError);
										return reject(readRouteDirError);
									});
							})
							.catch(() => {
								resolve(null);
							});
					});
					routeTableResult.push(routeEntryPromise);
				}

				Promise.all(routeTableResult)
					.then((routeTableResult: IRouteEntryExtended[]) => {
						let result: IRouteTableEntry[] = [];
						for (const routeTableItem of routeTableResult) {
							if (routeTableItem) {
								result = [...result, ...routeTableItem];
							}
						}
						return resolve(result);
					})
					.catch((makeRouteTableError) => {
						console.error('makeRouteTableError :: ', makeRouteTableError);
						reject(makeRouteTableError);
					});
			})
			.catch(() => {
				/**
				 *  If folders root dir dosent exists then there will be no route table.
				 */
				resolve([]);
			});
	});
}

export const routerTable = {
	getNoBodyParserTable: async (): Promise<IRouteTableEntry[]> => {
		return new Promise((resolve, reject) => {
			const noBodyParserTasks: Promise<IRouteTableEntry[]>[] = [];

			noBodyParserTasks.push(setRouteTable(ROUTE_LOCATIONS_E.MODULES, ROUTES_SUFFIXES_E.NO_BODY_PARSER_ROUTES_SUFFIX));

			noBodyParserTasks.push(setRouteTable(ROUTE_LOCATIONS_E.EXTENSIONS, ROUTES_SUFFIXES_E.NO_BODY_PARSER_ROUTES_SUFFIX));

			noBodyParserTasks.push(setRouteTable(ROUTE_LOCATIONS_E.API, ROUTES_SUFFIXES_E.NO_BODY_PARSER_ROUTES_SUFFIX));

			Promise.all(noBodyParserTasks)
				.then((noBodyParserRoutesResult: IRouteTableEntry[][]) => {
					return resolve(noBodyParserRoutesResult.flat());
				})
				.catch((getRoutesError) => {
					return reject(getRoutesError);
				});
		});
	},

	getPreRouteTable: async (): Promise<IRouteTableEntry[]> => {
		return new Promise((resolve, reject) => {
			const preRouteTableTasks: Promise<IRouteTableEntry[]>[] = [];

			preRouteTableTasks.push(setRouteTable(ROUTE_LOCATIONS_E.MODULES, ROUTES_SUFFIXES_E.PRE_ROUTES_SUFFIX));

			preRouteTableTasks.push(setRouteTable(ROUTE_LOCATIONS_E.EXTENSIONS, ROUTES_SUFFIXES_E.PRE_ROUTES_SUFFIX));

			preRouteTableTasks.push(setRouteTable(ROUTE_LOCATIONS_E.API, ROUTES_SUFFIXES_E.PRE_ROUTES_SUFFIX));

			Promise.all(preRouteTableTasks)
				.then((presRoutesResult: IRouteTableEntry[][]) => {
					presRoutesResult = presRoutesResult.filter((item) => item && item.length > 0);
					return resolve(presRoutesResult.flat());
				})
				.catch((getRoutesError) => {
					return reject(getRoutesError);
				});
		});
	},

	getRouteTable: async (): Promise<IRouteTableEntry[]> => {
		return new Promise((resolve, reject) => {
			const routeTableTasks: Promise<IRouteTableEntry[]>[] = [];

			routeTableTasks.push(setRouteTable(ROUTE_LOCATIONS_E.MODULES, ROUTES_SUFFIXES_E.ROUTES_SUFFIX));

			routeTableTasks.push(setRouteTable(ROUTE_LOCATIONS_E.EXTENSIONS, ROUTES_SUFFIXES_E.ROUTES_SUFFIX));

			routeTableTasks.push(setRouteTable(ROUTE_LOCATIONS_E.API, ROUTES_SUFFIXES_E.ROUTES_SUFFIX));

			Promise.all(routeTableTasks)
				.then((routesResult: IRouteTableEntry[][]) => {
					routesResult = routesResult.filter((item) => item && item.length > 0);
					return resolve(routesResult.flat());
				})
				.catch((getRoutesError) => {
					return reject(getRoutesError);
				});
		});
	}
};
