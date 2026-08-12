# Google Search Console Setup Guide for Kōzo Los Angeles

## Step 1: Access Google Search Console
**Link:** https://search.google.com/search-console/about

## Step 2: Add Property
1. Go to **Search Console**
2. Click **+ Create property**
3. Select **URL prefix** (recommended for single domain)
4. Enter: `https://kozousa.com`

## Step 3: Verify Ownership
You have already added the verification meta tag. You can verify using:

### Method 1: Meta Tag (Already Added ✅)
```
<meta name="google-site-verification" content="BX4iPAsfnQttyY3NO7ZiXgo7gN1cC6l9TVnkyLj0gmg" />
```
This is already in your `app/layout.tsx`

### Method 2: HTML File (Alternative)
You already uploaded `google161d49239b10ca97.html` to your project root.

## Step 4: Submit Sitemap

**Sitemap URL:** https://kozousa.com/sitemap.xml

**How to submit:**
1. In Google Search Console, go to **Sitemaps** (left menu)
2. Enter sitemap URL: `https://kozousa.com/sitemap.xml`
3. Click **Submit**

## Step 5: Submit Robots.txt

**Robots.txt URL:** https://kozousa.com/robots.txt

**How to check:**
1. In Google Search Console, go to **Settings** → **Crawl Stats**
2. Google should automatically read your `robots.txt`

## Step 6: Key URLs to Monitor

### Essential URLs:
- **Home Page:** https://kozousa.com
- **Careers Page:** https://kozousa.com/careers
- **Sitemap:** https://kozousa.com/sitemap.xml
- **Robots.txt:** https://kozousa.com/robots.txt
- **Manifest:** https://kozousa.com/site.webmanifest
- **Favicon:** https://kozousa.com/favicon.ico

## Step 7: Setup Tasks

After verification, complete these in Search Console:

### 1. **Performance** (Left Menu)
- Check impressions, clicks, CTR
- Monitor Core Web Vitals
- View clicked queries

### 2. **Coverage** (Left Menu)
- Check for indexing errors
- Ensure all pages are indexed

### 3. **Enhancements**
- Add Rich Results (already have JSON-LD structured data)
- Check Mobile Usability

### 4. **Settings**
- Set Preferred Domain (https://kozousa.com)
- Set Crawl Rate if needed
- Verify all sitemaps submitted

## Step 8: Core Web Vitals Monitoring

Google will show:
- **Largest Contentful Paint (LCP)** - aim for < 2.5s
- **First Input Delay (FID)** - aim for < 100ms
- **Cumulative Layout Shift (CLS)** - aim for < 0.1

We've optimized your site for these!

## Step 9: URL Inspection Tool

To manually test indexing:
1. Go to **URL Inspection** (Search icon in menu)
2. Enter: `https://kozousa.com`
3. Click **Request Indexing** button
4. Repeat for `/careers`

## Step 10: Monitor Regularly

### Weekly Tasks:
- Check Performance metrics
- Review new queries
- Monitor crawl errors

### Monthly Tasks:
- Review rankings for target keywords
- Check mobile usability
- Analyze user behavior

## Important Links Summary

| Item | URL |
|------|-----|
| **Google Search Console** | https://search.google.com/search-console/about |
| **Property:** | https://search.google.com/search-console/property/https://kozousa.com |
| **Submit Sitemap** | https://search.google.com/search-console/sitemaps?resource_id=https://kozousa.com |
| **Robots.txt Checker** | https://search.google.com/search-console/settings/checkcrawlstats?resource_id=https://kozousa.com |
| **URL Inspection** | https://search.google.com/search-console/inspect?resource_id=https://kozousa.com |
| **Coverage Report** | https://search.google.com/search-console/coverage?resource_id=https://kozousa.com |
| **Performance** | https://search.google.com/search-console/performance/search-analytics?resource_id=https://kozousa.com |

## Verification Status

✅ **Meta Tag Added:** BX4iPAsfnQttyY3NO7ZiXgo7gN1cC6l9TVnkyLj0gmg
✅ **HTML File Uploaded:** google161d49239b10ca97.html
✅ **Sitemap Created:** https://kozousa.com/sitemap.xml
✅ **Robots.txt Created:** https://kozousa.com/robots.txt
✅ **JSON-LD Schema:** Added to homepage
✅ **Mobile Optimization:** Complete
✅ **Security Headers:** X-Content-Type-Options, X-Frame-Options

---

**Next Steps:**
1. Go to https://search.google.com/search-console/about
2. Add property: https://kozousa.com
3. Verify using meta tag (already added)
4. Submit sitemap: https://kozousa.com/sitemap.xml
5. Submit robots.txt
6. Request URL indexing for homepage and /careers
