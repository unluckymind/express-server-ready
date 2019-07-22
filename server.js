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
  debug = require('debug')('express-server-ready:server');

app.use(morgan("combine"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
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
    '/v1/tokens/apikey',
    '/v1/'
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

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app)


app.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
console.log("express RESTful API starting on " + port);
