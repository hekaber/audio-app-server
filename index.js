/*
 * application launcher.
 */
"use strict";

const appModules = require("./app");

let app = appModules.app;
// connect our app to the MongoDB database.
app.locals.connect().then(() => {
    console.log(app.locals.name + ' connected to MongoDB');

    // listen to the configured port for incoming requests.
    const port = process.env.PORT || app.locals.config.server.port;

    app.listen(port, function () {
        console.log(app.locals.name + ' listening on port ' + port);
    });
}).catch(err => {
    console.error(err.message);
});
