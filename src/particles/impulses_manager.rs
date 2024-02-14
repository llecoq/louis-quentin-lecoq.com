use std::{cell::RefCell, rc::Rc};
use wasm_bindgen::prelude::wasm_bindgen;

use super::{get_opts_from_js, impulse::Impulse, mouse_tracker::{MouseData, MouseTracker}, particle::Particle, Opts};

#[wasm_bindgen]
#[derive(Clone)]
pub struct ImpulsesManagerWASM {
    impulses: Vec<Impulse>,
    particles: Rc<RefCell<Vec<Particle>>>,
    opts: Opts,
    mouse_tracker: MouseTracker,
    active_impulses_number: usize,
    next_neighbors_data: Vec<(usize, (Option<ParticleData>, Option<ParticleData>))>,
    number_of_particles: usize,
}

#[derive(Clone, Debug)]
pub struct ParticleData {
    pub index: f32,
    pub x: f32,
    pub y: f32,
    pub active: f32,
}

impl ImpulsesManagerWASM {
    
    /// Constructs a new `ImpulsesManagerWASM`.
    /// Initializes the impulses array and neighbors data matrix based on options retrieved from JavaScript.
    /// Also initializes the mouse tracker and sets the number of active impulses to zero.
    ///
    /// Parameters:
    ///     particles_ref: Rc<RefCell<Vec<Particle>>> - A shared reference to a vector of particles.
    ///
    /// Returns:
    ///     ImpulsesManagerWASM - A new instance of the impulses manager ready for use with WebAssembly.
    pub fn new(particles_ref: Rc<RefCell<Vec<Particle>>>) -> ImpulsesManagerWASM {
        let js_opts: Opts = get_opts_from_js().expect("Error while fetching Opts from JS");
        let number_of_particles = js_opts.number_of_particles;

        ImpulsesManagerWASM {
            impulses: vec![
                Impulse{
                    x: 0.0,
                    y: 0.0,
                    particle_index: 0.0,
                    target_index: 0.0,
                    target_x: 0.0,
                    target_y: 0.0,
                    speed: 0.0,
                    dist_autonomy: 0.0
                };
                js_opts.max_impulses + 1
            ],
            particles: particles_ref.clone(),
            opts: js_opts,
            mouse_tracker: MouseTracker::new(),
            active_impulses_number: 0,
            next_neighbors_data: vec![],
            number_of_particles
        }
    }

    /// Returns a constant pointer to the mouse data structure.
    /// This pointer is used to access mouse position data from JavaScript in a WebAssembly context.
    ///
    /// Returns:
    ///     *const MouseData - A pointer to the mouse data structure.
    pub fn get_mouse_position_ptr(&self) -> *const MouseData {
        self.mouse_tracker.get_mouse_position_ptr()
    }
    
    /// Generates an `Impulse` targeting a specified particle. It sets the impulse's origin to the mouse coordinates,
    /// assigns random speed, and initializes its direction towards the target particle.
    ///
    /// Parameters:
    ///     mouse_x, mouse_y: Coordinates of the mouse.
    ///     target: Mutable reference to the target particle.
    ///     particle_index, target_index: Indices of the particle and target in their respective vectors.
    ///
    /// Returns:
    ///     Impulse object ready to be processed.
    fn create_impulse(
        &self, 
        mouse_x: f32, 
        mouse_y: f32,
        target: &mut Particle,
        particle_index: f32, 
        target_index: f32
    ) -> Impulse 
    {
        target.pre_activate_particle();

        Impulse::new(mouse_x, mouse_y, target, particle_index, target_index, &self.opts)
    }

    // The Vec<Particle> must maintain a predefined size and a consistent memory location 
    // throughout the execution for accessible and readable data from JS.
    // When an element is removed from the vector, this function deactivates it
    // and shifts all subsequent elements to maintain the vector's integrity.
    fn remove_impulse_from_vec(&mut self, remove_index: usize) {
        for i in remove_index..self.active_impulses_number - 1 {
            self.impulses[i] = self.impulses[i + 1].clone();
        }
        self.active_impulses_number -= 1;
    }

    fn get_neighbor_data_by_number(&self, particle: &Particle, neighbor_number: usize) -> Option<ParticleData> {
        let particles = self.particles.borrow();

        let get_neighbor_data = |index: f32| {
            particles.get(index as usize).map(|neighbor| ParticleData {
                index,
                x: neighbor.x,
                y: neighbor.y,
                active: neighbor.active
            })
        };
    
        match neighbor_number {
            1 => get_neighbor_data(particle.neighbor_1),
            2 => get_neighbor_data(particle.neighbor_2),
            3 => get_neighbor_data(particle.neighbor_3),
            4 => get_neighbor_data(particle.neighbor_4),
            5 => get_neighbor_data(particle.neighbor_5),
            6 => get_neighbor_data(particle.neighbor_6),
            7 => get_neighbor_data(particle.neighbor_7),
            8 => get_neighbor_data(particle.neighbor_8),
            9 => get_neighbor_data(particle.neighbor_9),
            10 => get_neighbor_data(particle.neighbor_10),
            _ => None,
        }
    }

    /// Find impulses that need to jump to another Particle and add it to a Vec
    fn find_jumping_impulses_indices(&mut self) -> Vec<usize> {
        self.impulses
        .iter()
        .enumerate()
        .filter_map(|(i, impulse)| {
            if impulse.has_to_jump() {
                Some(i)
            } else {
                None
            }
        })
        .collect() 
    }

    /// Find a maximum of 2 neighbors for each Particle needing to jump
    fn find_next_neighbors_data(&mut self, jumping_impulses_indices: &Vec<usize>) {
        if self.number_of_particles < 2 {
            return;
        }
        
        for impulse_index in jumping_impulses_indices {
            let impulse = &self.impulses[*impulse_index];
            let origin_index = impulse.particle_index;
            let target_index = impulse.target_index as usize;
            let neighbors = self.get_next_neighbors(origin_index, &self.particles.borrow()[target_index]);

            self.next_neighbors_data.push((*impulse_index, neighbors));
        }
    }

    /// Get up to two close neighbors
    ///     ///
    /// Returns:
    ///     (Option<ParticleData>, Option<ParticleData>) - Some(neighbor) or None
    fn get_next_neighbors(
        &self, 
        origin_index: f32, 
        target_particle: 
        &Particle
    ) -> (Option<ParticleData>, Option<ParticleData>) 
    {
        let mut neighbors_data = vec![];

        for i in 1..=10 {
            match self.get_neighbor_data_by_number(target_particle, i) {
                Some(neighbor) => {neighbors_data.push(neighbor)},
                None => {}
            }
        };

        let next_neighbors: Vec<&ParticleData> = neighbors_data
            .iter()
            .filter(|neighbor| {
                neighbor.active == 0.0
                && target_particle.get_distance_from(neighbor.x, neighbor.y) < self.opts.connection_max_dist as f32
                && neighbor.index != origin_index            
            })
            .take(2)
            .collect();
        
        match next_neighbors.as_slice() {
            [first, second] => (Some((*first).clone()), Some((*second).clone())),
            [first] => (Some((*first).clone()), None),
            _ => (None, None),
        }
    }

    /// Process and update impulses based on neighbors data 
    /// 
    /// Returns:
    ///     Vec<Impulse> - A vector of the new impulses to add to self.impulses
    fn process_impulses(&mut self) -> Vec<Impulse> {
        let mut impulses_to_add: Vec<Impulse> = vec![];

        for elem in &self.next_neighbors_data {
            let impulse_index = elem.0;
            let impulse = &mut self.impulses[impulse_index];

            match &elem.1 {
                (Some(first_neighbor), Some(second_neighbor)) => {
                    impulse.jump_to_particle(&first_neighbor);
                    self.particles.borrow_mut()[first_neighbor.index as usize].pre_activate_particle();
                    impulses_to_add.push(impulse.duplicate_to_target(second_neighbor, &self.opts));
                    self.particles.borrow_mut()[second_neighbor.index as usize].pre_activate_particle();
                }
                (Some(first_neighbor), None) => {
                    impulse.jump_to_particle(&first_neighbor);
                    self.particles.borrow_mut()[first_neighbor.index as usize].pre_activate_particle();
                }
                _ => {
                    impulse.target_index = -1.0;
                }
            }
        }        

        impulses_to_add
    }

    fn add_new_impulses(&mut self, impulses_to_add: &Vec<Impulse>) {
        for impulse in impulses_to_add {
            // If the "Shooting Stars" mode is false, it will not add the Impulse if it's too far away from it's target
            if self.opts.shooting_stars == false 
                && self.get_distance_between(impulse.x, impulse.y, impulse.target_x, impulse.target_y) > self.opts.connection_max_dist.into() 
            {
                continue;
            }
            if self.active_impulses_number < self.opts.max_impulses {
                self.impulses[self.active_impulses_number] = impulse.clone();
                self.active_impulses_number += 1;
            }
        }
    } 

    fn get_distance_between(&self, x: f32, y: f32, other_x: f32, other_y: f32) -> f32 {
        let dx = x - other_x;
        let dy = y - other_y;
        (dx.powi(2) + dy.powi(2)).sqrt()
    }

}

#[wasm_bindgen]
impl ImpulsesManagerWASM {

    /// Checks and creates new impulses at each frame when the mouse is over the canvas.
    /// It updates neighbor data in the particle matrix, identifies inactive particles, 
    /// and generates impulses for those capable of impulse creation based on current mouse position.
    pub fn create_impulses(&mut self) {
        let mut particles = self.particles.borrow_mut();
        let mouse_x = self.mouse_tracker.get_pos_x();
        let mouse_y = self.mouse_tracker.get_pos_y();

        for (particle_index, particle) in &mut particles
            .iter_mut()
            .enumerate() 
            .filter(|(index, _)| {
                index < &self.number_of_particles
            }){
                if particle.can_create_impulse(&self.opts, mouse_x, mouse_y, self.active_impulses_number) {
                    let new_impulse: Impulse = self.create_impulse(
                        mouse_x as f32, 
                        mouse_y as f32, 
                        particle, 
                        -1.0, 
                        particle_index as f32
                    );
    
                    self.impulses[self.active_impulses_number] = new_impulse;
                    self.active_impulses_number += 1;
                };
            }
    }

    /// Updates the positions of all impulses in the vector.
    /// Each impulse's position is updated based on a scaling factor related to FPS and predefined update steps.
    ///
    /// Parameters:
    ///     scale_fps: f32 - A scaling factor derived from the frame rate (FPS) to ensure smooth animation.
    pub fn update_impulses_position(&mut self, scale_fps: f32) {
        for index in 0..self.active_impulses_number {
            self.impulses[index].update_position(scale_fps, self.opts.impulse_update_steps);
        }
    }

    pub fn remove_expired_impulses(&mut self) {
        let mut expired_indices: Vec<usize> = Vec::new();

        for index in 0..self.active_impulses_number {
            if self.impulses[index].is_expired() {
                expired_indices.push(index);
            }
        }

        for &index in expired_indices.iter().rev() {
            self.remove_impulse_from_vec(index);
        }
    }

    /// Main function to move and duplicate impulses
    pub fn move_and_duplicate_impulses(&mut self) {
        let jumping_impulses_indices: Vec<usize> = self.find_jumping_impulses_indices();

        self.find_next_neighbors_data(&jumping_impulses_indices);

        let impulses_to_add: Vec<Impulse> = self.process_impulses();

        self.add_new_impulses(&impulses_to_add);

        self.next_neighbors_data.clear();
    }

    /// Returns a constant pointer to the impulses vector.
    /// This pointer can be used for creating a corresponding array in JavaScript via WebAssembly's linear memory.
    ///
    /// Returns:
    ///     *const Impulse - A pointer to the start of the impulses array.
    pub fn get_impulses_ptr(&self) -> *const Impulse {
        self.impulses.as_ptr()
    }

    /// Returns the current number of active impulses.
    ///
    /// Returns:
    ///     usize - The count of active impulses in the system.
    pub fn get_impulses_len(&self) -> usize {
        self.active_impulses_number
    }

    pub fn change_number_of_particles(&mut self, value: usize) {
        self.number_of_particles = value;
    }
}