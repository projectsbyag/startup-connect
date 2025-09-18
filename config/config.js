module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    nodeEnv: process.env.NODE_ENV || 'development',
    defaultImageUrl: 'https://via.placeholder.com/150',
    emailFrom: process.env.EMAIL_FROM || 'noreply@startupconnect.com',
    sendgridApiKey: process.env.SENDGRID_API_KEY
};