export default class EventListener {

    animationController
    canvas

    constructor(animationController, canvas) {
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
}