import { initNavbar } from "./components/header.js";
import { initHome, adjustHomeSize } from "./sections/home.js";
import { particles } from "./components/particles/particles.js";

export default class MyApp {

    particlesWASM
    particlesJS
    useWASM

    constructor() {
        this.useWASM = true;
    }
    
    toggleAnimation(value) {
        this.useWASM = value;
        if (this.useWASM === true) {
            this.jsAnimation.stop();
            this.wasmAnimation.start();
        } else {
            this.wasmAnimation.stop();
            this.jsAnimation.start();
        }
    }
    
    start() {
        initNavbar();
        initHome();
        adjustHomeSize();
        particles();
    }
}