# 🛒 Amazon Price Tracker

This is a full-stack Amazon price tracker built with **Next.js**, using **ScraperAPI** and **Cheerio** to scrape live product data (price, title, availability, features) from Amazon product pages. Users can monitor price drops and optionally store product data.

---

## 🔧 Features

- ✅ Track real-time prices from Amazon
- ✅ Extract:
  - Product title
  - Current price
  - Original (MRP) price
  - Stock status
  - Bullet-point features
  - Product image
- ✅ Automatically cleans and formats prices (₹87,900 → 87900)
- ✅ Built using:
  - `Next.js` (App Router, Server Actions)
  - `ScraperAPI` to bypass Amazon bot detection
  - `Cheerio` for HTML parsing

---

## 🧱 Tech Stack

| Tool         | Role                           |
|--------------|--------------------------------|
| Next.js 14+  | React framework (with App Router) |
| TypeScript   | Static typing                  |
| ScraperAPI   | Scraping proxy for Amazon      |
| Cheerio      | HTML parsing like jQuery       |
| MongoDB      | (Optional) for storing user/product data |

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/amazon-price-tracker.git
cd amazon-price-tracker
npm install
