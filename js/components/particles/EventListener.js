export default class EventListener {

    worker
    canvas
    useWASM

    constructor(worker) {
        this.worker = worker;
        
        this.canvas = document.querySelector('canvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
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
        this.worker.postMessage({
            type: 'updateMousePosition',
            x: e.clientX,
            y: e.clientY
        });
    }

    handleMouseEnter() {
        this.worker.postMessage({
            type: 'setMouseIsOverCanvas',
            value: true,
        });
    }

    handleMouseLeave() {
        this.worker.postMessage({
            type: 'setMouseIsOverCanvas',
            value: false,
        });
    }

    handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    handleIntersectionChange(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.startAnimation();
            } else {
                this.stopAnimation();
            }
        });
    }

    toggleAnimation() {
        this.worker.postMessage({
            type: 'changeAnimationMode',
        });   
    }

    startAnimation() {
        this.worker.postMessage({
            type: 'start',
        });       
    }

    stopAnimation() {
        this.worker.postMessage({
            type: 'stop',
        });       
    }
}