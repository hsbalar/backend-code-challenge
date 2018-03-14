import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import logger from "morgan";

import fs from "fs";
import path from "path";

import config from "./config";

const app = express();

// pretty output
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// enable logging
if (config.logging && config.logging.enable) {
  if (!fs.exists("log")) {
    fs.mkdirSync("log");
  }
  app.use(logger(config.logging.format || "combined", {
    stream: fs.createWriteStream(path.join("log", "access.log"), { flags: "a" })
  }));
}

// register body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow method override
app.use(methodOverride());

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
   res.json({ error: err }).end();
});

export default app;
