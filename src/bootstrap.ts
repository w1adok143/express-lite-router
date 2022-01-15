import express, { Application } from 'express';
import { Router } from './lib';

const router = Router({
    router: express.Router(), dir: 'src/backend'
});

router.get('/', 'HomeController@index');

const app: Application = express();
app.use(router.init());
app.listen(3000, () => console.log('Development server http://localhost:3000 started'));