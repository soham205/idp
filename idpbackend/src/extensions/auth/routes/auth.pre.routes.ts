import { IRouterElement } from "../../../plugins/staqcms-plugin-route-resolver/interfaces";
import staqcms_plugin_auth from "../../../plugins/staqcms-plugin-auth";


const authRoutes: IRouterElement[] = [
	...(staqcms_plugin_auth.getRouteTable() as IRouterElement[])
];

export default authRoutes;
