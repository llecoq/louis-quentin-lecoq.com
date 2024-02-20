// TextScramble class for text scrambling animation
const SCRAMBLING_CHANCES = 0.6; // Probability of each character scrambling per frame
const BASE_DURATION = 200; // Base duration of the animation for a short text
const TIME_PER_CHAR = 25; // Added time per char

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const animationDuration = BASE_DURATION + (length * TIME_PER_CHAR);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * animationDuration);
            const end = start + Math.floor(Math.random() * animationDuration);
            this.queue.push({ from, to, start, end, char: '' });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frameRequest = requestAnimationFrame(this.update);
        return promise;
    }

    update(time) {
        if (!this.startTime) this.startTime = time;

        let output = '';
        let complete = 0;
        let progress = time - this.startTime;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (progress > end) {
                complete++;
                output += to;
            } else if (progress > start) {
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

        if (complete === this.queue.length) this.resolve();
        else this.frameRequest = requestAnimationFrame(this.update);
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Chain animations on multiple elements
function chainAnimations(elements, texts) {
    let promise = Promise.resolve();

    elements.forEach((el, index) => {
        promise = promise.then(() => {
            const scrambler = new TextScramble(el);
            return scrambler.setText(texts[index]);
        });

        // Adding a delay after specific animations
        if (index === 0 || index === 2) {
            promise = promise.then(() => new Promise(resolve => setTimeout(resolve, 300)));
        }
    });

    return promise;
}

// Animation elements and texts
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

// Animate the home content
export function animateHomeContent() {
    chainAnimations(elements, texts).then(() => {
        const button = document.getElementById('about-button');
        button.style.opacity = '1';

        const workingAtElement = document.getElementById('working-at');
        workingAtElement.classList.add('visible');

        // Execute the following code after the end of the animations
        const navbarItems = document.querySelectorAll('.navbar-item');
        navbarItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('navbar-item-visible');
            }, index * 200);
        });
    });
}