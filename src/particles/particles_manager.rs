use wasm_bindgen::prelude::*;

use crate::particles::{Opts, get_opts_from_js};
use super::{particle::Particle, Canvas};

#[wasm_bindgen]
pub struct ParticlesManagerWASM {
    opts: Opts,
    particles: Vec<Particle>,
    neighbors_matrix: Vec<Vec<(usize, f32)>>,
    canvas: Canvas
}

#[wasm_bindgen]
impl ParticlesManagerWASM {
    pub fn memory(&self) -> JsValue {
        wasm_bindgen::memory()
    }

    // Create a new ParticlesManagerWASM and get the animation options from the JS side
    pub fn new(canvas_height: u32, canvas_width: u32) -> ParticlesManagerWASM {
        // Init console.log and panic_hook
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
        console_log::init().unwrap();

        let js_opts: Opts = get_opts_from_js().unwrap();
        let number_of_particles = js_opts.number_of_particles;

        ParticlesManagerWASM {
            opts: js_opts,
            particles: vec![],
            neighbors_matrix: vec![
                vec![
                    (0, 0.0); 
                    number_of_particles as usize
                ]; 
                number_of_particles as usize
            ],
            canvas: Canvas{
                height: canvas_height,
                width: canvas_width
            }
        }
    }

    // Initialize particles, following the opts from the JS side
    pub fn init(&mut self) {
        let number_of_particles = self.opts.number_of_particles;

        for _ in 0..number_of_particles {
            self.particles.push(
                Particle::new(
                    self.canvas.height, 
                    self.canvas.width, 
                    self.opts.particle_min_size, 
                    self.opts.particle_max_size
                )
            );
        }

        // Sort particles from smallest to biggest
        self.particles.sort_unstable_by(|a, b| a.size.partial_cmp(&b.size).unwrap());
    }

    // Returns a pointer on the particles
    pub fn get_particles_ptr(&self) -> *const Particle {
        self.particles.as_ptr()
    }

    // Update positions of each particles
    pub fn update(&mut self, scale_fps: f32) {
        for elem in &mut self.particles {
            elem.update_position(self.canvas.height, self.canvas.width, scale_fps);
        }
    }

    pub fn sort_neighbors(&mut self) {
        // Update distances between each `Particle` in the `neighbors_matrix`
        self.update_matrix_neighbors_distances();

        // Sort distances for each `Particle` in the `neighbors_matrix`
        for i in 0..self.opts.number_of_particles {
            self.neighbors_matrix[i].sort_unstable_by(|a, b| a.1.partial_cmp(&b.1).unwrap());
       
            // Set 10 first neighbors for each `Particle`
            for j in 0..10 {
                self.particles[i].set_neighbor(j, self.neighbors_matrix[i][j + 1].0);
            }
        }
    }

    // Update distance between each `Particle` in the `neighbors_matrix`
    fn update_matrix_neighbors_distances(&mut self) {
        for i in 0..self.opts.number_of_particles {
            for j in 0..self.opts.number_of_particles {
                    self.neighbors_matrix[i][j].0 = j;
                    let distance =  self.particles[i].get_distance_from(&self.particles[j]);
                    self.neighbors_matrix[i][j].1 = distance;
            }
        }
    }
}