import { initNavbar } from "./components/header.js";
import { initHome, adjustHomeSize } from "./sections/home.js";
import { particles } from "./components/particles/particles.js";

export default class MyApp {

    particlesWASM
    particlesJS

    constructor() {
        initNavbar();
        initHome();
        adjustHomeSize();
        particles();
    }

    start() {

    }
}