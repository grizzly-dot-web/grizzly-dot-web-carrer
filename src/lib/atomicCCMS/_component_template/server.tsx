import { Request, Response, NextFunction } from 'express';

import AtomicComponent from "../_shared/Components/Abstract/AtomicComponent/server";

export default class IssueTracker extends AtomicComponent {
    protected name: string;    
    
    index(req: Request, res: Response, next: NextFunction): void {
        throw new Error("Method not implemented.");
    }
    
    init(): void {
        throw new Error("Method not implemented.");
    }

    
}