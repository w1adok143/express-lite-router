import {Controller} from "@/lib";
import Model from "@backend/Home/HomeModel";

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
            return this.success({rows: await this.model.select()});
        } catch (e) {
            return this.error(e);
        }
    }
}