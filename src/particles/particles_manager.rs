use wasm_bindgen::prelude::*;
use gloo_console::log;

use crate::particles::{Opts, get_opts_from_js};
use super::{particle::Particle, Canvas};

#[wasm_bindgen]
pub struct ParticlesManagerWASM {
    opts: Opts,
    particles: Vec<Particle>,
    canvas: Canvas
}

#[wasm_bindgen]
impl ParticlesManagerWASM {
    // Create a new ParticlesManagerWASM and get the animation options from the JS side
    pub fn new(canvas_height: u32, canvas_width: u32) -> ParticlesManagerWASM {
        ParticlesManagerWASM {
            opts: get_opts_from_js().unwrap(),
            particles: Vec::new(),
            canvas: Canvas{
                height: canvas_height,
                width: canvas_width
            }
        }
    }

    // Initialize particles, following the opts from the JS side
    pub fn init(&mut self) {
        for _ in 0..self.opts.number_of_particles {
            self.particles.push(Particle::new(self.canvas.height, self.canvas.width, self.opts.particle_min_size, self.opts.particle_max_size));
        }
    }
}