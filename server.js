var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors");
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
var unless = require('express-unless');
const response = require("./config/payload_config");

app.use(morgan("combine"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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
    '/v1/tokens/apikey'
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

app.listen(port);
console.log("express RESTful API starting on " + port);
