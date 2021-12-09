# express-lite-router
Express router based on laravel router.

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
import express from 'express';
import { Router } from 'express-lite-router';

const router = Router({
  router: express.Router(),
});
router.get('/', 'HomeController@index');
const app = express();
app.use(router.init());
