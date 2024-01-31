use rand::Rng;

use super::{impulses_manager::ParticleData, particle::Particle, Opts};

#[derive(Debug, Clone)]
pub struct Impulse {
    pub x: f32,
    pub y: f32,
    pub particle_index: f32,
    pub target_index: f32,
    pub target_x: f32,
    pub target_y: f32,
    pub speed: f32,
    pub dist_autonomy: f32,
}

impl Impulse {

    pub fn new(
        mouse_x: f32, 
        mouse_y: f32,
        target: &mut Particle,
        particle_index: f32, 
        target_index: f32,
        opts: &Opts
    ) -> Impulse 
    {
        Impulse {
            x: mouse_x, 
            y: mouse_y, 
            particle_index, 
            target_index,
            target_x: target.x,
            target_y: target.y,
            speed: Impulse::get_random_speed(opts), 
            dist_autonomy: opts.impulse_dist_autonomy as f32
        }        
    }

    pub fn update_position(&mut self, scale_fps: f32, steps: u8) {
        for _ in 0..steps {
            let mut dx = self.target_x - self.x;
            let mut dy = self.target_y - self.y;
            let distance = ((dx * dx) + (dy * dy)).sqrt();

            dx /= distance;
            dy /= distance;

            self.x += dx * self.speed * scale_fps;
            self.y += dy * self.speed * scale_fps;
        }

        self.dist_autonomy -= self.speed * steps as f32 * scale_fps;
    }

    pub fn is_expired(&self) -> bool {
        self.dist_autonomy <= 0.0 || self.target_index == -1.0
    }

    pub fn jump_to_particle(&mut self, target_data: &ParticleData) {
        self.particle_index = self.target_index;
        self.target_index = target_data.index;
        self.target_x = target_data.x;
        self.target_y = target_data.y;
    }

    pub fn duplicate_to_target(&self, target_data: &ParticleData, opts: &Opts) -> Impulse {
        Impulse { 
            x: self.x,
            y: self.y,
            particle_index: self.particle_index,
            target_index: target_data.index,
            target_x: target_data.x,
            target_y: target_data.y,
            speed: Impulse::get_random_speed(opts),
            dist_autonomy: self.dist_autonomy
        }
    }

    pub fn has_to_jump(&self) -> bool {
        let dx = self.x - self.target_x;
        let dy = self.y - self.target_y;
        (dx.powi(2) + dy.powi(2)).sqrt() < 10.0
    }

    fn get_random_speed(opts: &Opts) -> f32 {
        let mut rng = rand::thread_rng();
        rng.gen::<f32>() * opts.impulse_speed as f32 + opts.impulse_speed_offset as f32
    }
    
}