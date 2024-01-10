use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = window)]
    fn getOpts() -> JsValue;
}

// Opts structure replicating the options of the `Particles.js` module
#[derive(Serialize, Deserialize)]
pub struct Opts {
    // Particles
    pub number_of_particles: u16,
    pub particle_max_size: f32,
    pub particle_min_size: f32,
    pub particle_active_delay: u16,
    pub particle_active_color: &str,
    pub particle_active_size_scale: f32,
    pub particle_color_1: &str,
    pub particle_color_2: &str,
    pub particle_color_3: &str,

    // Connections
    pub connection_max_dist: u16,
    pub connection_stroke_style: &str,
    pub connection_line_width: f32,
    pub connection_global_alpha: f32,
    pub active_connections_global_alpha: f32,
    particle_max_connections: u8,

    // Impulses
    pub impulse_dist_autonomy: u16,
    pub impulse_speed: u8,
    pub impulse_speed_offset: u8,
    pub impulse_size: u8,
    pub max_impulses: u8,

    // FPS / DELTA
    pub base_delta: f32,
}

// Get options from JS side
pub fn get_opts() -> Opts {
    let js_value = getOpts();
    js_value.into_serde().unwrap()
}

// Modules
pub mod particle;
pub mod particles_manager;


