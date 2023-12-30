export default class EventListener {

    animationControllerJS
    animationControllerWASM
    canvas
    useWASM

    constructor(canvas, animationControllerJS, animationControllerWASM) {
        this.animationControllerJS = animationControllerJS;
        this.animationControllerWASM = animationControllerWASM;
        this.canvas = canvas;
        this.useWASM = true;
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
    }

    handleMouseMove(e) {
        const activeController = this.useWASM ? this.animationControllerWASM : this.animationControllerJS;

        activeController.updateMousePosition(e.clientX, e.clientY);
    }

    handleMouseEnter() {
        const activeController = this.useWASM ? this.animationControllerWASM : this.animationControllerJS;

        activeController.setMouseIsOverCanvas(true);
    }

    handleMouseLeave() {
        const activeController = this.useWASM ? this.animationControllerWASM : this.animationControllerJS;

        activeController.setMouseIsOverCanvas(false);
    }

    handleVisibilityChange() {
        const activeController = this.useWASM ? this.animationControllerWASM : this.animationControllerJS;

        if (document.visibilityState === "visible") {
            activeController.start();
        } else {
            activeController.stop();
        }
    }

    handleIntersectionChange(entries) {
        const activeController = this.useWASM ? this.animationControllerWASM : this.animationControllerJS;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeController.start();
            } else {
                activeController.stop();
            }
        });
    }

    setUseWASM(value) {
        this.useWASM = value;
    }
}