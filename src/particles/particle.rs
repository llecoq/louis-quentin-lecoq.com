use std::f32::consts::PI;

use rand::Rng;
use wasm_bindgen::prelude::*;

#[derive(Debug)]
pub struct Color {
    red: u8,
    green: u8,
    blue: u8
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Particle {
    pub x: f32,
    y: f32,
    speed_x: f32,
    speed_y: f32,
    size: f32,
    color: Color,
    active: bool,
    neighbors: Vec<usize>,
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

        Particle {
            x : center_x as f32 + radius_x * f32::cos(theta),
            y : center_y as f32 + radius_y * f32::sin(theta),
            size : rng.gen::<f32>() * (particle_max_size - particle_min_size) + particle_min_size,
            color : get_random_particle_color(),
            speed_x : speed_x * dir_x,
            speed_y : speed_y * dir_y,
            active : false,
            neighbors : Vec::new()
        }
    }
}

// Returns RGB values for the color of each particle
fn get_random_particle_color() -> Color {
    let chance: f32 = rand::thread_rng().gen();
    if chance < 0.70 {
        Color {
            red: 255,
            blue: 255,
            green: 255
        }
    } else if chance < 0.9 {
        Color {
            red: 72,
            blue: 217,
            green: 247
        }
    } else {
        Color {
            red: 50,
            blue: 130,
            green: 240
        }
    }
}