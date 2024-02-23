# Louis-Quentin Lecoq - Portfolio Website 🌐

Welcome to the source code repository for [louis-quentin-lecoq.com](https://louis-quentin-lecoq.com). This portfolio website showcases my professional journey, skills, and projects as a software engineer. 🚀 The site is a creative playground demonstrating the fusion of JavaScript and Rust with WebAssembly in real-time performance experiments through an immersive particle animation feature.

## Interactive Particle Animation: A Live Performance Lab 🔥

The Particle animation (inspired by [ParticleJs](https://vincentgarreau.com/particles.js/) with my own twist) is coded from scratch.

- **Experiment with Particle Dynamics**: The animation allows you to adjust parameters like particle count in real-time. See how the system's performance varies with different load scenarios.
- **Technology Switching in Action**: Seamlessly switch between JavaScript and Rust/WebAssembly implementations. Both use the same logic, providing a direct comparison of their performance capabilities under identical algorithmic conditions.
- **Web Workers Usage**: Discover the impact of adding or removing web workers. Start with zero workers and incrementally increase, observing how the performance scales with JavaScript and how it further enhances with Rust.
- **Live Performance Metrics**: The FPS counter provides immediate feedback on your adjustments, offering tangible insights into the computational efficiency of JS vs. Rust & WASM.

## Technologies Used 🛠️

This project incorporates several modern web technologies:

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) 📄
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) 🎨
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) ⚙️
- [Rust](https://www.rust-lang.org/) 🦀
- [WebAssembly](https://webassembly.org/) with [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/) 🔩
- [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) 🎨

## Installation 💻

To clone and run this project locally, you'll need [Git](https://git-scm.com) installed on your machine. From your command line:

```bash
# Clone this repository
git clone https://gitlab.com/llecoq/louis-quentin-lecoq.com.git

# Go into the repository
cd louis-quentin-lecoq.com
```

## Project Scripts

- **Dev Setup**
  ```bash
  npm run dev
  ```
  Sets up, builds for development, including WebAssembly and start development server.

- **Start Development Server**
  ```bash
  npm run start:dev
  ```
  Launches the Webpack development server.

- **Start Production Server**
  ```bash
  npm run start:prod
  ```
  Builds and starts the server in production mode.

- **Build WebAssembly**
  ```bash
  npm run build:wasm
  ```
  Compiles Rust code into WebAssembly.

- **Webpack Production Build**
  ```bash
  npm run build:webpack
  ```
  Creates a production-ready build using Webpack.

- **Run All Linters**
  ```bash
  npm run lint:all
  ```
  Executes JavaScript, CSS, and HTML linters sequentially.

- **Individual Linters**
  ```bash
  npm run lint:js
  npm run lint:css
  npm run lint:html
  ```
  For linting individual file types (replace `js`, `css`, `html` with the desired type).

## Contribution 🤝

Contributions are always welcome, whether for bug fixes, feature enhancements, or new feature ideas. Feel free to open an issue or a pull request.

## License 📝

Coming soon...

## Contact 📫

Louis-Quentin Lecoq - lecoqlq@gmail.com

Project Link: [https://gitlab.com/llecoq/louis-quentin-lecoq.com](https://gitlab.com/llecoq/louis-quentin-lecoq.com)
