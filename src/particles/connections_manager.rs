use std::collections::HashSet;

use super::{connection::Connection, particle::Particle, Opts};

#[derive(Clone)]
pub struct ConnectionsManagerWASM {
    pub connections_set: HashSet<Connection>,
    pub connections_vec: Vec<Connection>,
}

impl ConnectionsManagerWASM {
    pub fn clear_connections(&mut self) {
        self.connections_set.clear();
    }

    /// Returns false if the distance is too big so we don't need to check for the next neighbors.
    /// It will return true if the distance is short enough, even if the connection wasn't added to the HashSet
    pub fn add_connection(
        &mut self, 
        particle: (&Particle, f32), 
        neighbor: (&Particle, f32), 
        js_opts: &Opts
    ) -> bool
    {
        match Connection::new(particle, neighbor, js_opts) {
            Some(connection) => {
                self.connections_set.insert(connection);
                true
            }
            None => false
        }
    }

    pub fn convert_hashset_to_vec(&mut self) {
        self.connections_set
            .iter()
            .enumerate()
            .for_each(|(index, connection)| {
                self.connections_vec[index] = connection.clone();
            });
    }

    pub fn get_connections_vec_ptr(&mut self) -> *const Connection {
        self.connections_vec.as_ptr()
    }

    pub fn get_vec_len(&mut self) -> usize {
        self.connections_set.len()
    }
}