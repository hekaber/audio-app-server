/*
 * Authentication & Authorization
 */
const passport = require("passport");

module.exports = {
    token: () => passport.authenticate('jwt', { session: false }),
};
