/// <reference types="vite/client" />

// Declare module types for GLB/GLTF files with ?url suffix
declare module '*.glb?url' {
  const src: string;
  export default src;
}

declare module '*.gltf?url' {
  const src: string;
  export default src;
}
