import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Lovable App",
          short_name: "Lovable",
          description: "Lovable Generated Project",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "/__l5e/assets-v1/f07ba323-b911-4b49-b63e-e1220330a276/candidate.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/__l5e/assets-v1/f07ba323-b911-4b49-b63e-e1220330a276/candidate.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/__l5e/assets-v1/f07ba323-b911-4b49-b63e-e1220330a276/candidate.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
  },
});
