import express from 'express';
import session from 'express-session';
import FileStoreF from 'session-file-store';
import morgan from 'morgan';
import compression from 'compression';
import * as WebSocket from 'ws';
import * as path from 'path';
import * as http from 'http';
import { Guid } from "guid-typescript";

const PORT = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const FileStore = FileStoreF(session);

server.listen(PORT);
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


import {users, defaultUser} from "./DefaultUsers";

app.get('/users/current', (req, res) => {
	if (req.session && req.session.user) {
		res.send(JSON.stringify(req.session.user));
		return;
	}
	res.send(JSON.stringify(defaultUser));
});

app.get('/login/:username/:hash', (req, res) => {
	let user = users.filter((u) => {
		return u.username === req.params.username && u.passwordHash === req.params.hash;
	});
	
	if (user.length !== 1) {
		res.redirect('/');
	}

	if (req.session) {
		req.session.user = user[0];
	}

	res.redirect('/');
});

app.use(['*'], function(req, res) {
	res.sendFile(path.resolve('.', 'public', 'index.html'));
});