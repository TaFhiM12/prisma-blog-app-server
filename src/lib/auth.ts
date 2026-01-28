import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Verify your email</title>
                </head>
                <body style="margin:0; padding:0; background:#f6f9fc; font-family: Arial, Helvetica, sans-serif;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fc; padding: 24px 0;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">
                          
                          <!-- Header -->
                          <tr>
                            <td style="padding: 20px 24px; background:#0b5fff;">
                              <div style="color:#ffffff; font-size:18px; font-weight:700;">Prisma Blog</div>
                              <div style="color:#dbe7ff; font-size:13px; margin-top:4px;">Email Verification</div>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="padding: 28px 24px;">
                              <h1 style="margin:0 0 12px; font-size:22px; color:#0b1220; line-height:1.3;">
                                Verify your email address
                              </h1>
                              <p style="margin:0 0 16px; font-size:15px; color:#4b5563; line-height:1.6;">
                                Thanks for signing up for <strong>Prisma Blog</strong>. Please confirm your email address by clicking the button below.
                              </p>

                              <!-- Button -->
                              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 20px 0 18px;">
                                <tr>
                                  <td align="center" bgcolor="#0b5fff" style="border-radius:10px;">
                                    <a href="${verificationUrl}"
                                      style="display:inline-block; padding:12px 18px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:700;">
                                      Verify Email
                                    </a>
                                  </td>
                                </tr>
                              </table>

                              <p style="margin:0 0 10px; font-size:13px; color:#6b7280; line-height:1.6;">
                                If the button doesn’t work, copy and paste this link into your browser:
                              </p>

                              <p style="margin:0 0 18px; font-size:13px; line-height:1.6; word-break:break-all;">
                                <a href="${verificationUrl}" style="color:#0b5fff; text-decoration:underline;">
                                  ${verificationUrl}
                                </a>
                              </p>

                              <hr style="border:none; border-top:1px solid #eef2f7; margin: 22px 0;" />

                              <p style="margin:0; font-size:12px; color:#6b7280; line-height:1.6;">
                                This link will expire soon for your security. If you didn’t create an account, you can safely ignore this email.
                              </p>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td style="padding: 16px 24px; background:#f8fafc; color:#6b7280; font-size:12px; text-align:center;">
                              © ${new Date().getFullYear()} Prisma Blog • All rights reserved
                            </td>
                          </tr>

                        </table>

                        <!-- Gmail-style small footer spacing -->
                        <div style="height:16px;"></div>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
            `;
            const info = await transporter.sendMail({
                from: '"Prisma Blog" <prismablog@gmail.com>',
                to: "tanvirmahtabtafhim@gmail.com",
                subject: "Verify your email",
                html,
                text: `Verify your email: ${verificationUrl}`,
            });
        },
    },

    socialProviders: {
        google: { 
            prompt: "select_account",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});