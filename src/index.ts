import { Router as Express, Request, Response, NextFunction } from 'express';
import path from 'path';

/**
 * Types
 */
type Callback = (req: Request, res: Response, next?: NextFunction) => void;
type Config = {
    router: Express,
    dir?: string,
    prefix?: string,
    ext?: string
}

/**
 * Router for backend, wrapper express router
 */
class Router {
    private router;
    private dir;
    private prefix;
    private ext;

    /**
     * Init
     * 
     * @param router
     * @param dir
     * @param prefix
     * @param ext
     */
    constructor(router: Express, dir: string = 'src', prefix: string = '', ext: string = '.ts') {
        this.router = router;
        this.dir = dir;
        this.prefix = prefix;
        this.ext = ext;
    }

    /**
     * Return express router
     */
    public init(): Express {
        return this.router;
    }

    /**
     * Use middleware 
     * 
     * @param callback
     */
    public use(callback: Callback): void {
        this.router.use(callback);
    }

    /**
     * Get request
     * 
     * @param path
     * @param action
     */
    public get(path: string, action: string): void {
        path = this.prefix + path;
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (req: Request, res: Response) => {
            const Class = require(file).default;
            const obj = new Class(req, res);

            if ('init' in obj) {
                await obj.init();
            }

            await obj[method]();
        });
    };

    /**
     * Post request
     * 
     * @param path
     * @param action
     */
    public post(path: string, action: string): void {
        path = this.prefix + path;
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (req: Request, res: Response) => {
            const Class = require(file).default;
            const obj = new Class(req, res);

            if ('init' in obj) {
                await obj.init();
            }

            await obj[method]();
        });
    }

    /**
     * Put request
     * 
     * @param path
     * @param action
     */
    public put(path: string, action: string): void {
        path = this.prefix + path;
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (req: Request, res: Response) => {
            const Class = require(file).default;
            const obj = new Class(req, res);

            if ('init' in obj) {
                await obj.init();
            }

            await obj[method]();
        });
    };

    /**
     * Patch request
     * 
     * @param path
     * @param action
     */
    public patch(path: string, action: string): void {
        path = this.prefix + path;
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (req: Request, res: Response) => {
            const Class = require(file).default;
            const obj = new Class(req, res);

            if ('init' in obj) {
                await obj.init();
            }

            await obj[method]();
        });
    };

    /**
     * Delete request
     * 
     * @param path
     * @param action
     */
    public delete(path: string, action: string): void {
        path = this.prefix + path;
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (req: Request, res: Response) => {
            const Class = require(file).default;
            const obj = new Class(req, res);

            if ('init' in obj) {
                await obj.init();
            }

            await obj[method]();
        });
    };

    /**
     * Get path to file
     * 
     * @param controller
     */
    private getFile(controller: string): string {
        return path.resolve(this.dir, controller + this.ext);
    }
}

const router = (config: Config): Router => new Router(config.router, config.dir, config.prefix, config.ext);
export { router as Router };