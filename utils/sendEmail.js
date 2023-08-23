import nodemailer from 'nodemailer'

const sendEmail = async function (email, subject, message){
    // Create a transporter using SMTP (for custom SMTP servers)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Your SMTP server hostname
      port: process.env.SMTP_PORT, // Port for SMTP (587 for TLS, 465 for SSL)
      secure: false, // Use TLS (true for 465, false for other ports)
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: email,
        subject: subject,
        html: message
    })
}

export default sendEmail