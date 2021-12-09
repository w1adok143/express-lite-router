# express-lite-router
Express router wrapper for backend, use Async/Await method in controller, use webhook 'init' if need

## Installation
```bash
npm install express-lite-router
```

## Creating controller
```js
import { Request, Response } from 'express';

/**
 * @class HomeController
 */
export default class HomeController {
    private request: Request;
    private response: Response;
    
    /**
     * Init
     * 
     * @param request 
     * @param response 
     */
    constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }
    
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
        return this.response.status(200).json({
            success: true,
            data: {
                message: 'Hello world'
            }
        });
    }
}
```

## Creating router
```js
import express, { Application } from 'express';
import { Router } from 'express-lite-router';

const router = Router({
  router: express.Router(),
  dir?: 'src',
  prefix?: '',
  ext?: '.ts' 
});
router.get('/', 'HomeController@index');
const app: Application = express();
app.use(router.init());
```
