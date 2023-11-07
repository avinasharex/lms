import nodemailer from 'nodemailer'

const sendEmail = async function (email, subject, htmlMessage, textMessage){
    // Create a transporter using SMTP (for custom SMTP servers)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_MAIL_HOST, // Your SMTP server hostname
      port: process.env.SMTP_MAIL_PORT, // Port for SMTP (587 for TLS, 465 for SSL)
      secure: false, // Use TLS (true for 465, false for other ports)
      auth: {
        user: process.env.SMTP_MAIL_USERNAME,
        pass: process.env.SMTP_MAIL_PASSWORD
      }
    });

    await transporter.sendMail({
        from: process.env.SMTP_MAIL_EMAIL,
        to: email,
        subject: subject,
        html: htmlMessage,
        text: textMessage
    })
}

export default sendEmail