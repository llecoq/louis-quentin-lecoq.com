use wasm_bindgen::prelude::wasm_bindgen;

use super::{particles_manager::ParticlesManagerWASM, impulses_manager::ImpulsesManagerWASM};

#[wasm_bindgen]
pub struct ParticlesWASM {
    particles_manager: ParticlesManagerWASM,
    impulses_manager: ImpulsesManagerWASM,
}

#[wasm_bindgen]
impl ParticlesWASM {
    pub fn new(canvas_height: u32, canvas_width: u32) -> ParticlesWASM {
        let new_particles_manager = ParticlesManagerWASM::new(canvas_height, canvas_width);
        let particles_ref = new_particles_manager.get_particles_ref();
    
        ParticlesWASM {
            particles_manager: new_particles_manager,
            impulses_manager: ImpulsesManagerWASM::new(particles_ref),
        }
    }

    // Returns the `ParticlesManagerWASM` to be used on the JS side
    pub fn get_particles_manager(&self) -> ParticlesManagerWASM {
        self.particles_manager.clone()
    }

    // Returns the `ImpulsesManagerWASM` to be used on the JS side
    pub fn get_impulses_manager(&self) -> ImpulsesManagerWASM {
        self.impulses_manager.clone()
    }
}