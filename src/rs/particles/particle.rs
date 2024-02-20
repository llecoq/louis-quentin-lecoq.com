use std::f32::consts::PI;
use rand::Rng;

use super::Opts;

// Not ideal but the Structure needs to be "flatten": every element needs to be of the 
// same type (here `f32`) to be able to read it as a `Float32Array` on the JS side
#[derive(Debug, Clone)]
pub struct Particle {
    pub x: f32,
    pub y: f32,
    pub speed_x: f32,
    pub speed_y: f32,
    pub size: f32,
    pub active_size: f32,
    pub color_red: f32,
    pub color_green: f32,
    pub color_blue: f32,
    pub active: f32,
    pub neighbor_1: f32,
    pub neighbor_2: f32,
    pub neighbor_3: f32,
    pub neighbor_4: f32,
    pub neighbor_5: f32,
    pub neighbor_6: f32,
    pub neighbor_7: f32,
    pub neighbor_8: f32,
    pub neighbor_9: f32,
    pub neighbor_10: f32,
}

impl Particle {
    // Create a new `Particle` with random attributes
    pub fn new(
        canvas_height: u32, 
        canvas_width: u32, 
        particle_min_size: f32, 
        particle_max_size: f32,
        particle_active_size_scale: f32
    ) -> Particle 
    {
        let mut rng = rand::thread_rng();
        let center_x = canvas_width / 2;
        let center_y = canvas_height / 2;
        let radius_x: f32 = canvas_width as f32 * 0.3; 
        let radius_y: f32 = canvas_height as f32 * 0.3;
        let theta: f32 = rng.gen::<f32>() * 2.0 * PI;
        let speed_x: f32 = rng.gen();
        let speed_y: f32 = rng.gen();
        let dir_x = if rng.gen::<f32>() > 0.5 {1.0} else {-1.0};
        let dir_y = if rng.gen::<f32>() > 0.5 {1.0} else {-1.0};
        let chance: f32 = rand::thread_rng().gen();
        let size: f32 = rng.gen::<f32>() * (particle_max_size - particle_min_size) + particle_min_size;

        Particle {
            x : center_x as f32 + radius_x * f32::cos(theta),
            y : center_y as f32 + radius_y * f32::sin(theta),
            size,
            active_size: size * particle_active_size_scale,
            color_red : get_random_red_value(chance),
            color_green : get_random_green_value(chance),
            color_blue : get_random_blue_value(chance),
            speed_x : speed_x * dir_x,
            speed_y : speed_y * dir_y,
            active : 0.0,
            neighbor_1: -1.0,
            neighbor_2: -1.0,
            neighbor_3: -1.0,
            neighbor_4: -1.0,
            neighbor_5: -1.0,
            neighbor_6: -1.0,
            neighbor_7: -1.0,
            neighbor_8: -1.0,
            neighbor_9: -1.0,
            neighbor_10: -1.0,
        }
    }

    pub fn new_mouse(mouse_x: f32, mouse_y: f32) -> Self {
        Particle { 
            x: mouse_x, 
            y: mouse_y, 
            speed_x: -1.0, 
            speed_y: -1.0, 
            size: -1.0, 
            active_size: -1.0, 
            color_red: -1.0, 
            color_green: -1.0, 
            color_blue: -1.0, 
            active: -1.0, 
            neighbor_1: -1.0, 
            neighbor_2: -1.0, 
            neighbor_3: -1.0, 
            neighbor_4: -1.0, 
            neighbor_5: -1.0, 
            neighbor_6: -1.0, 
            neighbor_7: -1.0, 
            neighbor_8: -1.0, 
            neighbor_9: -1.0, 
            neighbor_10: -1.0 
        }
    }
    
    // Update the position of the `Particle`
    pub fn update_position(&mut self, canvas_height: u32, canvas_width: u32, scale_fps: f32) {
        self.x += self.speed_x * scale_fps;
        self.y += self.speed_y * scale_fps;

        if self.x < 0.0 {
            self.x = canvas_width as f32;
        } else if self.x > canvas_width as f32{
            self.x = 0.0;
        } else if self.y < 0.0 {
            self.y = canvas_height as f32;
        } else if self.y > canvas_height as f32 {
            self.y = 0.0;
        }
    }

    // Returns the distance between two `Particle`
    pub fn get_distance_from(&self, other_x: f32, other_y: f32) -> f32 {
        let dx = self.x - other_x;
        let dy = self.y - other_y;
        (dx.powi(2) + dy.powi(2)).sqrt()
    }

    // Set neighbor index as f32
    pub fn set_neighbor(&mut self, neighbor_number: usize, neighbor_index: usize) {
        match neighbor_number {
            1 => self.neighbor_1 = neighbor_index as f32,
            2 => self.neighbor_2 = neighbor_index as f32,
            3 => self.neighbor_3 = neighbor_index as f32,
            4 => self.neighbor_4 = neighbor_index as f32,
            5 => self.neighbor_5 = neighbor_index as f32,
            6 => self.neighbor_6 = neighbor_index as f32,
            7 => self.neighbor_7 = neighbor_index as f32,
            8 => self.neighbor_8 = neighbor_index as f32,
            9 => self.neighbor_9 = neighbor_index as f32,
            10 => self.neighbor_10 = neighbor_index as f32,
            _ => {}
        }
    }

    // Check if possible to create a new `Impulse`
    pub fn can_create_impulse(&self, opts: &Opts, mouse_x: u32, mouse_y: u32, number_of_active_impulses: usize) -> bool {
        let dist_to_mouse = self.get_distance_from(mouse_x as f32, mouse_y as f32);

        self.active == 0.0
            && dist_to_mouse < opts.connection_max_dist 
            && number_of_active_impulses < opts.max_impulses as usize
    }

    // Pre-activate `Particle` by setting `particle.active` at 2.0
    // The JS side will handle the change of size of the `Particle`,
    // set `particle.active` to 1.0 and after a `setTimeout` of `opts.particle_active_delay`
    // will set again `particle.active` to 0.0
    pub fn pre_activate_particle(&mut self) {
        self.active = 2.0;
    }

    pub fn set_active(&mut self, value: f32) {
        self.active = value;
    }

    pub fn is_active(&self) -> bool {
        self.active == 2.0 || self.active == 1.0
    }

    pub fn clear_neighbors(&mut self) {
        self.neighbor_1 = -1.0;
        self.neighbor_2 = -1.0;
        self.neighbor_3 = -1.0;
        self.neighbor_4 = -1.0;
        self.neighbor_5 = -1.0;
        self.neighbor_6 = -1.0;
        self.neighbor_7 = -1.0;
        self.neighbor_8 = -1.0;
        self.neighbor_9 = -1.0;
        self.neighbor_10 = -1.0;
    }
}


// Returns red values for the color of the `Particle`
fn get_random_red_value(chance: f32) -> f32 {
    if chance < 0.55 {
        255.0
    } else if chance < 0.80 {
        72.0
    } else {
        74.0
    }
}

// Returns green values for the color of the `Particle`
fn get_random_green_value(chance: f32) -> f32 {
    if chance < 0.55 {
        255.0
    } else if chance < 0.80 {
        107.0
    } else {
        247.0
    }
}

// Returns blue values for the color of the `Particle`
fn get_random_blue_value(chance: f32) -> f32 {
    if chance < 0.55 {
        255.0
    } else if chance < 0.85 {
        247.0
    } else {
        161.0
    }
}

