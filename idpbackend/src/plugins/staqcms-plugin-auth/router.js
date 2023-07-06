const authRoute = require('./modules/auth/routes/auth.routes');

module.exports = () => {
    return authRoute();
}
