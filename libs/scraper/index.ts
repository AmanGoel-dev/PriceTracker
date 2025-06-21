import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../util";
import { json } from "stream/consumers";
import { Erica_One } from "next/font/google";
export async function scrapeAmazonProduct(url: string) {
  const BulletPoints: string[] = [];
  const apiKey = process.env.SCRAPER_API_KEY;
  const apiurl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
    url
  )}`;

  try {
    const response = await axios.get(apiurl);
    console.log(response.data);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";
    const originalPrice = $(".a-price.a-text-price span.a-offscreen")
      .first()
      .text()
      .trim()
      .replace(/[^\d.]/g, "");

    // this return us url of the image
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    // here changing the string url to the object keys
    const imageurls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    // getting all the elements and then extracting each elemenet data and put it in array
    const paraElements = $(
      ".a-unordered-list.a-vertical.a-spacing-mini li span.a-list-item"
    ).each((_, ele) => {
      const text = $(ele).text().trim();
      if (text) BulletPoints.push(text);
    });

    const data = {
      title,
      image: imageurls[0],
      currency: currency || "₹",
      url,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      productInfo: BulletPoints,
      category: "category",
      isOutOFStock: outOfStock,
      reviewsCount: 100,
      stars: 4.5,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };
    return data;
  } catch (error) {
    console.log(error);
  }
}
