use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use crate::particles::mouse_tracker::MouseData;

use super::{particles_manager::ParticlesManagerWASM, impulses_manager::ImpulsesManagerWASM, mouse_tracker::MouseTracker};

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

    // Accesses the WebAssembly instance's linear memory. This function returns a `WebAssembly.Memory` 
    // object, enabling direct manipulation and interaction of Wasm memory from JavaScript. Used for 
    // efficient data transfer and handling between Rust (Wasm) and JavaScript without the overhead of 
    // serialization/deserialization.
    pub fn memory(&self) -> JsValue {
        wasm_bindgen::memory()
    }

    // Returns the `ParticlesManagerWASM` to be used on the JS side
    pub fn get_particles_manager(&self) -> ParticlesManagerWASM {
        self.particles_manager.clone()
    }

    // Returns the `ImpulsesManagerWASM` to be used on the JS side
    pub fn get_impulses_manager(&self) -> ImpulsesManagerWASM {
        self.impulses_manager.clone()
    }

    // Returns a pointer on the `MouseTracker`'s `mouse_position` buffer to be used on the JS side
    pub fn get_mouse_position_ptr(&self) -> *const MouseData {
        let mouse_tracker = self.impulses_manager.get_mouse_tracker();

        mouse_tracker.get_mouse_position_ptr()
    }
}