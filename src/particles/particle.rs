use std::f32::consts::PI;

use rand::Rng;

// Not ideal but the Structure needs to be "flatten": every element needs to be of the 
// same type (here `f32`) to be able to read it as a `Float32Array` on the JS side
#[derive(Debug)]
pub struct Particle {
    pub x: f32,
    pub y: f32,
    pub speed_x: f32,
    pub speed_y: f32,
    pub size: f32,
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
    // Create a new Particle with random attributes
    pub fn new(canvas_height: u32, canvas_width: u32, particle_min_size: f32, particle_max_size: f32) -> Particle {
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


        Particle {
            x : center_x as f32 + radius_x * f32::cos(theta),
            y : center_y as f32 + radius_y * f32::sin(theta),
            size : rng.gen::<f32>() * (particle_max_size - particle_min_size) + particle_min_size,
            color_red : get_random_red_value(chance),
            color_green : get_random_green_value(chance),
            color_blue : get_random_blue_value(chance),
            speed_x : speed_x * dir_x,
            speed_y : speed_y * dir_y,
            active : 0.0,
            neighbor_1: 0.0,
            neighbor_2: 0.0,
            neighbor_3: 0.0,
            neighbor_4: 0.0,
            neighbor_5: 0.0,
            neighbor_6: 0.0,
            neighbor_7: 0.0,
            neighbor_8: 0.0,
            neighbor_9: 0.0,
            neighbor_10: 0.0,
        }
    }
}

// Returns RGB values for the color of each particle
fn get_random_red_value(chance: f32) -> f32 {
    if chance < 0.70 {
        255.0
    } else if chance < 0.9 {
        72.0
    } else {
        50.0
    }
}

fn get_random_green_value(chance: f32) -> f32 {
    if chance < 0.70 {
        255.0
    } else if chance < 0.9 {
        247.0
    } else {
        240.0
    }
}

fn get_random_blue_value(chance: f32) -> f32 {
    if chance < 0.70 {
        255.0
    } else if chance < 0.9 {
        217.0
    } else {
        130.0
    }
}

