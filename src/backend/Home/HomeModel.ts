import {Model} from "@/lib";
import {Pool} from "mariadb";

export default class HomeModel extends Model {
    private readonly id;

    public constructor(id: number) {
        super();

        this.id = id;
    }

    public async init() {
        console.log("Hello, I'm a webhook");
    }

    public async select() {
        return await this.pool.query(`SELECT ${this.id} as val`);
    }

    private get pool(): Pool {
        return this.$context.pool;
    }
}