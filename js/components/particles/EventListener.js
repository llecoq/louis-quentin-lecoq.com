export default class EventListener {

    animationController
    canvas
    useWASM

    constructor(canvas, animationController) {
        this.animationController = animationController;
        this.canvas = canvas;
    }
    
    init() {
        // Add mouse's event listeners
        this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        this.canvas.addEventListener("mouseenter", () => this.handleMouseEnter());
        this.canvas.addEventListener("mouseleave", () => this.handleMouseLeave());
    
        // Handle visibility change (change of tab)
        document.addEventListener("visibilitychange", () => this.handleVisibilityChange());
    
        // Canvas Intersection Observer
        const observer = new IntersectionObserver((entries) => this.handleIntersectionChange(entries), { threshold: 0.0 });
        observer.observe(this.canvas);

        // Animation toggle switch
        document.getElementById("animation-toggle-switch").addEventListener("change", this.toggleAnimation.bind(this));
    }

    handleMouseMove(e) {
        this.animationController.updateMousePosition(e.clientX, e.clientY);
    }

    handleMouseEnter() {
        this.animationController.setMouseIsOverCanvas(true);
    }

    handleMouseLeave() {
        this.animationController.setMouseIsOverCanvas(false);
    }

    handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            this.animationController.start();
        } else {
            this.animationController.stop();
        }
    }

    handleIntersectionChange(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animationController.start();
            } else {
                this.animationController.stop();
            }
        });
    }

    toggleAnimation() {
        this.animationController.changeAnimationMode();
        // if (this.useWASM === true) {
        //     this.useWASM = false;
        //     // this.wasmAnimation.stop();
        //     // this.animationController.startAnimationWASM();
        //     this.animationController.start();
        //     console.log('JS anim')
        // } else {
        //     this.useWASM = true;
        //     this.animationController.stop();
        //     // this.wasmAnimation.start();
        //     console.log('WASM anim')
        // }
    }
}