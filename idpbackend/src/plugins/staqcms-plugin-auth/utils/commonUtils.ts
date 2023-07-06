// const jwt = require("jsonwebtoken")
import jwt from 'jsonwebtoken'
import { Response } from 'express';

export const commonUtils = {

    deleteUndefinedFieldsInObject: function (jsObj: any) {
        // Delete null or undefined fields.
        for (var key in jsObj) {
            if (jsObj.hasOwnProperty(key)) {
                if (!jsObj[key] && typeof jsObj[key] !== 'boolean') {
                    delete jsObj[key];
                }
            }
        }

        return jsObj;
    },

    sendResponse: function (res: Response, status: number, success: boolean, data: unknown, msg: string) {
        let responseData = { success, data, msg };

        status = Number(status);

        if (typeof (status) !== 'number') {
            console.error(`Argument - status - should be of type number. Received type - ${typeof (status)}. Using default status - 200.`);
            status = 200;
        }

        responseData = this.deleteUndefinedFieldsInObject(responseData);
        return res.status(status).json(responseData);
    },

    jwtVerify: function (token: string, secret: string): Promise<string | jwt.JwtPayload | undefined>  {

        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, async function (error, decoded_token: string | jwt.JwtPayload | undefined) {

                if (error) {
                    console.error("ERROR: ", error)

                    if (error.name !== "TokenExpiredError") {
                        reject(error)
                    }

                    if (!decoded_token) {
                        decoded_token = jwt.decode(token) as jwt.JwtPayload
                    }
                }

                resolve(decoded_token)
            })
        })

    }
}
