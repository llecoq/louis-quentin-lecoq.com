export default class CanvasManager {

    canvas
    ctx
    height
    width


    constructor(canvas) {
        this.canvas = document.querySelector("canvas");
        this.ctx = canvas.getContext('2d');
        this.height = document.body.clientHeight;
        this.width = document.body.clientWidth;

        // Other properties
    }

    // Methods for canvas-related operations
    clearCanvas() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    resizeCanvas() {
        // Handle canvas resizing
    }

    getCtx() {
        return this.ctx;
    }

    lighterMode() {
        ctx.globalCompositeOperation = 'lighter';
    }

    sourceOverMode() {
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
    }

    // ...other methods
}