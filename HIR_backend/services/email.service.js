const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

function isTruthy(value) {
    return String(value).trim().toLowerCase() === 'true';
}

function getSmtpConfig() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const portRaw = process.env.SMTP_PORT;
    const port = portRaw ? Number(portRaw) : undefined;

    const secure = process.env.SMTP_SECURE
        ? isTruthy(process.env.SMTP_SECURE)
        : port === 465;

    const tlsRejectUnauthorized = process.env.SMTP_TLS_REJECT_UNAUTHORIZED
        ? isTruthy(process.env.SMTP_TLS_REJECT_UNAUTHORIZED)
        : true;

    const from = process.env.SMTP_FROM || user || process.env.ADMINMAIL;

    return { host, user, pass, port, secure, from, tlsRejectUnauthorized };
}

function isEmailEnabled() {
    const { host, user, pass } = getSmtpConfig();
    return Boolean(host && user && pass);
}

let cachedTransport;
function getTransport() {
    if (cachedTransport) return cachedTransport;

    const { host, user, pass, port, secure, tlsRejectUnauthorized } = getSmtpConfig();

    cachedTransport = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
            rejectUnauthorized: tlsRejectUnauthorized
        }
    });

    return cachedTransport;
}

async function renderEmailTemplate(templateFileName, data) {
    const templatePath = path.join(__dirname, '..', 'emails', templateFileName);
    return ejs.renderFile(templatePath, data);
}

async function sendAdvertCreationEmail({
    to,
    advertName,
    categoryName,
    price,
    imageUrl
}) {
    if (!isEmailEnabled()) {
        return { sent: false, reason: 'Email disabled (missing SMTP env vars)' };
    }

    const { from } = getSmtpConfig();

    const html = await renderEmailTemplate('advert-created.ejs', {
        advertName,
        categoryName,
        price,
        imageUrl,
        createdAt: new Date()
    });

    const text = [
        'Sikeres hirdetésfeladás!',
        '',
        `Hirdetés neve: ${advertName || ''}`,
        `Kategória: ${categoryName || ''}`,
        `Ár: ${price || ''} Ft`,
        '',
        'Köszönjük, hogy nálunk hirdetsz!'
    ]
        .filter(Boolean)
        .join('\n');

    const transporter = getTransport();

    const info = await transporter.sendMail({
        from,
        to,
        subject: 'Sikeres hirdetésfeladás',
        text,
        html,
        attachments: [
            {
                filename: 'favicon.ico',
                path: path.join(__dirname, '..', '..', 'HIR_frontend', 'public', 'favicon.ico'),
                cid: 'logo' // same cid value as in the html img src
            }
        ]
    });

    return { sent: true, messageId: info.messageId };
}

async function sendRegistrationSuccessEmail({
    to,
    name,
    email,
    backupEmail,
    phone,
    address
}) {
    if (!isEmailEnabled()) {
        return { sent: false, reason: 'Email disabled (missing SMTP env vars)' };
    }

    const { from } = getSmtpConfig();

    const html = await renderEmailTemplate('registration-success.ejs', {
        name,
        email,
        backupEmail,
        phone,
        address,
        createdAt: new Date()
    });

    const text = [
        'Sikeres regisztráció!',
        '',
        `Név: ${name || ''}`,
        `Email: ${email || ''}`,
        backupEmail ? `Tartalék email: ${backupEmail}` : null,
        `Telefon: ${phone || ''}`,
        `Cím: ${address || ''}`,
        '',
        'Biztonsági okokból a jelszavadat nem küldjük el emailben.'
    ]
        .filter(Boolean)
        .join('\n');

    const transporter = getTransport();

    const info = await transporter.sendMail({
        from,
        to,
        subject: 'Sikeres regisztráció',
        text,
        html
    });

    return { sent: true, messageId: info.messageId };
}

module.exports = {
    isEmailEnabled,
    sendRegistrationSuccessEmail,
    sendAdvertCreationEmail
};
