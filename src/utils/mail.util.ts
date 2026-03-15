import nodemailer from 'nodemailer';

const getTransporter = () => {
    const host = process.env.MAIL_HOST;
    const port = Number(process.env.MAIL_PORT) || 587;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;
    const secure = process.env.MAIL_SECURE === 'true';

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });
};

export interface SendStudentCredentialsOptions {
    to: string;
    candidateName: string;
    registrationNo: string;
    dateOfBirth: string;
}

/**
 * Sends an email to the student with their login credentials (Registration Number and DOB).
 * If SMTP is not configured (MAIL_* env vars missing), the function no-ops and returns false.
 */
export const sendStudentCredentialsEmail = async (
    options: SendStudentCredentialsOptions
): Promise<boolean> => {
    const { to, candidateName, registrationNo, dateOfBirth } = options;
    const transporter = getTransporter();

    if (!transporter) {
        console.warn('[Mail] SMTP not configured (MAIL_HOST, MAIL_USER, MAIL_PASS). Skipping student credentials email.');
        return false;
    }

    const from = process.env.MAIL_FROM || process.env.MAIL_USER || 'noreply@mivpsa.com';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #333;">Student Registration – Login Credentials</h2>
            <p>Dear ${candidateName || 'Student'},</p>
            <p>You have been successfully registered. Use the following credentials to log in to the student portal:</p>
            <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                <tr style="background: #f5f5f5;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Login ID (Registration Number)</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${registrationNo}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Password (Date of Birth)</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${dateOfBirth}</td>
                </tr>
            </table>
            <p>Please keep these credentials secure and do not share them with anyone.</p>
            <p style="color: #666; font-size: 14px;">— MIVPSA</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"MIVPSA" <${from}>`,
            to,
            subject: 'Your Student Login Credentials – MIVPSA',
            html,
        });
        return true;
    } catch (err: any) {
        console.error('[Mail] Failed to send student credentials email:', err?.message || err);
        return false;
    }
};
