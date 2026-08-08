import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Ensure relative paths for GitHub Pages subpath deployment
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
                account: 'account.html',
            },
        },
    },
    server: {
        port: 3000,
    }
});
