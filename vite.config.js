import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

// Helper to detect your LAN IP automatically
function getLocalExternalIP() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

const host = getLocalExternalIP()

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // allows access from phone
    port: 5173,
    hmr: {
      host,          // uses your LAN IP instead of localhost
      protocol: 'ws'
    }
  }
})
