export const EARTH_RADIUS_KM = 6371.0084;

// Visual scaling factors for the 3D scene
export const GLOBAL_SCALE_DIVISOR = 30; // Divide all planetary and solar radii by this so they fit on screen
export const PLANET_SCALE_MULTIPLIER = 12; // Boost planet sizes artificially so they are visible
export const DISTANCE_SCALE = 0.00000005; // Scale down the millions of kilometers of orbital distance
export const SUN_BUFFER = 4; // The minimum distance to push planets outside the massive sun mesh

// Animation scaling factors
export const ORBIT_SPEED_MULTIPLIER = 5; // Slowed down for easier viewing
export const ROTATION_SPEED_MULTIPLIER = 15; // Slowed down planet rotation
