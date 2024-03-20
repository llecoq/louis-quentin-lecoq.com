import { opts } from "./opts.js";

export default class EventListener {

    worker
    canvas
    animationMode

    constructor(worker) {
        this.worker = worker;
        this.animationMode = "WASM";
        
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
   
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
        this.worker.postMessage({ 
          type: 'resizeCanvas', 
          width: window.innerWidth, 
          height: window.innerHeight, 
        });
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

        const rustWasmSpan = document.getElementById("rust-wasm-toggle");
        const jsSpan = document.getElementById("js-toggle");

        if (this.animationMode === "WASM") {
            this.animationMode = "JS";
            rustWasmSpan.style.color = opts.PARTICLE_COLOR_2;
            jsSpan.style.color = opts.PARTICLE_COLOR_4;
        } else {
            this.animationMode = "WASM";
            rustWasmSpan.style.color = opts.PARTICLE_COLOR_4;
            jsSpan.style.color = opts.PARTICLE_COLOR_2;
        }
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