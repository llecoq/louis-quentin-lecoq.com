import EventListener from './EventListener.js'
import { opts } from './opts.js'
export class Particles {

    eventListener
    worker

    particlesRangeSlider
    particlesNumberOutput
    workersRangeSlider
    workersNumberOutput    
    connectionDistanceRangeSlider
    connectionDistanceOutput    
    fpsOutput

    init() {
        document.body.style.height = "100vh";
        // Creation of an OffscreenCanvas
        const offscreen = document.querySelector('canvas').transferControlToOffscreen();
        // Transférer `offscreen` à votre Web Worker ici
        canvas.setAttribute('transferred', 'true');
        // Creation of a new module Worker
        this.worker = new Worker(new URL('./AnimationController.worker.js', import.meta.url), {
            type: 'module'
        });
        offscreen.height = document.body.clientHeight;
        offscreen.width = document.body.clientWidth;
        // Sending the context to the worker
        this.worker.postMessage({
            type: 'initAnimation',
            canvas: offscreen,
            numberOfParticles: this.getDynamicNumberOfParticles()
        }, [offscreen]);
    
        // EventListener
        this.eventListener = new EventListener(this.worker);
        this.eventListener.init();

        this.handleParticlesNumberRange();
        this.handleWorkersNumberRange();
        this.handleConnectionMaxDistanceRange();
        this.handleFpsCount();
    }

    handleFpsCount() {
        this.fpsOutput = document.getElementById("fps-count");

        this.worker.onmessage = (e) => {
            this.fpsOutput.innerHTML = e.data.fps;
        }
    }

    handleParticlesNumberRange() {
        this.particlesRangeSlider = document.getElementById("particles-number-range");
        this.particlesNumberOutput = document.getElementById("particles-number");
        this.particlesRangeSlider.value = this.getDynamicNumberOfParticles();
        this.particlesNumberOutput.innerHTML = this.particlesRangeSlider.value;

        this.particlesRangeSlider.oninput = () => {
            this.particlesNumberOutput.innerHTML = this.particlesRangeSlider.value;
            this.worker.postMessage({
                type: 'numberOfParticlesChange',
                numberOfParticles: this.particlesRangeSlider.value
            });
        };
    }

    handleWorkersNumberRange() {
        this.workersRangeSlider = document.getElementById("workers-number-range");
        this.workersNumberOutput = document.getElementById("workers-number");
        this.workersRangeSlider.value = opts.NUMBER_OF_WEB_WORKERS;
        this.workersNumberOutput.innerHTML = this.workersRangeSlider.value;
        this.workersRangeSlider.oninput = () => {
            this.workersNumberOutput.innerHTML = this.workersRangeSlider.value;
            this.worker.postMessage({
                type: 'numberOfWorkersChange',
                numberOfWorkers: this.workersRangeSlider.value
            });
        };
    }

    handleConnectionMaxDistanceRange() {
        this.connectionDistanceRangeSlider = document.getElementById("connection-max-distance-range");
        this.connectionDistanceOutput = document.getElementById("connection-max-distance");
        this.connectionDistanceRangeSlider.value = opts.CONNECTION_MAX_DIST;
        this.connectionDistanceOutput.innerHTML = this.connectionDistanceRangeSlider.value;
        this.connectionDistanceRangeSlider.oninput = () => {
            this.connectionDistanceOutput.innerHTML = this.connectionDistanceRangeSlider.value;
            this.worker.postMessage({
                type: 'connectionMaxDistChange',
                connectionMaxDist: this.connectionDistanceRangeSlider.value
            });
        };
    }

    getDynamicNumberOfParticles() {
        const screenArea = self.window.innerWidth * self.window.innerHeight;
        const minScreenArea = 320 * 568;
        const maxScreenArea = 1980 * 1080;
        const value = 100 + (screenArea - minScreenArea) * (650 / (maxScreenArea - minScreenArea));
        
        return Math.round(Math.min(Math.max(value, 100), 750));
    }
}
