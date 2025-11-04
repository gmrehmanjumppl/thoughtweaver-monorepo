import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@thoughtweaver/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@thoughtweaver/types': path.resolve(__dirname, '../../packages/types/src'),
      '@thoughtweaver/config': path.resolve(__dirname, '../../packages/config/src'),
      '@thoughtweaver/utils': path.resolve(__dirname, '../../packages/utils/src'),
      // Asset aliases (for Figma-generated imports)
      'figma:asset/dd66067f40eb374e0f675639f890289fb607d8f0.png': path.resolve(__dirname, './src/assets/dd66067f40eb374e0f675639f890289fb607d8f0.png'),
      'figma:asset/b20d2ead8618218f3f745bbfe7fbfca414f24e8e.png': path.resolve(__dirname, './src/assets/b20d2ead8618218f3f745bbfe7fbfca414f24e8e.png'),
      'figma:asset/66df02ed14e51fbca9624ccbf86d6c66471695a9.png': path.resolve(__dirname, './src/assets/66df02ed14e51fbca9624ccbf86d6c66471695a9.png'),
      'figma:asset/554fa3f225599e9d74085e980bec2674888447d2.png': path.resolve(__dirname, './src/assets/554fa3f225599e9d74085e980bec2674888447d2.png'),
      'figma:asset/2e1615857ca91e0983178c6d9454a9bc816ba468.png': path.resolve(__dirname, './src/assets/2e1615857ca91e0983178c6d9454a9bc816ba468.png'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
});

