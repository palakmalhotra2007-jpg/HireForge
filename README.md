This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Streamlit interface

The same evaluation API can also be used through the Streamlit interface. Start Next.js first, then run:

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

The Streamlit app opens at [http://localhost:8501](http://localhost:8501). Set `INTERVIEW_PANEL_API_URL` when the Next.js API is hosted at a different URL.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment Guide

This project consists of two deployable components: the **Next.js Web App & API Backend** and the **Streamlit Interface**.

### 1. Deploying the Next.js API & Web App (Vercel)
The easiest way to deploy the Next.js backend and web frontend is using **Vercel**:
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Select your repository.
4. Under **Environment Variables**, add the following keys:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `GEMINI_MODEL`: `gemini-3.5-flash-lite` (or another model of your choice).
5. Click **Deploy**.
6. Once deployed, note down your production domain (e.g., `https://ai-interview-panel.vercel.app`).

> [!NOTE]
> All Next.js API routes are pre-configured with `export const maxDuration = 60;` to ensure they run up to 60 seconds. This avoids the default 10-second serverless timeout during long-running LLM debate operations.

---

### 2. Deploying the Streamlit Interface (Streamlit Cloud)
To deploy the Python Streamlit interface:
1. Go to [Streamlit Community Cloud](https://share.streamlit.io/) and log in.
2. Click **Create App** and link it to your GitHub repository.
3. Select the branch and set **Main file path** to `streamlit_app.py`.
4. (Optional but Recommended) Under **Advanced Settings**, add the Next.js URL to the app's Secrets:
   ```toml
   INTERVIEW_PANEL_API_URL = "https://your-nextjs-app.vercel.app"
   ```
5. Click **Deploy**.

> [!TIP]
> If you do not configure the `INTERVIEW_PANEL_API_URL` environment variable/secret, the Streamlit app sidebar contains an editable **Next.js API URL** field where you can paste your Vercel deployment URL at runtime, along with a **Test Connection** button to verify connectivity.
