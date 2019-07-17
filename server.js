var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors");
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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
});

app.use(jwtCheck);

var routes = require("./routes");
routes(app);

app.listen(port);
console.log("running server on port: " + port);
