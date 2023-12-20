mod components;

use wasm_bindgen::prelude::*;
use web_sys::window;
use components::about::update_about_content;

// #[wasm_bindgen(start)]
// pub fn run_app() {
//     if let Some(window) = window() {
//         if let Some(document) = window.document() {
//             // Votre logique ici, par exemple :
//             update_content(&document);
//         }
//     }
// }
