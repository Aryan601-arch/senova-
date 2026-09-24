# 3D models

Drop `.glb` / `.gltf` files in this folder and load them with the `<Model />` component
(`components/three/model.tsx`). Files here are served from `/models/<file>.glb`.

Tips:
- Prefer `.glb` with Draco or Meshopt compression (e.g. `npx gltfjsx model.glb --transform`).
- Keep hero models under ~2 MB.
- Only use models you have the rights to (CC0 sources: Poly Haven, Kenney, Quaternius).
