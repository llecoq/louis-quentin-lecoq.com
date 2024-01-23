use std::{rc::Rc, cell::RefCell};
use wasm_bindgen::prelude::*;

use crate::particles::{Opts, get_opts_from_js};
use super::{particle::Particle, Canvas};

#[wasm_bindgen]
#[derive(Clone)]
pub struct ParticlesManagerWASM {
    opts: Opts,
    particles: Rc<RefCell<Vec<Particle>>>,
    neighbors_matrix: Vec<Vec<(usize, f32)>>,
    canvas: Canvas
}

#[wasm_bindgen]
impl ParticlesManagerWASM {

    // Initialize particles, following the opts from the JS side
    pub fn init(&mut self) {
        {
            let number_of_particles = self.opts.number_of_particles;
            let mut particles = self.particles.borrow_mut();
            
            for _ in 0..number_of_particles {
                particles.push(
                    Particle::new(
                        self.canvas.height, 
                        self.canvas.width, 
                        self.opts.particle_min_size, 
                        self.opts.particle_max_size
                    )
                );
            }
            
            // Sort particles from smallest to biggest
            particles.sort_unstable_by(|a, b| {
                a.size
                .partial_cmp(&b.size)
                .expect("Sort particles failed")
            });
        }

        // Sort neighbors from closest to farthest
        self.sort_neighbors();
    }

    // Returns a pointer on the particles
    pub fn get_particles_ptr(&self) -> *const Particle {
        self.particles.borrow().as_ptr()
    }

    // Update positions of each particles
    pub fn update(&mut self, scale_fps: f32) {
        let mut particles = self.particles.borrow_mut();

        for elem in particles.iter_mut() {
            elem.update_position(self.canvas.height, self.canvas.width, scale_fps);
        }
    }

    // Sort Neighbors of each `Particles` from the closest to the farthest
    pub fn sort_neighbors(&mut self) {
        // Update distances between each `Particle` in the `neighbors_matrix`
        self.update_matrix_neighbors_distances();

        // Sort distances for each `Particle` in the `neighbors_matrix`
        for i in 0..self.opts.number_of_particles {
            self.neighbors_matrix[i].sort_unstable_by(|a, b| {
                a.1
                    .partial_cmp(&b.1)
                    .expect("Sort ditance for each `Particle` in the neighbors_matrix failed.")
            });
       
            // Set 10 first neighbors for each `Particle`
            let mut particles = self.particles.borrow_mut();

            for j in 0..10 {
                particles[i].set_neighbor(j + 1, self.neighbors_matrix[i][j + 1].0);
            }
        }
    }
}

impl ParticlesManagerWASM {
    // Create a new ParticlesManagerWASM and get the animation options from the JS side
    pub fn new(canvas_height: u32, canvas_width: u32) -> ParticlesManagerWASM {
        // Sets a custom panic hook to output Rust panics to the JavaScript console.
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
        // Initializes console logging for WebAssembly, enabling Rust log output in the browser's console.
        console_log::init().unwrap();

        // Get the animation options from the JS side
        let js_opts: Opts = get_opts_from_js().unwrap();
        let number_of_particles = js_opts.number_of_particles;

        ParticlesManagerWASM {
            opts: js_opts,
            particles: Rc::new(RefCell::new(vec![])),
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

    // Returns the clone of a pointer on the particles vector
    pub fn get_particles_ref(&self) -> Rc<RefCell<Vec<Particle>>> {
        self.particles.clone()
    }

    // Update distance between each `Particle` in the `neighbors_matrix`
    fn update_matrix_neighbors_distances(&mut self) {
        let particles = self.particles.borrow();

        for i in 0..self.opts.number_of_particles {
            for j in 0..self.opts.number_of_particles {
                self.neighbors_matrix[i][j].0 = j;
                let distance =  particles[i].get_distance_from(&particles[j]);
                self.neighbors_matrix[i][j].1 = distance;
            }
        }
    }
}