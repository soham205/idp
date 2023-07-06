import { userController } from "../controllers/user.controllers";
import { IInitUserServiceProps } from "../../../interfaces/userinterface";

const userRoute = [
  {
    path: `/`,
    method: ["get"],
    pathCallback: userController.find,
  },
  {
    path: `/:id`,
    method: ["get"],
    pathCallback: userController.findOne,
  },
  {
    path: `/`,
    method: ["post"],
    pathCallback: userController.create,
  },
  {
    path: `/:id`,
    method: ["put"],
    pathCallback: userController.update,
  },
  {
    path: `/`,
    method: ["delete"],
    pathCallback: userController.deleteAll,
  },
  {
    path: `/:id`,
    method: ["delete"],
    pathCallback: userController.delete,
  },
];

export const userRoutes = (User: IInitUserServiceProps) => {
  userController.init(User);
  return userRoute;
};
