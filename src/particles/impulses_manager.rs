use std::rc::Rc;

use super::{impulse::Impulse, particle::Particle};

pub struct ImpulsesManagerWASM {
    impulses: Vec<Impulse>,
    particles: Rc<Vec<Particle>>,
}