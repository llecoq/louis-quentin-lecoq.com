import { initNavbar } from "./components/header.js";
import { initHome, adjustHomeSize } from "./sections/home.js";
import { particles } from "./components/particles/particles.js";

export default class MyApp {

    particlesWASM
    particlesJS
    useWASM

    constructor() {
        this.useWASM = true;
        document.getElementById("animation-toggle-switch").addEventListener("change", this.toggleAnimation.bind(this));
    }
    
    toggleAnimation() {
        if (this.useWASM === true) {
            this.useWASM = false;
            // this.wasmAnimation.stop();
            // this.jsAnimation.start();
            console.log('JS anim')
        } else {
            this.useWASM = true;
            // this.jsAnimation.stop();
            // this.wasmAnimation.start();
            console.log('WASM anim')
        }
    }
    
    start() {
        initNavbar();
        initHome();
        adjustHomeSize();
        particles();
    }
}