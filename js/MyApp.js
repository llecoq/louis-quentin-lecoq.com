import { initNavbar } from "./components/header.js";
import { initHome, adjustHomeSize } from "./sections/home.js";
import { Particles } from "./components/particles/particles.js";

export default class MyApp {

    particles

    constructor() {
        this.particles = new Particles();
    }
    
    start() {
        initNavbar();
        initHome();
        adjustHomeSize();
        this.particles.init();
    }
}