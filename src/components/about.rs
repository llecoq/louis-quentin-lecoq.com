use web_sys::Document;
use wasm_bindgen::prelude::*;
use web_sys::console::log;

#[wasm_bindgen]
pub fn update_about_content(document: &Document) {
    if let Some(about_element) = document.get_element_by_id("about") {
        about_element.set_inner_html("Ceci est ma biographie.");
    }
}
