use std::hash::{Hash, Hasher};

use super::{particle::Particle, Opts};

#[derive(Debug, Clone)]
pub struct Connection {
    pub particles: (f32, f32),
    pub global_alpha: f32,
    pub x: f32,
    pub y: f32,
    pub neighbor_x: f32,
    pub neighbor_y: f32,
}

impl Connection {
    /// Returns None if the distance is too big, meaning that we don't need to check the next neighbors
    pub fn new(
        particle: (&Particle, f32),
        neighbor: (&Particle, f32),
        js_opts: &Opts
    ) -> Option<Self> 
    {
        let distance = particle.0.get_distance_from(neighbor.0.x, neighbor.0.y);

        if distance < js_opts.connection_max_dist as f32 {
            let mut global_alpha = if particle.0.is_active() && neighbor.0.is_active() {
                js_opts.active_connections_global_alpha
            } else {
                js_opts.connection_global_alpha
            };
            global_alpha -= distance / js_opts.connection_max_dist as f32;

            let particles: (f32, f32) = if particle.1 < neighbor.1 {
                (particle.1, neighbor.1)
            } else {
                (neighbor.1, particle.1)
            };

            return Some(
                Connection { 
                    particles, 
                    global_alpha, 
                    x: particle.0.x, 
                    y: particle.0.y, 
                    neighbor_x: neighbor.0.x, 
                    neighbor_y: neighbor.0.y 
                }
            )
        }
        None
    }
}

impl PartialEq for Connection {
    fn eq(&self, other: &Self) -> bool {
        self.particles == other.particles
    }
}

impl Eq for Connection {}

impl Hash for Connection {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.particles.0.to_bits().hash(state);
        self.particles.1.to_bits().hash(state);
    }
}

