use wasm_bindgen::prelude::*;
use gloo_console::log;

use crate::particles::get_opts;

use super::particle::Particle;

#[wasm_bindgen]
pub struct ParticlesManagerWASM {
    particles: Vec<Particle>,
}

#[wasm_bindgen]
impl ParticlesManagerWASM {
    pub fn new() -> ParticlesManagerWASM {
        ParticlesManagerWASM {
            particles: Vec::new(),
        }
    }
}