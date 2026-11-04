import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contactHandler from './api/contact.js'

/** Serves api/contact.js during `npm run dev`; in production the host runs it */
function contactApi() {
  return {
    name: 'contact-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), 'TELEGRAM_'))
      server.middlewares.use('/api/contact', async (req, res) => {
        let body = ''
        for await (const chunk of req) body += chunk
        req.body = body
        await contactHandler(req, res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contactApi()],
})
