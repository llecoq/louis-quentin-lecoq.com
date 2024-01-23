use std::{rc::Rc, cell::RefCell};

pub struct MouseData {
    pos_x: u32,
    pos_y: u32,
    mouse_is_over_canvas: u32,
}

#[derive(Clone)]
pub struct MouseTracker {
    mouse_position: Rc<RefCell<Vec<MouseData>>>
}

impl MouseTracker {

    pub fn get_mouse_position_ptr(&self) -> *const MouseData {
        self.mouse_position.borrow().as_ptr()
    }

    pub fn new() -> MouseTracker {
        MouseTracker {
            mouse_position: Rc::new(RefCell::new(vec![]))
        }
    }

    pub fn get_pos_x(&self) -> u32 {
        self.mouse_position.borrow()[0].pos_x
    }

    pub fn get_pos_y(&self) -> u32 {
        self.mouse_position.borrow()[0].pos_y
    }
}