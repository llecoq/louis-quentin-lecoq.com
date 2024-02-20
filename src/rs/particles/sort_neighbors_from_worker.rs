use wasm_bindgen::prelude::wasm_bindgen;

enum ParticleViewData {
    Size = 3,

    X = 1,
    Y = 2
}

#[wasm_bindgen]
pub struct SortNeighborsFromWorker {
    number_of_particles: usize,
    start_index: usize,
    end_index: usize,
}

#[wasm_bindgen]
impl SortNeighborsFromWorker {
    pub fn new(
        number_of_particles: usize,
        start_index: usize,
        end_index: usize,   
    ) -> SortNeighborsFromWorker 
    {
        // Sets a custom panic hook to output Rust panics to the JavaScript console.
        std::panic::set_hook(Box::new(console_error_panic_hook::hook));
        // Initializes console logging for WebAssembly, enabling Rust log output in the browser's console.
        console_log::init().unwrap();

        SortNeighborsFromWorker{
            number_of_particles,
            start_index,
            end_index
        }
    }

    pub fn sort_neighbors(&self, shared_particles_view: &[f32], sorted_neighbors: &mut [u16]) {
        if self.number_of_particles < 2 {
            return;
        }

        // For each Particle
        for particle_index in self.start_index..self.end_index {
            let base_index = particle_index * ParticleViewData::Size as usize;
            let x = shared_particles_view[base_index + ParticleViewData::X as usize];
            let y = shared_particles_view[base_index + ParticleViewData::Y as usize];
            let mut distances: Vec<(usize, f32)> = vec![];

            // Compute distance with other particles
            for neighbor_index in 0..self.number_of_particles {
                if particle_index != neighbor_index {
                    let neighbor_base_index = neighbor_index * ParticleViewData::Size as usize;
                    let neighbor_x = shared_particles_view[neighbor_base_index + ParticleViewData::X as usize];
                    let neighbor_y = shared_particles_view[neighbor_base_index + ParticleViewData::Y as usize];
                
                    let dist = SortNeighborsFromWorker::get_dist(x, y, neighbor_x, neighbor_y);
                    distances.push((neighbor_index, dist));
                }
            }

            distances.sort_unstable_by(|a, b| {
                a.1
                    .partial_cmp(&b.1)
                    .expect("Sort distance for each `Particle` failed.")
            });

            for i in 0..10 {
                if i > self.number_of_particles - 2 {
                    break;
                }
                sorted_neighbors[(particle_index - self.start_index) * 10 + i] = distances[i].0 as u16;
            }
        }
    }

    pub fn change_number_of_particles(&mut self, new_number_of_particles: usize, start_index: usize, end_index: usize) {
        self.number_of_particles = new_number_of_particles;
        self.start_index = start_index;
        self.end_index = end_index;
    }
}

impl SortNeighborsFromWorker {
    fn get_dist(x1: f32, y1: f32, x2: f32, y2: f32) -> f32 {
        let dx = x1 - x2;
        let dy = y1 - y2;
        (dx.powi(2) + dy.powi(2)).sqrt()
    }
}