use std::{cell::RefCell, collections::HashSet, rc::Rc};
use wasm_bindgen::prelude::*;

use crate::particles::{connection::Connection, get_opts_from_js, Opts};
use super::{connections_manager::ConnectionsManagerWASM, particle::Particle, Canvas};

#[wasm_bindgen]
#[derive(Clone)]
pub struct ParticlesManagerWASM {
    opts: Opts,
    particles: Rc<RefCell<Vec<Particle>>>,
    neighbors_matrix: Vec<Vec<(usize, f32)>>,
    canvas: Canvas,
    number_of_particles: usize,
    connections_manager: ConnectionsManagerWASM,
    connection_max_dist: f32,
}

#[wasm_bindgen]
impl ParticlesManagerWASM {

    // Initialize particles, following the opts from the JS side
    pub fn init(&mut self) {
        {
            let max_number_of_particles = self.opts.max_number_of_particles;
            let mut particles: std::cell::RefMut<'_, Vec<Particle>> = self.particles.borrow_mut();
            
            for _ in 0..max_number_of_particles {
                particles.push(
                    Particle::new(
                        self.canvas.height, 
                        self.canvas.width, 
                        self.opts.particle_min_size, 
                        self.opts.particle_max_size,
                        self.opts.particle_active_size_scale
                    )
                );
            }
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

        for (particle_index, particle) in particles
            .iter_mut()
            .enumerate() {
            if particle_index < self.number_of_particles {
                particle.update_position(self.canvas.height, self.canvas.width, scale_fps);
            }
        }
    }

    pub fn create_connections(&mut self, mouse_is_over_canvas: bool, mouse_x: f32, mouse_y:f32) {
        self.connections_manager.clear_connections();

        let particles: &Vec<Particle> = &self.particles.borrow();

        for (particle_index, particle) in particles
            .iter()
            .enumerate() {
            if particle_index < self.number_of_particles {
                // Create connections between Particles
                for neighbor_number in 0..10 {
                    let neighbor_index: usize = self.get_neighbor_index(particle, neighbor_number);
                    let neighbor: &Particle = &particles[neighbor_index];
        
                    if !self.connections_manager.add_connection(
                        (particle, particle_index as f32),
                        (neighbor, neighbor_index as f32), 
                        &self.opts
                    ) {
                        break;
                    }
                }

                // Create connections between Particles and Mouse
                if mouse_is_over_canvas {
                    let dist_to_mouse = particle.get_distance_from(mouse_x, mouse_y);

                    if dist_to_mouse < self.connection_max_dist {
                        let mouse: Particle = Particle::new_mouse(mouse_x, mouse_y);

                        self.connections_manager.add_connection(
                            (particle, particle_index as f32), 
                            (&mouse.clone(), -1.0), 
                            &self.opts
                        );
                    }  
                }

            }
        }

        self.connections_manager.convert_hashset_to_vec();
    }

    pub fn get_connections_ptr(&mut self) -> *const Connection {
        self.connections_manager.get_connections_vec_ptr()
    }

    pub fn get_connections_len(&mut self) -> usize {
        self.connections_manager.get_vec_len()
    }

    pub fn resize_canvas(&mut self, width: u32, height: u32) {
        self.canvas.width = width;
        self.canvas.height = height;
    }

    // Sort Neighbors of each `Particles` from the closest to the farthest
    pub fn sort_neighbors(&mut self) {
        if self.number_of_particles < 2 {
            return;
        }
        // Update distances between each `Particle` in the `neighbors_matrix`
        self.update_matrix_neighbors_distances();

        // Sort distances for each `Particle` in the `neighbors_matrix`
        for i in 0..self.number_of_particles {
            self.neighbors_matrix[i].sort_unstable_by(|a, b| {
                a.1
                    .partial_cmp(&b.1)
                    .expect("Sort distance for each `Particle` in the neighbors_matrix failed.")
            });
       
            // Set 10 first neighbors for each `Particle`
            let mut particles = self.particles.borrow_mut();

            for j in 0..10 {
                if j > self.number_of_particles - 2 {
                    break;
                }
                particles[i].set_neighbor(j + 1, self.neighbors_matrix[i][j + 1].0);
            }
        }
    }

    pub fn change_number_of_particles(&mut self, new_number_of_particles: usize) {
        self.number_of_particles = new_number_of_particles;
    }

    pub fn set_connection_max_dist(&mut self, value: f32) {
        self.connection_max_dist = value;
        self.connections_manager.set_connection_max_dist(value);
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
        let max_number_of_particles: usize = js_opts.max_number_of_particles;
        let connection_max_dist = js_opts.connection_max_dist;

        ParticlesManagerWASM {
            opts: js_opts,
            particles: Rc::new(RefCell::new(vec![])),
            neighbors_matrix: vec![
                vec![
                    (0, 0.0); 
                    max_number_of_particles
                ]; 
                max_number_of_particles
            ],
            canvas: Canvas{
                height: canvas_height,
                width: canvas_width
            },
            number_of_particles,
            connections_manager: ConnectionsManagerWASM {
                connections_set: HashSet::with_capacity(10000),
                connections_vec: vec![
                    Connection {
                        particles: (0.0, 0.0),
                        global_alpha: 0.0,
                        x: 0.0,
                        y: 0.0,
                        neighbor_x: 0.0,
                        neighbor_y: 0.0
                    };
                    10000
                ],
                connection_max_dist
            },
            connection_max_dist
        }
    }

    // Returns the clone of a pointer on the particles vector 
    pub fn get_particles_ref(&self) -> Rc<RefCell<Vec<Particle>>> {
        self.particles.clone()
    }

    // Update distance between each `Particle` in the `neighbors_matrix`
    fn update_matrix_neighbors_distances(&mut self) {
        let particles: std::cell::Ref<'_, Vec<Particle>> = self.particles.borrow();

        for i in 0..self.number_of_particles {
            for j in 0..self.number_of_particles {
                self.neighbors_matrix[i][j].0 = j;
                let distance =  particles[i].get_distance_from(particles[j].x, particles[j].y);
                self.neighbors_matrix[i][j].1 = distance;
            }
        }
    }

    fn get_neighbor_index(&self, particle: &Particle, neighbor_number: usize) -> usize {
        match neighbor_number {
            0 => particle.neighbor_1 as usize,
            1 => particle.neighbor_2 as usize,
            2 => particle.neighbor_3 as usize,
            3 => particle.neighbor_4 as usize,
            4 => particle.neighbor_5 as usize,
            5 => particle.neighbor_6 as usize,
            6 => particle.neighbor_7 as usize,
            7 => particle.neighbor_8 as usize,
            8 => particle.neighbor_9 as usize,
            9 => particle.neighbor_10 as usize,
            _ => 0
        }
    } 
}