"use server";

import { scrapeAmazonProduct } from "../scraper";

export async function ScrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    const scrapProduct = await scrapeAmazonProduct(productUrl);
  } catch (error: any) {
    throw new Error(`failed to create/update product':${error.message}`);
  }
}
