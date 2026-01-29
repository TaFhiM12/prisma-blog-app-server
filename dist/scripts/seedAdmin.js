import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";
async function seedAdmin() {
    try {
        console.log("********seeding started********");
        const adminData = {
            name: "Admin Shaheb",
            email: "admin@gmail.com",
            role: UserRole.ADMIN,
            password: "Admin1234"
        };
        //check is user exist or not
        console.log("checking..........");
        const checkExist = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if (checkExist) {
            throw new Error("User already exists");
        }
        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Origin": "http://localhost:3000",
            },
            body: JSON.stringify(adminData)
        });
        console.log('result : ', signUpAdmin);
        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
        }
        console.log("all okay......");
    }
    catch (error) {
        console.log(error);
    }
}
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map