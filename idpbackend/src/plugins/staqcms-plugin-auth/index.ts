// const staqcms_plugin_nodemailer = require('staqcms-plugin-nodemailer');
// const staqcms_plugin_aws_sms = require('staqcms-plugin-aws-sms');

import { AuthServices } from './authService/authService';

const staqcms_plugin_auth = {
	getService: () => {
		return AuthServices;
	}
};

export default staqcms_plugin_auth;
