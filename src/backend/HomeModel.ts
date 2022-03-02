import { Model } from '../lib';
import { Pool } from 'mariadb';

export default class BookModel extends Model {
    private readonly id;

    /**
     * BookModel constructor
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