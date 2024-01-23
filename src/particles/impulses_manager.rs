use std::{rc::Rc, cell::RefCell};
use wasm_bindgen::prelude::wasm_bindgen;

use super::{impulse::Impulse, particle::Particle};

#[wasm_bindgen]
#[derive(Clone)]
pub struct ImpulsesManagerWASM {
    impulses: Vec<Impulse>,
    particles: Rc<RefCell<Vec<Particle>>>,
}

impl ImpulsesManagerWASM {
    
    pub fn new(particles_ref: Rc<RefCell<Vec<Particle>>>) -> ImpulsesManagerWASM {
        ImpulsesManagerWASM {
            impulses: vec![],
            particles: particles_ref
        }
    }

}