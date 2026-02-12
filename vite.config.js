import { defineConfig } from 'vite';

export default defineConfig({
    root: '.', // Start from root
    build: {
        outDir: 'dist', // Build output directory
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about.html',
                parish: 'parish.html',
                associations: 'associations.html',
            },
        },
    },
    server: {
        port: 3000,
    }
});
