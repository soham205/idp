import { AUTH_TEMPLATES_T } from '../plugins/staqcms-plugin-auth/interfaces';
import { MAIL_AUTH } from '../config';

export const AUTH_EMAIL_TEMPLATES: AUTH_TEMPLATES_T = {
	email_confirmation_event: {
		fromEmail: MAIL_AUTH.senderEmail,
		fromName: MAIL_AUTH.userName,
		subject: '[Amazin] Verify your email on Amazin',
		text: `Hi <%= userName %>,

        To complete your sign up, please verify your email:

        <%= serverUrl %>/api/v1/auth/confirmEmailAddress?token=<%= verificationCode %>

        NOTE: This link is valid for 48 hours.

        Regards,
        Amazin Team`,
		html: `<div style="background-color: #dfe0e0; padding-bottom: 7rem;">
            <table style='background-color: white; color: #0A0303; margin: 0 auto'>
                <tr>
                    <td>
                        <table style='width: 600px;'>
                            <thead style='background: #262A34; color: white;'>
                                <tr style='text-align: center;'>
                                    <td colspan='4'
                                        style='padding: 10px 20px; display: flex; align-items: center;'>
                                        <span> <img src='https://amazinstays.com/assets/images/amazin_stays_logo_dark.png'
                                                style='max-width: 30px;' /></span>
                                        <span
                                            style="padding-left: 10px; font-size: 20px; text-transform: uppercase; color: white; text-decoration: none; margin-top: 4px;">
                                            Amazin
                                        </span>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="padding: 20px 20px;">
                                    <td style="padding: 2rem;">
                                        <p style="margin-top: 0;">
                                            Hi <%= userName %>,
                                        </p>
                                        To complete your sign up, please verify your email:
                                        <br>
                                        <br>
                                        <a href="<%= serverUrl %>/api/v1/auth/confirmEmailAddress?token=<%= verificationCode %>"
                                            style="width: fit-content; background-color: #E5A544; color: #0A0303; padding: 0.5rem 1.25rem; border: none; border-radius: 4px; text-decoration: none;">
                                            Verify Email
                                        </a>
                                        <br>
                                        <br>
                                            <h5 style="margin: 0;">NOTE: This link is valid for 48 hours.</h5>
                                            <br>
                                        Regards,<br>
                                        Amazin Team
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>
        </div>`
	},

	email_verified_event: {
		fromEmail: MAIL_AUTH.senderEmail,
		fromName: MAIL_AUTH.userName,
		subject: '[Amazin] Verify your email on Amazin',
		text: `Hi <%= userName %>,

        Congratulations, Your email is confirmed! 

        Regards,
        Amazin Team`,
		html: `<div style="background-color: #dfe0e0; padding-bottom: 7rem;">
            <table style='background-color: white; color: #0A0303; margin: 0 auto'>
                <tr>
                    <td>
                        <table style='width: 600px;'>
                            <thead style='background: #262A34; color: white;'>
                                <tr style='text-align: center;'>
                                    <td colspan='4'
                                        style='padding: 10px 20px; display: flex; align-items: center;'>
                                        <span> <img src='https://amazinstays.com/assets/images/amazin_stays_logo_dark.png'
                                                style='max-width: 30px;' /></span>
                                        <span
                                            style="padding-left: 10px; font-size: 20px; text-transform: uppercase; color: white; text-decoration: none; margin-top: 4px;">
                                            Amazin
                                        </span>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="padding: 20px 20px;">
                                    <td style="padding: 2rem;">
                                        <p style="margin-top: 0;">
                                        Congratulations <%= userName %>,
                                        </p>
                                        <p>Your email is confirmed!</p>
                                        <br>
                                        <a href="<%= frontEndUrl %>"
                                            style="width: fit-content; background-color: #E5A544; color: #0A0303; padding: 0.5rem 1.25rem; border: none; border-radius: 4px; text-decoration: none;">
                                            Go to Home Page
                                        </a>
                                        <br>
                                        <br>
                                        <br>
                                        Regards,<br>
                                        Amazin Team
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>
        </div>`
	},

	forgot_password_event: {
		fromEmail: MAIL_AUTH.senderEmail,
		fromName: MAIL_AUTH.userName,
		subject: '[Amazin] Forgot your password.',
		text: `Hi <%= userName %>,

        You recently requested to reset your password for your Amazin Account. Click the button below to reset it.

        <%= serverUrl %>/api/v1/auth/resetPassword?token=<%= forgotPasswordToken %>

        If you did not request a password reset, please feel free to ignore this email. No changes have been made to your account yet.
        NOTE: This password reset is only valid for next 30 minutes.
        
        Regards,
        The Amazin Team`,

		html: `<div style="background-color: #dfe0e0; padding-bottom: 7rem;">
    <table style='background-color: white; color: #0A0303; margin: 0 auto'>
        <tr>
            <td>
                <table style='width: 600px;'>
                    <thead style='background: #262A34; color: white;'>
                        <tr style='text-align: center;'>
                            <td colspan='4'
                                style='padding: 10px 20px; display: flex; flex-direction: row; align-items: center;'>
                                <span> 
                                    <img src='https://amazinstays.com/assets/images/amazin_stays_logo_dark.png' style='max-width: 30px;' />
                                </span>
                                <span
                                    style="padding-left: 10px; font-size: 20px; text-transform: uppercase; color: white; text-decoration: none; margin-top: 4px;">
                                    Amazin
                                </span>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="padding: 20px 20px;">
                            <td style="padding: 2rem">
                                <p style="margin-top: 0;">
                                    Hi <%= userName %>,
                                </p>
                                <p>You recently requested to reset your password for your Amazin Account. </p>
                                <p>Click the button below to reset it.</p>
                                <br>
                                <a href="<%= serverUrl %>/api/v1/auth/resetPassword?token=<%= forgotPasswordToken %>"
                                        style="width: fit-content; background-color: #E5A544; color: #0A0303; padding: 0.5rem 1.25rem; border: none; border-radius: 4px; text-decoration: none;">
                                            Reset your password
                                </a>
                                <br>
                                <br>
                                <p>If you did not request a password reset, please feel free to ignore this email. No changes have been made to your account yet.</p>
                                <h5 style="margin: 0">NOTE: This password reset is only valid for next 30 minutes.</h5>
                                <br>
                                Regards,<br>
                                The Amazin Team
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</div>`
	},

	email_reconfirmation_event: {
		fromEmail: MAIL_AUTH.senderEmail,
		fromName: MAIL_AUTH.userName,
		subject: '[Amazin] Verify your email on Amazin',
		text: `Hi <%= userName %>,

        Click below link to verify your email:  

        <%= serverUrl %>/api/v1/auth/confirmEmailAddress?token=<%= verificationCode %>

        NOTE: This link is valid for 48 hours.

        Regards,
        Amazin Team`,
		html: `<div style="background-color: #dfe0e0; padding-bottom: 7rem;">
            <table style='background-color: white; color: #0A0303; margin: 0 auto'>
                <tr>
                    <td>
                        <table style='width: 600px;'>
                            <thead style='background: #262A34; color: white;'>
                                <tr style='text-align: center;'>
                                <td colspan='4'
                                style='padding: 10px 20px; display: flex; align-items: center;'>
                                <span> <img src='https://amazinstays.com/assets/images/amazin_stays_logo_dark.png'
                                        style='max-width: 30px;' /></span>
                                <span
                                    style="padding-left: 10px; font-size: 20px; text-transform: uppercase; color: white; text-decoration: none; margin-top: 4px;">
                                    Amazin
                                </span>
                            </td>
                            </tr>
                            </thead>
                            <tbody>
                                <tr style="padding: 20px 20px;">
                                    <td style="padding: 2rem;">
                                        <p style="margin-top: 0;">
                                            Hi <%= userName %>,
                                        </p>
                                        Click below link to verify your email:
                                        <br>
                                        <br>
                                        <a href="<%= serverUrl %>/api/v1/auth/confirmEmailAddress?token=<%= verificationCode %>"
                                        style="width: fit-content; background-color: #E5A544; color: #0A0303; padding: 0.5rem 1.25rem; border: none; border-radius: 4px; text-decoration: none;">
                                        Verify Email
                                    </a>
                                        <br>
                                        <br>
                                            <h5 style="margin: 0;">NOTE: This link is valid for 48 hours.</h5>
                                            <br>
                                        Regards,<br>
                                        Amazin Team
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>
        </div>`
	},

	email_registered: {
		fromEmail: MAIL_AUTH.senderEmail,
		fromName: MAIL_AUTH.userName,
		subject: '[Staqwise Solutions Pvt.Ltd.] Successfully Registered',
		text: `Hi <%= userName %>,

        Congratulations, You Are Successfully Registered! 

        Regards,
        Staqwise Solutions Pvt.Ltd.`,
		html: `<div style="background-color: #dfe0e0; padding-bottom: 7rem;">
           <h3>You are successfully Registered</h3>
        </div>`
	}
};
