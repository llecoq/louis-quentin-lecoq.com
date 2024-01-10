use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Particle {
    x: f32,
    y: f32,
    speed_x: f32,
    speed_y: f32,
    size: f32,
    red: u8,
    green: u8,
    blue: u8,
    active: bool,
    neighbors: Vec<usize>,
}
