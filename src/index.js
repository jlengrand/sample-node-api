/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright IBM Corporation 2020
*/

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "http://e1b49746a229427c9cbb8840bfbde82b@bugsink-rk08sow8w0gw0gk0w44kk08s.138.201.122.228.sslip.io/1",
  release: "sample-node-api@1.0.0",
  integrations: [],
  tracesSampleRate: 0,
});

const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');

//build config from params
const config = require('./config');
const {https:{ key, cert}, port, isHttps, serviceName} = config;
const credentials = {key, cert};

//setup app & its routes
const app = express();
app.use(cors());
const routes = require('./routes/index.route');
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

//start http server
const httpServer = http.createServer(app);
httpServer.listen(port);
console.log(`[${serviceName}] http server listening at port ${port}`);

//start https server
if(isHttps) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port+1);
  console.log(`[${serviceName}] https server listening at port ${port + 1}`);
}

module.exports = { app };