import { Request, Response, NextFunction } from 'express';
import AtomicComponent from '../../../../../../lib/atomicCCMS/_shared/Components/Abstract/AtomicComponent/server';


export default class CookieInfo extends AtomicComponent {
    protected name = 'CookieInfo';    
    
    index(req: Request, res: Response, next: NextFunction): void {
        throw new Error("Method not implemented.");
    }
    
    init(): void {
        throw new Error("Method not implemented.");
    }

    
}