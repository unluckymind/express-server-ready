const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors"),
  compression = require('compression'),
  helmet = require('helmet'),
  cookieParser = require('cookie-parser'),
  createError = require('http-errors'),
  jwt = require('express-jwt'),
  jwksRsa = require('jwks-rsa'),
  unless = require('express-unless'),
  response = require("./config/payload_config"),
  http = require('http'),
  debug = require('debug')('express-server-ready:server'),
  serveIndex = require('serve-index'),
  Message = require('./helpers/messages'),
  hostname = '10.148.0.21';

app.use(morgan("combine"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"))
app.use('/static', serveIndex(__dirname + '/static'));

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-sahabathalosis.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://sh-api',
  issuer: 'https://dev-sahabathalosis.auth0.com/',
  algorithms: ['RS256']
}).unless({
  path: [
    '/v1/tokens/apikey',
    '/v1/',
    '/goDbAdmin',
    '/',
    '/static'
  ]
});

app.use(jwtCheck)

const routes = require("./routes")
routes(app);

app.use((error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    return response.errAuthorize({
      error
    }, res);
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`${Message.DEV_SERVER} :${port}/` + process.env.NODE_ENV);
  });
} else {
  app.listen(port, hostname, () => {
    console.log(`${Message.PROD_SERVER} :${hostname}:${port}/` + process.env.NODE_ENV);
  });
}
