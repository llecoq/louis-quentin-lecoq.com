#[derive(Debug, Clone)]
pub struct Impulse {
    pub x: f32,
    pub y: f32,
    pub particle_index: f32,
    pub target_index: f32,
    pub dist_autonomy: f32,
}