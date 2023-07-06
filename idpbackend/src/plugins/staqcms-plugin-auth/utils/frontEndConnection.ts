// const chalk = require('chalk');
import chalk from 'chalk'

let frontend_url: string;

export const frontEndConnections = {
    setFrontEndUrl(url: string) {
        if (!url) {
            console.error(chalk.red.bold(
                `FRONT_END_URL is required for auth process. Please check your env file for the variable ${chalk.yellow("FRONT_END_URL")}`
            ));
            process.exit(1);
        }
        frontend_url = url;
    },

    getEmailVerificationLinkExpiredLink(username: string) {
        return `${frontend_url}/email-verification-failed?username=${username}`;
    },

    getEmailVerificationSuccessLink(username: string) {
        return `${frontend_url}/email-verification-successful?username=${username}`;
    },

    getResetPasswordLink(token: string, errors: unknown) {
        return `${frontend_url}/reset-password?token=${token}&errors=${errors}`;
    },

    getResetPasswordLinkExpiredLink() {
        return `${frontend_url}/reset-password-failed`;
    },

    getResetPasswordSuccessLink(username: string) {
        return `${frontend_url}/reset-password-successful?username=${username}`;
    },

    getBadRequestLink() {
        return `${frontend_url}/badRequest.html`;
    }
}