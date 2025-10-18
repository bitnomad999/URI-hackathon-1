# 🚀 Deployment Guide

## GitHub Pages Deployment (Recommended for Personal Use)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/fossnik/URI-hackathon-1`
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/docs`
5. Click **Save**

### Step 2: Wait for Deployment

GitHub will automatically deploy your site. This takes 1-2 minutes.

### Step 3: Access Your Site

Your site will be available at:
```
https://fossnik.github.io/URI-hackathon-1/
```

### Step 4: Share with Users

Users just need to:
1. Visit the URL
2. Get their own Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Enter the key and start extracting events!

---

## Node.js Server Deployment (For Team Use)

If you want to deploy the Node.js version with a shared API key, use one of these services:

### Option 1: Vercel (Easiest, Free)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variable in Vercel dashboard:
   - Go to your project settings
   - Add `GEMINI_API_KEY` with your API key

### Option 2: Render (Free Tier)

1. Create account at [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run web`
5. Add Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key
6. Deploy!

### Option 3: Railway

1. Create account at [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Add environment variable: `GEMINI_API_KEY`
5. Railway auto-detects Node.js and deploys

---

## Custom Domain (Optional)

### For GitHub Pages:

1. Go to **Settings** → **Pages**
2. Enter your custom domain
3. Add DNS records as instructed

### For Vercel/Render/Railway:

Each platform has documentation for custom domains in their settings.

---

## Environment Variables

If deploying the Node.js version, set this environment variable:

```
GEMINI_API_KEY=your_api_key_here
```

**Never commit your API key to Git!** The `.gitignore` file already protects your `.env` file.

---

## Monitoring & Limits

### Free Tier Limits:

- **GitHub Pages**: Unlimited static hosting
- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month free
- **Railway**: $5 free credit/month

### API Limits:

Check your Gemini API usage at [Google AI Studio](https://aistudio.google.com/)

---

## Troubleshooting

### GitHub Pages shows 404
- Make sure you selected `/docs` folder, not root
- Wait 2-3 minutes after enabling
- Clear browser cache

### Node.js deployment fails
- Check Node.js version is 18+
- Verify all dependencies are in `package.json`
- Check environment variable is set

### API errors
- Verify API key is correct
- Check quota hasn't been exceeded
- Try generating a new key

---

**Need help?** Open an issue on GitHub!

