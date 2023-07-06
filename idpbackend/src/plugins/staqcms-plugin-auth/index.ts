// const staqcms_plugin_nodemailer = require('staqcms-plugin-nodemailer');
// const staqcms_plugin_aws_sms = require('staqcms-plugin-aws-sms');

import { IinitAuthProps } from "./interfaces";
import { authRoutes } from "./modules/auth/routes/auth.routes";
import { frontEndConnections } from "./utils/frontEndConnection";
import { authController } from "./modules/auth/controllers/auth.controllers";
import { authService } from "./modules/auth/controllers/auth.services";



const staqcms_plugin_auth = {
    init: ({ defaultRoleId, authConfig: authConfig, UserModel, mailEventEmitter, smsEventEmitter }: IinitAuthProps) => {

        frontEndConnections.setFrontEndUrl(authConfig.FRONT_END_URL); // Setting global urls.

        authController.init({
            authConfig,
            defaultRoleId,
            mailEventEmitter,
            smsEventEmitter,
            UserModel
        });

    },

    getRouteTable: () => {
        return authRoutes();
    },

    getService: () => {
        return authService;
    }
}

export default staqcms_plugin_auth;