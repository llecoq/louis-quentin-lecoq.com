// Functions to adjust and initialize the home section
export function adjustHomeSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const element = document.getElementById('home');
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
}

export function initHome() {
    window.addEventListener('resize', adjustHomeSize);
}

const ANIMATION_SPEED = 25;
const SCRAMBLING_CHANCES = 0.6;

// TextScramble class for creating scrambling text animation
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.querySelector('span').innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * ANIMATION_SPEED);
            const end = start + Math.floor(Math.random() * ANIMATION_SPEED);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < SCRAMBLING_CHANCES) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }        

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Function to chain animations on elements
function chainAnimations(elements, texts) {
    let promise = Promise.resolve();

    elements.forEach((el, index) => {
        promise = promise.then(() => {
            const scrambler = new TextScramble(el);
            return scrambler.setText(texts[index]);
        });

        if (index === 0 || index === 2) {
            promise = promise.then(() => new Promise(resolve => setTimeout(resolve, 300)));
        }
    });

    return promise;
}

// Elements and texts for the animation
const elements = [
    document.getElementById('hello-world'),
    document.getElementById('my-name-is'),
    document.getElementById('louis-quentin-lecoq'),
    document.getElementById('i-m-a'),
    document.getElementById('software-engineer')
];
const texts = [
    "Hello world!",
    "My name is...",
    "Louis-Quentin Lecoq,",
    "I'm a",
    "Software Engineer."
];

// Execute the animations
chainAnimations(elements, texts).then(() => {
    const button = document.getElementById('about-button');
    button.style.opacity = '1';

    setTimeout(() => {
        button.classList.add('blink-animation');
    }, 1000);
});
