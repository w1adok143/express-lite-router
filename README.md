# express-lite-router
Express router wrapper for backend, can use Async/Await method in controller, can use webhook 'init'

## Installation
```bash
npm install express-lite-router
```

## Creating controller
Must be extends from 'Controller' and will be available - this.$context(), this.$request(), this.$response()

```js
import { Controller } from 'express-lite-router';

export default class HomeController extends Controller {
    
    /**
     * Webhook
     */
    public init() {
        console.log("Hello i'm webhook");
    }

    /**
     * Index
     */
    public index() {
        return this.$response().status(200).json({
            success: true,
            data: {
                message: 'Hello World!'
            }
        });
    }
}
```

## Creating router

```js
import express, { Application } from 'express';
import { Router } from 'express-lite-router';
import mariadb from 'mariadb';

// Express router wrapper
const router = Router({

    // Express router
    router: express.Router(), 

    // Path, where controllers stored
    dir: 'src/backend', 

    // Dependencies for controller. To get dependencies, need call 'this.$context()' in controller
    context?: {
        pool: mariadb.createPool({ host: 'mydb.com', user:'myUser', password: 'myPassword' })
    }
});

router.get('/', 'HomeController@index');

const app: Application = express();
app.use(router.init());
app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`));
```