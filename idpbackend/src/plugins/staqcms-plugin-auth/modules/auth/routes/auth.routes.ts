import { authController } from '../controllers/auth.controllers'

const authRoute = [
  {
    path: "/getMobileOTP",
    method: ["post"],
    pathCallback: authController.getMobileOTP,
  },
  {
    path: `/changeEmail`,
    method: ["post"],
    pathCallback: authController.changeEmail,
  },
  {
    path: "/validateMobile",
    method: ["post"],
    pathCallback: authController.validateMobile,
  },
  {
    path: `/register`,
    method: ["post"],
    pathCallback: authController.register,
  },
  {
    path: `/login/local`,
    method: ["post"],
    pathCallback: authController.login,
  },
  {
    path: `/login/facebook`,
    method: ["post"],
    pathCallback: authController.facebookLogin,
  },
  {
    path: `/confirmEmailAddress`,
    method: ["get"],
    pathCallback: authController.confirmEmailAddress,
  },
  {
    path: `/forgotPassword`,
    method: ["post"],
    pathCallback: authController.forgotPassword,
  },
  {
    path: `/resetPassword`,
    method: ["get"],
    pathCallback: authController.resetPassword,
  },
  {
    path: `/changePassword`,
    method: ["post"],
    pathCallback: authController.changePassword,
  },
]

export const authRoutes = () => {
  return authRoute
}
