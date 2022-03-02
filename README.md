# express-lite-router

## Installation
```bash
npm i express-lite-router
```
## Usage

```js
import express, { Application } from 'express';
import mariadb from 'mariadb';
import { Router } from 'express-lite-router';

const router = Router({
    router: express.Router(),
    dir: 'src/backend',
    context: {
        pool: mariadb.createPool({
            host: 'mydb.com',
            user: 'myUser',
            password: 'myPassword',
            connectionLimit: 5
        })
    }
});

router.get('/', 'HomeController@index');

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router.express());
app.listen(3000, () => console.log('Development server http://localhost:3000 started'));
```

## Creating controller
Your controller must be extended from 'Controller'

```js
import { Controller } from 'express-lite-router';
import Model from './HomeModel';

export default class HomeController extends Controller {
    private model: Model;

    /**
     * Webhook
     */
    public async init() {
        this.model = await this.$create(Model, 1);
    }

    /**
     * Index
     */
    public async index() {
        try {
            return this.success({ rows: await this.model.select() });
        } catch (err) {
            return this.error(err);
        }
    }
}
```
## Creating Model
Your model must be extended from 'Model'

```js
import { Model } from 'express-lite-router';
import { Pool } from 'mariadb';

export default class HomeModel extends Model {
    private id;

    /**
     * HomeModel constructor
     *
     * @param id
     */
    public constructor(id: number) {
        super();

        this.id = id;
    }

    /**
     * Webhook
     */
    public async init() {
        console.log("Hello, I'm a webhook");
    }

    /**
     * Select
     */
    public async select() {
        return await this.pool.query(`SELECT ${this.id} as val`);
    }

    /**
     * Get pool
     */
    private get pool(): Pool {
        return this.$context.pool;
    }
}
```

## Set 'lang' app
```js
{
    lang: "en"
}

console.log(this.$lang); // 'en'
```

## Can use '$request'

```js
console.log(this.$request); // express Request
```

## Can use '$response'

```js
this.$response; // express Response
```

## Can use '$context'

```js
const router = Router({
    context: {
        pool: mariadb.createPool({
            host: 'mydb.com',
            user: 'myUser',
            password: 'myPassword',
            connectionLimit: 5
        })
    }
});

console.log(this.$context); // { pool, request, response }
```

## Can use '$lang'

```js
console.log(this.$lang); // 'en'
```

## Can use '$l(message)'

```js
console.log(this.$l({"en":"Not found", "ua":"Не знайдено"})); // 'Not found'
```

## Can use '$create(Class, ...params)'

```js
this.model = await this.$create(Model, 1);
```

## Can use 'success(data? = {}, status? = 200)'

```js
try {
    return this.success(); // json
} catch (err) {
    
}
```

## Can use 'error(err)'

```js
try {
    
} catch (err) {
    return this.error(err); // json
}

```
## Can use 'ApiError(message, status? = 400, code? = 0)'

```js
try {
    throw new ApiError('Not found', 404);
} catch (err) {
    return this.error(err); // json
}
```