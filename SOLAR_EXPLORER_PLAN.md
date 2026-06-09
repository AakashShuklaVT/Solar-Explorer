# 🌌 Solar System Explorer

A professional, interactive dashboard for exploring our celestial neighborhood. This project serves as a strategic bridge for developers transitioning from **Core React** to **React Three Fiber (R3F)**.

## 🎯 Project Vision
The Solar System Explorer focuses on the architectural pattern of using **Shared React State** to drive a **Multi-Visual Interface** (2D UI + 3D Canvas). We build in parallel to understand how React controls 3D space from day one.

---

## 🏗️ The "Bridge" Architecture (Why Context?)

### The Wrong Path: Prop Drilling
In a complex app, your hierarchy might look like this:
`App -> Dashboard -> Sidebar -> PlanetList -> PlanetButton`
If the `PlanetButton` needs to tell the `3DCanvas` (which is in a different branch) which planet was clicked, you'd have to pass a "callback function" up 4 levels and then down 3 levels. 
*   **The Pitfall**: This makes your components "messy" and hard to move. If you move the Sidebar, you break the whole chain.

### The Right Path: Context API
Context acts like a "Radio Station" (Broadcaster).
1.  **The Provider**: Broadcasts "Earth is selected".
2.  **The Sidebar**: Listens and highlights the Earth button.
3.  **The 3D Canvas**: Listens and zooms into the Earth model.
*   **The Intuition**: Any component, no matter how deep it is, can "tune in" to the data it needs without bothering its parents.

---

## 🚀 Parallel Roadmap

### Phase 1: The Foundation (The "Bridge")
- [ ] **Global State**: Set up `PlanetContext` to store the `activePlanet`.
- [ ] **Dual View**: Create a basic `Layout` with a 2D Sidebar and a 3D `<Canvas>`.
- [ ] **The Reactive Sphere**: Make a 3D sphere that changes color based on the selected planet in the sidebar.

### Phase 2: Data & Dynamics
- [ ] **Asynchronous Fetching**: Create a `useFetch` hook to get real data from the Solar System API.
- [ ] **Data Mapping**: Use API results to update UI text (2D) and Planet size/scale (3D).
- [ ] **Interactive HUD**: Build a "Fact Sheet" overlay that displays planetary metrics.

### Phase 3: Polish & Performance
- [ ] **Textures**: Map real NASA planetary textures onto R3F spheres.
- [ ] **Atmosphere & Lights**: Add realistic lighting and "glow" effects to the sun and planets.
- [ ] **Comparison Engine**: Side-by-side comparison of two planets in 3D space.

---

## 🛠️ Technical Stack
- **Framework**: React (Vite)
- **3D Engine**: `react-three-fiber` + `three` + `drei`
- **State**: Context API
- **Styling**: Vanilla CSS (Premium Space Theme)

---

## 📂 Directory Structure
```text
src/
├── components/       
│   ├── ui/           # 2D HTML Elements (Sidebar, HUD)
│   └── scene/        # 3D R3F Elements (Canvas, Planets, Stars)
├── context/          # PlanetContext (The Radio Station)
├── hooks/            # usePlanetData (API logic)
└── assets/           # Textures and Models
```
