var express = require("express"),
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
  hostname = '10.148.0.21';

app.use(morgan("combine"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"))
app.use('/public', serveIndex(__dirname + '/public'));

var jwtCheck = jwt({
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
    '/public'
  ]
});

app.use(jwtCheck)

var routes = require("./routes")
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
    console.log(`express DEVELOPMENT RESTful API starting on :${port}/` + process.env.NODE_ENV);
  });
} else {
  app.listen(port, hostname, () => {
    console.log(`express PRODUCTION RESTful API starting on ${hostname}:${port}/` + process.env.NODE_ENV);
  });
}
