import nodemailer from 'nodemailer';
import ejs from 'ejs';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config()

const sendmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SHTP_HOST,
        port: process.env.SHTP_PORT,
        service: process.env.SHTP_SERVICE,
        auth: {
            user: process.env.SHTP_MAIL,
            pass: process.env.SHTP_PASSWORD,
        },
    })

    const {email, subject, template, data} = options;
    const __dirname = path.resolve();
    // const templatePath = path.join(__dirname, '../mails/', 'activation-mail.ejs')
    const templatePath = path.join(__dirname, 'mails', 'activation-mail.ejs');

    const html = await ejs.renderFile(templatePath, data)

    const mailOptions = 
        {
            from: process.env.SHTP_MAIL,
            to: email,
            subject,
            html
        }
    

    await transporter.sendMail(mailOptions)
}

export default sendmail;