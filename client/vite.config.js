// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [tailwindcss(), react()], // <- tailwind pehle
// });

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [tailwindcss(), react()], // <- tailwind pehle
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "809750efbf70.ngrok-free.app", // <- yahan apna ngrok domain add karo
    ],
  },
});

