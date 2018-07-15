import express from 'express';
import morgan from 'morgan';
import compression from 'compression';

import * as WebSocket from 'ws';
import * as path from 'path';
import * as http from 'http';
import { ContentUpdater } from './contentUpdate';

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(PORT);
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use('/compiled', express.static(path.resolve('.', 'compiled/public')));
app.use(express.static(path.resolve('.', 'public')));
app.use(compression());

app.get('/update', (req, res) => {
	if (req.path.indexOf('update') !== -1) {
		try {
			ContentUpdater.update();
		} catch(e) {
			return res.send('Unsuccessful Update: '+ e.message);
		}
		
		return res.send('Successful Update');
	}
});

app.use(function(req, res){
	res.sendFile(path.resolve('.', 'public', 'index.html'));
});



