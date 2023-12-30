export default class EventListener {

    animationControllerJS
    animationControllerWASM
    canvas

    constructor(canvas, animationControllerJS, animationControllerWASM) {
        this.animationControllerJS = animationControllerJS;
        this.animationControllerWASM = animationControllerWASM;
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
    }

    handleMouseMove(e) {
        this.animationControllerJS.updateMousePosition(e.clientX, e.clientY);
    }

    handleMouseEnter() {
        this.animationControllerJS.setMouseIsOverCanvas(true);
    }

    handleMouseLeave() {
        this.animationControllerJS.setMouseIsOverCanvas(false);
    }

    handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            this.animationControllerJS.start();
        } else {
            this.animationControllerJS.stop();
        }
    }

    handleIntersectionChange(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animationControllerJS.start();
            } else {
                this.animationControllerJS.stop();
            }
        });
    }
}