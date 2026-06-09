# 🌌 Solar System Explorer: The Simulation

A professional, interactive 3D simulation of our celestial neighborhood. This project evolves from a static dashboard into a dynamic, state-driven space simulation using **React Three Fiber (R3F)**.

## 🎯 Revised Project Vision
The Solar Explorer is now a **Full System Simulation**. Instead of viewing one planet at a time, the user explores a complete solar system where planets orbit the Sun in real-time. Interaction is handled via 3D Raycasting, allowing users to "click" planets in space to retrieve their NASA data.

---

## 🏗️ Advanced Architecture

### Interaction: Raycasting vs. HTML
- **The Old Way**: Clicking a button in a 2D sidebar.
- **The Simulation Way**: Clicking the 3D planet directly.
- **The Intuition**: Raycasting is like firing a "laser beam" from your mouse into the 3D world. If the laser hits a planet, R3F tells us which one was hit. This makes the experience feel "physical" and immersive.

### Orbital Mechanics
- Planets move along elliptical or circular paths based on their real distance from the Sun.
- **Source of Truth**: The `PlanetContext` now manages the "Focus Planet"—the one the camera is currently following.

---

## 🚀 The Simulation Roadmap

### Phase 1: The Heliosphere (Current)
- [x] **Global State**: `PlanetContext` for active selection.
- [x] **Data Brain**: `useFetch` hook for real-time NASA telemetry.
- [ ] **The Sun**: A central light source with a high-intensity "Glow" (Bloom effect).
- [ ] **Orbital Paths**: Rendering 3D lines (Torus or Line) to show the path of each planet.

### Phase 2: System Dynamics
- [ ] **Multi-Planet Render**: Move from a single sphere to rendering all 8 planets simultaneously.
- [ ] **Orbital Loop**: Use `useFrame` to make planets revolve around the Sun at relative speeds.
- [ ] **Raycasting Interaction**: Implement `onClick` events on 3D meshes to update the `activePlanet` context.

### Phase 3: The Explorer Experience
- [ ] **Cinematic Camera**: Smoothly transition the camera to "zoom in" on a clicked planet using `drei`'s `CameraControls`.
- [ ] **The HUD Overlay**: A futuristic 2D interface that displays the focused planet's data.
- [ ] **Post-Processing**: Adding "Bloom" for the sun and "Motion Blur" for realistic space travel.

---

## 🛠️ Technical Stack
- **Framework**: React (Vite)
- **3D Engine**: `react-three-fiber` + `three` + `drei`
- **State**: Context API (Selection & Focus)
- **Math**: Sine/Cosine for orbital paths.
