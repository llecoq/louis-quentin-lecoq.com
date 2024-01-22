use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = window)]
    fn getOpts() -> JsValue;
}

#[derive(Debug)]
pub struct Canvas {
    height: u32,
    width: u32
}

// Opts structure replicating the options of the `Particles.js` module
#[derive(Serialize, Deserialize, Debug)]
pub struct Opts {
    // Particles
    #[serde(rename = "NUMBER_OF_PARTICLES")]
    pub number_of_particles: usize,
    #[serde(rename = "PARTICLE_MAX_SIZE")]
    pub particle_max_size: f32,
    #[serde(rename = "PARTICLE_MIN_SIZE")]
    pub particle_min_size: f32,
    #[serde(rename = "PARTICLE_ACTIVE_DELAY")]
    pub particle_active_delay: u16,
    #[serde(rename = "PARTICLE_ACTIVE_COLOR")]
    pub particle_active_color: String,
    #[serde(rename = "PARTICLE_ACTIVE_SIZE_SCALE")]
    pub particle_active_size_scale: f32,
    #[serde(rename = "PARTICLE_COLOR_1")]
    pub particle_color_1: String,
    #[serde(rename = "PARTICLE_COLOR_2")]
    pub particle_color_2: String,
    #[serde(rename = "PARTICLE_COLOR_3")]
    pub particle_color_3: String,

    // Connections
    #[serde(rename = "CONNECTION_MAX_DIST")]
    pub connection_max_dist: u16,
    #[serde(rename = "CONNECTIONS_STROKE_STYLE")]
    pub connection_stroke_style: String,
    #[serde(rename = "CONNECTIONS_LINE_WIDTH")]
    pub connection_line_width: f32,
    #[serde(rename = "CONNECTIONS_GLOBAL_ALPHA")]
    pub connection_global_alpha: f32,
    #[serde(rename = "ACTIVE_CONNECTIONS_GLOBAL_ALPHA")]
    pub active_connections_global_alpha: f32,
    #[serde(rename = "PARTICLE_MAX_CONNECTIONS")]
    pub particle_max_connections: u8,

    // Impulses
    #[serde(rename = "IMPULSE_DIST_AUTONOMY")]
    pub impulse_dist_autonomy: u16,
    #[serde(rename = "IMPULSE_SPEED")]
    pub impulse_speed: u8,
    #[serde(rename = "IMPULSE_SPEED_OFFSET")]
    pub impulse_speed_offset: u8,
    #[serde(rename = "IMPULSE_SIZE")]
    pub impulse_size: u8,
    #[serde(rename = "MAX_IMPULSES")]
    pub max_impulses: u8,

    // FPS / DELTA
    #[serde(rename = "BASE_DELTA")]
    pub base_delta: f32,
}
            
// Get options from JS side
pub fn get_opts_from_js() -> Result<Opts, JsValue> {
    let val: JsValue = getOpts();
    serde_wasm_bindgen::from_value(val)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

// Modules
pub mod particle;
pub mod particles_manager;


