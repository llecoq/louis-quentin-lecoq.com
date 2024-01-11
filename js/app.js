import MyApp from './MyApp.js';
import init from "../pkg/louis_quentin_lecoq.js";

async function loadWasm() {
    await init();
}


document.addEventListener('DOMContentLoaded', () => {
    loadWasm().then(() => {
        const app = new MyApp();
        app.start();
    });
});
