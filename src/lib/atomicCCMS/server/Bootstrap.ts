import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import FileStoreF from 'session-file-store';
import compression from 'compression';
import * as path from 'path';
import * as http from 'http';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;
const FileStore = FileStoreF(session);

/**
 * @description define Static Files
 */
app.use('/compiled', express.static(path.resolve('www', 'compiled', 'public')));
app.use(express.static(path.resolve('www', 'public')));



/**
 * @description exable compression for served Files
 */
app.use(compression());



/**
 * @description Express Server enable Sessions
 */
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  name: 'grizzly.web-session',
  secret: 'grizzly-web-secret',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false, secure: false, maxAge: 3600000 },
  store: new FileStore({
    path: path.resolve('www', 'persistent', 'session')
  }),
}));



/**
 * @description  enable access Post Request Body
 */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());




import Router from './Router';
import DiContainer from "./DiContainer";
import AtomicComponent from '../_shared/Components/Abstract/AtomicRoutingComponent/server';

export default class Bootstrap {
    
    private _di : DiContainer

    private _router: Router

    constructor() {
        this._di = new DiContainer();
        this._router = new Router(app);
    }

    init(callback : (di : DiContainer, router : Router) => AtomicComponent[]) {
        let componment = callback(this._di, this._router);
    }

    listen() {
        this._router.listen();
        app.use(['*'], (req, res) => {
            res.sendFile(path.resolve('www', 'public', 'index.html'));
        });

        server.listen(PORT);
    }
}   