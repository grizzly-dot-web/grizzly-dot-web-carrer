import express from 'express';
import * as path from 'path';

import Router from './Router';
import DiContainer from "./DiContainer";
import Users from './Component/User/User';

export default class Bootstrap {
    
    private _di : DiContainer

    private _app : express.Express

    private _router: Router

    constructor(app : express.Express, router : Router, di : DiContainer) {
        this._app = app;
        this._di = di;
        this._router = router;
    }

    init() {
        let user = new Users(this._di, this._router);
        user.init();
    }

    listen() {
        this._router.listen();
        this._app.use(['*'], (req, res) => {
            res.sendFile(path.resolve('.', 'public', 'index.html'));
        });
    }
}   