const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const adminAuthRouter = require('./routes/admin-auth.route');
const wakifAuthRouter = require('./routes/wakif-auth.route');
const programWakafRouter = require('./routes/program-wakaf.route');
const kategoriRouter = require('./routes/kategori.route');
const wakafAbadiRouter = require('./routes/wakaf-abadi.route');
const wakafBerjangkaRouter = require('./routes/wakaf-berjangka.route');
const midtransRouter = require('./routes/midtrans.route');
const adminRouter = require('./routes/admin.route');
const userRouter = require('./routes/users.route');
const semuaWakafRouter = require('./routes/semua-wakaf.route');
const LaporanRouter = require('./routes/laporan.route');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
  limit:'5mb',
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);

wakifAuthRouter(app);
adminAuthRouter(app);
userRouter(app);
adminRouter(app);
kategoriRouter(app);
programWakafRouter(app);
wakafAbadiRouter(app);
wakafBerjangkaRouter(app);
midtransRouter(app);
semuaWakafRouter(app);
LaporanRouter(app);
const debug = require('debug')('backend:server');
const http = require('http');

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const server = http.createServer(app);
//require the Elasticsearch library
const elasticsearch = require('elasticsearch');
// instantiate an elasticsearch client
const client = new elasticsearch.Client({
  hosts: [ 'http://localhost:9200']
});
// ping the client to be sure Elasticsearch is up
client.ping({
  requestTimeout: 30000,
}, function(error) {
  // at this point, eastic search is down, please check your Elasticsearch service
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('elasticsearch is ok');
  }
});

var allRecords = [];

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}

module.exports = app;
