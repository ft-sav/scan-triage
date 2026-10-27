# Vercel Deployment Guide for Scam Triage

This application is fully equipped with hybrid full-stack support:
1. **Local / Docker / AI Studio Dev Server**: Runs on `node server.ts` with Vite middlewares.
2. **Vercel Serverless Production**: Runs via `vercel.json` and `api/index.ts` serverless functions.

---

## 🚀 1-Minute Vercel Setup

When you push this repository to GitHub and import it into Vercel:

### Step 1: Add your Gemini API Key in Vercel
1. In your **Vercel Project Dashboard**, navigate to **Settings** > **Environment Variables**.
2. Add a new variable:
   - **Key**: `GEMINI_API_KEY` (or `API_KEY`)
   - **Value**: Your Google Gemini API Key (e.g. `AIzaSy...`)
   - **Environments**: Check **Production**, **Preview**, and **Development**.
3. Click **Save**.

### Step 2: Deploy / Redeploy
- If you just added the environment variable, trigger a redeploy from **Deployments** > **Redeploy** (ensure "Use existing Build Cache" is unchecked so the new environment variables take effect).

---

## 🛡️ Built-in High-Availability Protections

The backend is engineered to ensure Gemini is always available and resilient:
- **Multi-Key Resolution**: Automatically detects `GEMINI_API_KEY`, `API_KEY`, `GOOGLE_API_KEY`, or `VITE_GEMINI_API_KEY`.
- **Multi-Tier Model Failover**:
  1. `gemini-3.8-flash` (Primary high-intelligence forensic engine)
  2. `gemini-3.1-flash-lite` (Ultra-fast failover for high-demand spikes)
  3. `gemini-flash-latest` (Direct alias backup)
- **Automatic Retries & Extended Timeout**: 25-second serverless timeout guard prevents premature fallbacks during cold starts.
- **Client Auto-Retry**: Automatically retries requests if a temporary network blip or cold start occurs.
