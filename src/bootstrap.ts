import express, { Application } from 'express';
import mariadb from 'mariadb';
import { Router } from './lib';

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