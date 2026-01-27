// vite.config.ts
import { defineConfig } from "file:///C:/GithubNextjs/2025/AdmissionPortalNew/new_admission_portal/node_modules/vite/dist/node/index.js";
import react from "file:///C:/GithubNextjs/2025/AdmissionPortalNew/new_admission_portal/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///C:/GithubNextjs/2025/AdmissionPortalNew/new_admission_portal/node_modules/@svgr/rollup/dist/index.js";
import flowbiteReact from "file:///C:/GithubNextjs/2025/AdmissionPortalNew/new_admission_portal/node_modules/flowbite-react/dist/plugin/vite.js";
var __vite_injected_original_dirname = "C:\\GithubNextjs\\2025\\AdmissionPortalNew\\new_admission_portal";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-tsx",
          setup(build) {
            build.onLoad(
              { filter: /src\\.*\.js$/ },
              async (args) => ({
                loader: "tsx",
                contents: await fs.readFile(args.path, "utf8")
              })
            );
          }
        }
      ]
    }
  },
  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],
  plugins: [svgr(), react(), flowbiteReact()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxHaXRodWJOZXh0anNcXFxcMjAyNVxcXFxBZG1pc3Npb25Qb3J0YWxOZXdcXFxcbmV3X2FkbWlzc2lvbl9wb3J0YWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXEdpdGh1Yk5leHRqc1xcXFwyMDI1XFxcXEFkbWlzc2lvblBvcnRhbE5ld1xcXFxuZXdfYWRtaXNzaW9uX3BvcnRhbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovR2l0aHViTmV4dGpzLzIwMjUvQWRtaXNzaW9uUG9ydGFsTmV3L25ld19hZG1pc3Npb25fcG9ydGFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuaW1wb3J0IGZsb3diaXRlUmVhY3QgZnJvbSBcImZsb3diaXRlLXJlYWN0L3BsdWdpbi92aXRlXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgIHNyYzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgICBsb2FkZXI6ICd0c3gnLFxyXG4gICAgICAgIGluY2x1ZGU6IC9zcmNcXC8uKlxcLnRzeD8kLyxcclxuICAgICAgICBleGNsdWRlOiBbXSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2xvYWQtanMtZmlsZXMtYXMtdHN4JyxcclxuICAgICAgICAgICAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZC5vbkxvYWQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGZpbHRlcjogL3NyY1xcXFwuKlxcLmpzJC8gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChhcmdzKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlcjogJ3RzeCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG5cclxuICAgIFxyXG4gICAgLy8gcGx1Z2luczogW3JlYWN0KCksc3Zncih7XHJcbiAgICAvLyAgIGV4cG9ydEFzRGVmYXVsdDogdHJ1ZVxyXG4gICAgLy8gfSldLFxyXG5cclxuICAgIHBsdWdpbnM6IFtzdmdyKCksIHJlYWN0KCksIGZsb3diaXRlUmVhY3QoKV0sXHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1gsU0FBUyxvQkFBb0I7QUFDN1ksT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFMMUIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNqQztBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ2Q7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLGdCQUFnQjtBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ0w7QUFBQSxVQUNJLE1BQU07QUFBQSxVQUNOLE1BQU0sT0FBTztBQUNULGtCQUFNO0FBQUEsY0FDRixFQUFFLFFBQVEsZUFBZTtBQUFBLGNBQ3pCLE9BQU8sVUFBVTtBQUFBLGdCQUNiLFFBQVE7QUFBQSxnQkFDUixVQUFVLE1BQU0sR0FBRyxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQUEsY0FDakQ7QUFBQSxZQUNKO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFBLFNBQVMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUM5QyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
