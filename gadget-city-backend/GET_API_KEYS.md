# 📱 GET FREE API KEYS FOR REAL PHONE IMAGES

## 1. 📸 Unsplash API (Best Quality)
**Website:** https://unsplash.com/developers
**Free Tier:** 50 requests/hour, 1000 requests/day

**Steps:**
1. Go to https://unsplash.com/developers
2. Click "Join for free" or "Login"
3. Go to "API Keys" section
4. Create a new app
5. Copy your "Access Key"
6. Add to your `.env` file:
   ```
   UNSPLASH_ACCESS_KEY=your_key_here
   ```

## 2. 🖼️ Pexels API (Good Quality)
**Website:** https://www.pexels.com/api/
**Free Tier:** 200 requests/hour, 20,000 requests/month

**Steps:**
1. Go to https://www.pexels.com/api/
2. Click "Get Started"
3. Create account or login
4. Go to API dashboard
5. Copy your API key
6. Add to your `.env` file:
   ```
   PEXELS_API_KEY=your_key_here
   ```

## 3. 🎨 Pixabay API (Decent Quality)
**Website:** https://pixabay.com/api/docs/
**Free Tier:** 100 requests/hour, 5000 requests/day

**Steps:**
1. Go to https://pixabay.com/api/docs/
2. Click "Get API Key"
3. Login or create account
4. Copy your API key
5. Add to your `.env` file:
   ```
   PIXABAY_API_KEY=your_key_here
   ```

## 🔧 Update Your .env File

Add these lines to your `.env` file:
```env
# Image API Keys
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
PEXELS_API_KEY=your_pexels_key_here
PIXABAY_API_KEY=your_pixabay_key_here
```

## 🚀 Run the Image Fetcher

Once you have the API keys:

```bash
cd "C:\Users\NIGHTSTUDIOS\OneDrive\Documents\PREJET\gadget-city-backend"
node fetch-phone-images.js
```

This will:
- ✅ Fetch real phone images from multiple sources
- ✅ Save image URLs to `phone-images.json`
- ✅ Show you which images were found for each phone
- ✅ Generate updated seed data structure

## 📋 What You'll Get

For each phone model, you'll get:
- **High-quality images** (800px+ width)
- **Thumbnail URLs** for faster loading
- **Photographer credits** (required by APIs)
- **Multiple image sources** for reliability

## 💡 Example Output

```json
{
  "iPhone 15 Pro Max": [
    {
      "url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
      "thumbnail": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      "alt": "iPhone 15 Pro Max - Space Black iPhone on white surface",
      "source": "unsplash",
      "photographer": "John Doe"
    }
  ]
}
```

## ⚡ Next Steps

1. **Get your free API keys** (5 minutes)
2. **Run the fetcher script** to get real images
3. **Update your seed data** with the real image URLs
4. **Test your backend** with actual phone images

The images will be high-quality, professional photos that you can use for your e-commerce platform!
