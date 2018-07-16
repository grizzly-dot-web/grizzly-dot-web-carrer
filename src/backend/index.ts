import express from 'express';
import session from 'express-session';
import FileStoreF from 'session-file-store';
import morgan from 'morgan';
import compression from 'compression';
import * as WebSocket from 'ws';
import * as path from 'path';
import * as http from 'http';
import { Guid } from "guid-typescript";

import { ContentUpdater } from './contentUpdate';

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

//TODO assign on production an session store https://github.com/expressjs/session#compatible-session-stores
app.use(session({
  name: 'grizzly.web-session',
  secret: 'grizzly-web-secret',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false, secure: false, maxAge: 3600000 },
  store: new FileStore(),
}));


import {users, defaultUser} from "./DefaultUsers";
import User from '../frontend/ts/Core/Models/User';

app.get('/users/current', (req, res) => {
	console.warn('get user', req.session);
	if (req.session && req.session.user) {
		res.send(JSON.stringify(req.session.user));
		return;
	}
	res.send(JSON.stringify(defaultUser));
});

app.get('/login/:username/:hash', (req, res) => {
	console.log('set user', req.session);
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

app.get('/update', (req, res) => {
	try {
		ContentUpdater.update();
	} catch(e) {
		return res.send('Unsuccessful Update: '+ e.message);
	}
	
	return res.send('Successful Update');
});

app.use(['*'], function(req, res) {
	res.sendFile(path.resolve('.', 'public', 'index.html'));
});


/*
for (let i = 0; i < 7; i++) {
	console.log('--');
	console.log(Guid.create().toString());
}
*/