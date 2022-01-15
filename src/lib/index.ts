import { Router as Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

interface Config {
    router: Express,
    dir: string,
    context?: Record<string, any>
}

type Callback = (request: Request, response: Response, next?: NextFunction) => void;

class Router {
    
    /**
     * Init
     * 
     * @param router 
     * @param dir 
     * @param context 
     */
    constructor(private router: Express, private dir: string, private context?: Record<string, any>) {
        this.router = router;
        this.dir = dir;
        this.context = context;
    }

    /**
     * Init express router
     */
    public init(): Express {
        return this.router;
    }

    /**
     * Use middleware 
     * 
     * @param callback
     */
    public use(callback: Callback) {
        this.router.use(callback);
    }

    /**
     * Get request
     * 
     * @param path
     * @param action
     */
    public get(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if ('$inject' in obj === false) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                request, response, ...this.context
            });

            if ('init' in obj) {
                await obj.init();
            }

            if (method in obj === false) {
                throw new Error(`Not found '${method}' in ${file}`);
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
    public post(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.post(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if ('$inject' in obj === false) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                request, response, ...this.context
            });

            if ('init' in obj) {
                await obj.init();
            }

            if (method in obj === false) {
                throw new Error(`Not found '${method}' in ${file}`);
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
    public put(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.put(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if ('$inject' in obj === false) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                request, response, ...this.context
            });

            if ('init' in obj) {
                await obj.init();
            }

            if (method in obj === false) {
                throw new Error(`Not found '${method}' in ${file}`);
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
    public patch(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.patch(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if ('$inject' in obj === false) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                request, response, ...this.context
            });

            if ('init' in obj) {
                await obj.init();
            }

            if (method in obj === false) {
                throw new Error(`Not found '${method}' in ${file}`);
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
    public delete(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.delete(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if ('$inject' in obj === false) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                request, response, ...this.context
            });

            if ('init' in obj) {
                await obj.init();
            }

            if (method in obj === false) {
                throw new Error(`Not found '${method}' in ${file}`);
            }

            await obj[method]();
        });
    };

    /**
     * Get path to controller
     * 
     * @param controller
     */
    private getFile(controller: string) {
        let _path = path.resolve(this.dir, controller + '.ts');

        if (fs.existsSync(_path)) {
            return _path;
        }

        _path = path.resolve(this.dir, controller + '.js');

        if (fs.existsSync(_path)) {
            return _path;
        }

        throw new Error(`Not found '${controller}' in ${path.resolve(this.dir)}`);
    }
}

abstract class Controller {

    /**
     * Context
     */
    private context!: Record<string, any>;

    /**
     * Inject context
     * 
     * @param context 
     */
    public $inject(context: Record<string, any>) {
        this.context = context;
    }

    /**
     * Get context
     */
    protected $context() {
        return this.context;
    }

    /**
     * Get request
     */
    protected $request(): Request {
        return this.context.request;
    }

    /**
     * Get response
     */
    protected $response(): Response {
        return this.context.response;
    }
}

/**
 * Instance of router class
 * 
 * @param config 
 */
const router = (config: Config): Router => new Router(config.router, config.dir, config.context);

export { router as Router, Controller };