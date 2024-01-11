use wasm_bindgen::prelude::*;

pub struct Color {
    red: u8,
    green: u8,
    blue: u8
}

#[wasm_bindgen]
pub struct Particle {
    x: f32,
    y: f32,
    speed_x: f32,
    speed_y: f32,
    size: f32,
    color: Color,
    active: bool,
    neighbors: Vec<usize>,
}
