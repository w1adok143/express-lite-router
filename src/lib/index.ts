import {Router as Express, Request, Response, NextFunction} from "express";
import path from "path";
import fs from "fs";

namespace router {
    export type Context = Record<string, any>;
    export type Callback = (request: Request, response: Response, next?: NextFunction) => void;
    export interface Config {
        router: Express,
        dir: string,
        context?: Context
    }
}

class ApiError extends Error {
    public status;
    public code;

    public constructor(message: string, status: number = 400, code: number | string = 0) {
        super(message);

        this.status = status;
        this.code = code;
    }
}

abstract class Base {
    private context: router.Context;

    public $inject(context: router.Context) {
        this.context = context;
    }

    protected async $create<T extends Model | Record<string, any>, A extends Array<any>>(model: {new (...params: [...A]): T}, ...params: [...A]) {
        const obj = new model(...params);

        if ('$inject' in obj) {
            obj.$inject(this.$context);
        }
        if ('init' in obj) {
            await obj.init();
        }

        return obj;
    }

    protected $l(message: Record<string, string>) {
        if (!message.hasOwnProperty(this.$lang)) {
            throw new ApiError(`Not found '${this.$lang}' in ${JSON.stringify(message)}`);
        }

        return message[this.$lang];
    }

    protected get $context() {
        return this.context;
    }

    protected get $lang(): string {
        return this.$context.request.query.lang || this.$context.request.body.lang || 'en';
    }
}

abstract class Model extends Base {

}

abstract class Controller extends Base {
    protected get request(): Request {
        return this.$context.request;
    }

    protected get response(): Response {
        return this.$context.response;
    }

    protected success(data = {}, status: number = 200) {
        return this.response.status(status).json({
            success: true,
            data
        });
    }

    protected error(err: ApiError) {
        return this.response.status(err.status || 400).json({
            success: false,
            error: {
                message: err.message,
                code: err.code || 0
            }
        });
    }
}

class Router {
    private readonly router;
    private readonly dir;
    private readonly context;

    public constructor(config: router.Config) {
        this.router = config.router;
        this.dir = config.dir;
        this.context = config.context || {};
    }

    public express() {
        return this.router;
    }

    public use(callback: router.Callback) {
        this.router.use(callback);
    }

    public get(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.get(path, async (request: Request, response: Response, next: NextFunction) => {
            const Class = require(file).default;
            const obj = new Class();

            try {
                if (!(method in obj)) {
                    throw new Error(`Not found '${method}' in ${file}`);
                }
                if (!('$inject' in obj)) {
                    throw new Error(`Not found '$inject'`);
                }

                obj.$inject({...this.context, request, response});

                if ('init' in obj) {
                    await obj.init();
                }

                await obj[method]();
            } catch (e) {
                next(e);
            }
        });
    };

    public post(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.post(path, async (request: Request, response: Response, next: NextFunction) => {
            const Class = require(file).default;
            const obj = new Class();

            try {
                if (!(method in obj)) {
                    throw new Error(`Not found '${method}' in ${file}`);
                }
                if (!('$inject' in obj)) {
                    throw new Error(`Not found '$inject'`);
                }

                obj.$inject({...this.context, request, response});

                if ('init' in obj) {
                    await obj.init();
                }

                await obj[method]();
            } catch (e) {
                next(e);
            }
        });
    }

    public put(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.put(path, async (request: Request, response: Response, next: NextFunction) => {
            const Class = require(file).default;
            const obj = new Class();

            try {
                if (!(method in obj)) {
                    throw new Error(`Not found '${method}' in ${file}`);
                }
                if (!('$inject' in obj)) {
                    throw new Error(`Not found '$inject'`);
                }

                obj.$inject({...this.context, request, response});

                if ('init' in obj) {
                    await obj.init();
                }

                await obj[method]();
            } catch (e) {
                next(e);
            }
        });
    };

    public patch(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.patch(path, async (request: Request, response: Response, next: NextFunction) => {
            const Class = require(file).default;
            const obj = new Class();

            try {
                if (!(method in obj)) {
                    throw new Error(`Not found '${method}' in ${file}`);
                }
                if (!('$inject' in obj)) {
                    throw new Error(`Not found '$inject'`);
                }

                obj.$inject({...this.context, request, response});

                if ('init' in obj) {
                    await obj.init();
                }

                await obj[method]();
            } catch (e) {
                next(e);
            }
        });
    };

    public delete(path: string, action: string) {
        const [controller, method] = action.split('@');
        const file = this.getFile(controller);

        this.router.delete(path, async (request: Request, response: Response, next: NextFunction) => {
            const Class = require(file).default;
            const obj = new Class();

            try {
                if (!(method in obj)) {
                    throw new Error(`Not found '${method}' in ${file}`);
                }
                if (!('$inject' in obj)) {
                    throw new Error(`Not found '$inject'`);
                }

                obj.$inject({...this.context, request, response});

                if ('init' in obj) {
                    await obj.init();
                }

                await obj[method]();
            } catch (e) {
                next(e);
            }
        });
    };

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

const r = (config: router.Config): Router => new Router(config);

export {
    r as Router, Controller, Model, ApiError
};