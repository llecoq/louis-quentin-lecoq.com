/* tslint:disable */
/* eslint-disable */
/**
*/
export class ImpulsesManagerWASM {
  free(): void;
/**
* Checks and creates new impulses at each frame when the mouse is over the canvas.
* It updates neighbor data in the particle matrix, identifies inactive particles, 
* and generates impulses for those capable of impulse creation based on current mouse position.
*/
  create_impulses(): void;
/**
* Updates the positions of all impulses in the vector.
* Each impulse's position is updated based on a scaling factor related to FPS and predefined update steps.
*
* Parameters:
*     scale_fps: f32 - A scaling factor derived from the frame rate (FPS) to ensure smooth animation.
* @param {number} scale_fps
*/
  update_impulses_position(scale_fps: number): void;
/**
*/
  remove_expired_impulses(): void;
/**
* Main function to move and duplicate impulses
*/
  move_and_duplicate_impulses(): void;
/**
* Returns a constant pointer to the impulses vector.
* This pointer can be used for creating a corresponding array in JavaScript via WebAssembly's linear memory.
*
* Returns:
*     *const Impulse - A pointer to the start of the impulses array.
* @returns {number}
*/
  get_impulses_ptr(): number;
/**
* Returns the current number of active impulses.
*
* Returns:
*     usize - The count of active impulses in the system.
* @returns {number}
*/
  get_impulses_len(): number;
/**
* @param {number} value
*/
  change_number_of_particles(value: number): void;
/**
* @param {number} value
*/
  set_connection_max_dist(value: number): void;
}
/**
*/
export class ParticlesManagerWASM {
  free(): void;
/**
*/
  init(): void;
/**
* @returns {number}
*/
  get_particles_ptr(): number;
/**
* @param {number} scale_fps
*/
  update(scale_fps: number): void;
/**
* @param {boolean} mouse_is_over_canvas
* @param {number} mouse_x
* @param {number} mouse_y
*/
  create_connections(mouse_is_over_canvas: boolean, mouse_x: number, mouse_y: number): void;
/**
* @returns {number}
*/
  get_connections_ptr(): number;
/**
* @returns {number}
*/
  get_connections_len(): number;
/**
* @param {number} width
* @param {number} height
*/
  resize_canvas(width: number, height: number): void;
/**
*/
  sort_neighbors(): void;
/**
* @param {number} new_number_of_particles
*/
  change_number_of_particles(new_number_of_particles: number): void;
/**
* @param {number} value
*/
  set_connection_max_dist(value: number): void;
/**
*/
  clear_neighbors(): void;
}
/**
*/
export class ParticlesWASM {
  free(): void;
/**
* @param {number} canvas_height
* @param {number} canvas_width
* @returns {ParticlesWASM}
*/
  static new(canvas_height: number, canvas_width: number): ParticlesWASM;
/**
* @returns {any}
*/
  memory(): any;
/**
* @returns {ParticlesManagerWASM}
*/
  get_particles_manager(): ParticlesManagerWASM;
/**
* @returns {ImpulsesManagerWASM}
*/
  get_impulses_manager(): ImpulsesManagerWASM;
/**
* @returns {number}
*/
  get_mouse_position_ptr(): number;
}
/**
*/
export class SortNeighborsFromWorker {
  free(): void;
/**
* @param {number} number_of_particles
* @param {number} start_index
* @param {number} end_index
* @returns {SortNeighborsFromWorker}
*/
  static new(number_of_particles: number, start_index: number, end_index: number): SortNeighborsFromWorker;
/**
* @param {Float32Array} shared_particles_view
* @param {Uint16Array} sorted_neighbors
*/
  sort_neighbors(shared_particles_view: Float32Array, sorted_neighbors: Uint16Array): void;
/**
* @param {number} new_number_of_particles
* @param {number} start_index
* @param {number} end_index
*/
  change_number_of_particles(new_number_of_particles: number, start_index: number, end_index: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_impulsesmanagerwasm_free: (a: number) => void;
  readonly impulsesmanagerwasm_create_impulses: (a: number) => void;
  readonly impulsesmanagerwasm_update_impulses_position: (a: number, b: number) => void;
  readonly impulsesmanagerwasm_remove_expired_impulses: (a: number) => void;
  readonly impulsesmanagerwasm_move_and_duplicate_impulses: (a: number) => void;
  readonly impulsesmanagerwasm_get_impulses_ptr: (a: number) => number;
  readonly impulsesmanagerwasm_get_impulses_len: (a: number) => number;
  readonly impulsesmanagerwasm_change_number_of_particles: (a: number, b: number) => void;
  readonly impulsesmanagerwasm_set_connection_max_dist: (a: number, b: number) => void;
  readonly __wbg_particlesmanagerwasm_free: (a: number) => void;
  readonly particlesmanagerwasm_init: (a: number) => void;
  readonly particlesmanagerwasm_get_particles_ptr: (a: number) => number;
  readonly particlesmanagerwasm_update: (a: number, b: number) => void;
  readonly particlesmanagerwasm_create_connections: (a: number, b: number, c: number, d: number) => void;
  readonly particlesmanagerwasm_get_connections_ptr: (a: number) => number;
  readonly particlesmanagerwasm_get_connections_len: (a: number) => number;
  readonly particlesmanagerwasm_resize_canvas: (a: number, b: number, c: number) => void;
  readonly particlesmanagerwasm_sort_neighbors: (a: number) => void;
  readonly particlesmanagerwasm_change_number_of_particles: (a: number, b: number) => void;
  readonly particlesmanagerwasm_set_connection_max_dist: (a: number, b: number) => void;
  readonly particlesmanagerwasm_clear_neighbors: (a: number) => void;
  readonly __wbg_sortneighborsfromworker_free: (a: number) => void;
  readonly sortneighborsfromworker_new: (a: number, b: number, c: number) => number;
  readonly sortneighborsfromworker_sort_neighbors: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly sortneighborsfromworker_change_number_of_particles: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_particleswasm_free: (a: number) => void;
  readonly particleswasm_new: (a: number, b: number) => number;
  readonly particleswasm_memory: (a: number) => number;
  readonly particleswasm_get_particles_manager: (a: number) => number;
  readonly particleswasm_get_impulses_manager: (a: number) => number;
  readonly particleswasm_get_mouse_position_ptr: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
