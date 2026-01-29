import { auth as betterAuth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            console.log("middleware......", roles);
            const session = await betterAuth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            });
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not Authorized"
                });
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required. Please verify your email!"
                });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role,
                emailVerified: session.user.emailVerified
            };
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden!You don't have permission to access this resources!"
                });
            }
            next();
        }
        catch (error) {
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map