import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import FileStoreF from 'session-file-store';
import compression from 'compression';
import * as path from 'path';
import * as http from 'http';

import Bootstrap from './Core/Bootstrap';
import DiContainer from './Core/DiContainer';
import Router from './Core/Router';

const PORT = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);
const FileStore = FileStoreF(session);

import morgan from 'morgan';
//app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use('/compiled', express.static(path.resolve('.', 'compiled/public')));
app.use(express.static(path.resolve('.', 'public')));
app.use(compression());
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  name: 'grizzly.web-session',
  secret: 'grizzly-web-secret',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false, secure: false, maxAge: 3600000 },
  store: new FileStore(),
}));


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

let diContainer = new DiContainer();
let router = new Router(app);
let bootstrap = new Bootstrap(app, router, diContainer);

bootstrap.init()
bootstrap.listen();

server.listen(PORT);