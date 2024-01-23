use std::{rc::Rc, cell::RefCell};

use super::{impulse::Impulse, particle::Particle};

pub struct ImpulsesManagerWASM {
    impulses: Vec<Impulse>,
    particles: Rc<RefCell<Vec<Particle>>>,
}