import AnimationControllerJS from './objs/AnimationControllerJS.js'
import EventListenerJS from './objs/EventListenerJS.js'

export default class ParticlesJS {

    animationController
    eventListener

    constructor(ctx, canvas) {
        this.animationController = new AnimationControllerJS(ctx)
        this.eventListener = new EventListenerJS(this.animationController, canvas);
    }

    init() {
        this.animationController.init();
        this.eventListener.init();
    }
}