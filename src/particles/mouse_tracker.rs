use std::{rc::Rc, cell::RefCell};

#[derive(Clone)]
pub struct MouseTracker {
    mouse_position: Rc<RefCell<Vec<u32>>>
}

impl MouseTracker {

    pub fn get_mouse_position_ptr(&self) -> *const u32 {
        self.mouse_position.borrow().as_ptr()
    }

    pub fn new() -> MouseTracker {
        MouseTracker {
            mouse_position: Rc::new(RefCell::new(vec![0, 0]))
        }
    }
}