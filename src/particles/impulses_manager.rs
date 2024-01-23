use std::{rc::Rc, cell::{RefCell, Ref}, borrow::Borrow};
use wasm_bindgen::prelude::wasm_bindgen;

use super::{impulse::Impulse, particle::Particle, Opts, get_opts_from_js, mouse_tracker::MouseTracker};

#[wasm_bindgen]
#[derive(Clone)]
pub struct ImpulsesManagerWASM {
    impulses: Vec<Impulse>,
    particles: Rc<RefCell<Vec<Particle>>>,
    opts: Opts,
    mouse_tracker: Rc<MouseTracker>
}

impl ImpulsesManagerWASM {
    
    pub fn new(particles_ref: Rc<RefCell<Vec<Particle>>>) -> ImpulsesManagerWASM {
        ImpulsesManagerWASM {
            impulses: vec![],
            particles: particles_ref,
            opts: get_opts_from_js().unwrap(),
            mouse_tracker: Rc::new(MouseTracker::new())
        }
    }

    pub fn get_mouse_tracker(&self) -> &MouseTracker {
        self.mouse_tracker.borrow()
    }
}

#[wasm_bindgen]
impl ImpulsesManagerWASM {

    pub fn create_impulses(&self) {
        let mouse_x = self.mouse_tracker.get_pos_x();
        let mouse_y = self.mouse_tracker.get_pos_y();
        let nb_of_active_impulses = self.impulses.len();
        
        for particle in self.particles {

            if particle.can_create_impulse(&self.opts, mouse_x, mouse_y, nb_of_active_impulses) {

            }
        }
    }
}