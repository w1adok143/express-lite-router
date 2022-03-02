import { Router as Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Type
type Context = Record<string, any>;
type Dir = string;
type Callback = (request: Request, response: Response, next?: NextFunction) => void;
type Path = string;
type Action = string;
type Message = Record<string, string>;

// IConfig
interface Config {
    router: Express, dir: Dir, context?: Context
}

// Exception
class ApiError extends Error {
    public status;
    public code;

    /**
     * ApiError constructor
     *
     * @param message
     * @param status
     * @param code
     */
    constructor(message: string, status: number = 400, code: number | string = 0) {
        super(message);

        this.status = status;
        this.code = code;
    }
}

// Parent
abstract class Base {
    private context: Context;

    /**
     * Inject
     *
     * @param context
     */
    public $inject(context: Context) {
        this.context = context;
    }

    /**
     * Create instance by class
     *
     * @param model
     * @param params
     */
    protected async $create<T extends Model, A extends Array<any>>(model: {new (...params: [...A]): T}, ...params: [...A]) {
        const obj = new model(...params);

        if ('$inject' in obj) {
            obj.$inject(this.$context);
        }

        if ('init' in obj) {
            // @ts-ignore
            await obj.init();
        }

        return obj;
    }

    /**
     * Get text by lang
     *
     * @param message
     */
    protected $l(message: Message) {

        if (!this.$lang) {
            throw new ApiError(`Not found 'lang' in request`);
        }

        if (!message.hasOwnProperty(this.$lang)) {
            throw new ApiError(`Not found '${this.$lang}' in ${JSON.stringify(message)}`);
        }

        return message[this.$lang];
    }

    /**
     * Get context
     */
    protected get $context() {
        return this.context;
    }

    /**
     * Get lang
     */
    protected get $lang(): undefined | string {
        return this.$context.request.body.lang;
    }
}

// Base model
abstract class Model extends Base {

}

// Base controller
abstract class Controller extends Base {

    /**
     * Get request
     */
    protected get $request(): Request {
        return this.$context.request;
    }

    /**
     * Get response
     */
    protected get $response(): Response {
        return this.$context.response;
    }

    /**
     * Success response
     *
     * @param data
     * @param status
     */
    protected success(data = {}, status: number = 200) {
        return this.$response.status(status).json({
            success: true,
            data
        });
    }

    /**
     * Error response
     *
     * @param err
     */
    protected error(err: ApiError) {
        return this.$response.status(err.status || 400).json({
            success: false,
            error: {
                message: err.message,
                code: err.code || 0
            }
        });
    }
}

// Router
class Router {
    private readonly router;
    private readonly dir;
    private readonly context;
    
    /**
     * Router constructor
     * 
     * @param router
     * @param dir
     * @param context
     */
    constructor(router: Express, dir: Dir, context?: Context) {
        this.router = router;
        this.dir = dir;
        this.context = context;
    }

    /**
     * Get express router
     */
    public express() {
        return this.router;
    }

    /**
     * Use express middleware
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
    public get(path: Path, action: Action) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if (!(method in obj)) {
                throw new Error(`Not found '${method}' in ${file}`);
            }

            if (!('$inject' in obj)) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                ...this.context, request, response
            });

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
    public post(path: Path, action: Action) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.post(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if (!(method in obj)) {
                throw new Error(`Not found '${method}' in ${file}`);
            }

            if (!('$inject' in obj)) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                ...this.context, request, response
            });

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
    public put(path: Path, action: Action) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.put(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if (!(method in obj)) {
                throw new Error(`Not found '${method}' in ${file}`);
            }

            if (!('$inject' in obj)) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                ...this.context, request, response
            });

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
    public patch(path: Path, action: Action) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.patch(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if (!(method in obj)) {
                throw new Error(`Not found '${method}' in ${file}`);
            }

            if (!('$inject' in obj)) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                ...this.context, request, response
            });

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
    public delete(path: Path, action: Action) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.delete(path, async (request: Request, response: Response) => {
            const Class = require(file).default;
            const obj = new Class();

            if (!(method in obj)) {
                throw new Error(`Not found '${method}' in ${file}`);
            }

            if (!('$inject' in obj)) {
                throw new Error(`Not found '$inject'`);
            }

            obj.$inject({
                ...this.context, request, response
            });

            if ('init' in obj) {
                await obj.init();
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

// Router instance
const r = (config: Config): Router => new Router(config.router, config.dir, config.context);

export {
    r as Router, Controller, Model, ApiError
};