import { Controller } from '../lib';

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
                message: 'Hello world'
            }
        });
    }
}