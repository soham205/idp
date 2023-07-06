import express, { Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { MULTER_PROPS, PUBLIC_DIRECTORY } from '../config';
import { multerStorage } from './multer';
import { errorHanlder } from './errorHandler';
import { aclMiddleware } from './aclMiddleware';

const middleWares = {
	applyCors: (app: Express) => {
		try {
			app.use(helmet());
			app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

			app.use(compression());
			app.use(morgan('combined'));
			app.use(express.static(PUBLIC_DIRECTORY));
		} catch (applyCorsMiddleWareError: unknown) {
			throw new Error(applyCorsMiddleWareError as string);
		}
	},

	applyMulterMiddleware: (app: Express) => {
		try {
			multerStorage.init({
				fileSize: Number(MULTER_PROPS.FILE_SIZE_LIMIT) * 1024 * 1024,
				uploadDirectory: MULTER_PROPS.UPLOAD_DIRECTORY
			});

			app.use(multerStorage.upload.any());
		} catch (applyMulterMiddleWare: unknown) {
			throw new Error(applyMulterMiddleWare as string);
		}
	},

	applyErrorHandlingMiddleware: (app: Express) => {
		errorHanlder.internalErrorHanlder(app);
		errorHanlder.notFoundErrorHanlder(app);
	},

	applyAclMiddleware: (app: Express) => {
		aclMiddleware.attachDecodedTokenToRequest(app);
		aclMiddleware.applyAclMiddleware(app);
	}
};
export { middleWares };
