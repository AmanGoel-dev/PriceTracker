"use server";

import Product from "../models/product.model";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../scraper/mongoose";

export async function ScrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;
    const existingProduct = Product.findOne({ url: scrapedProduct.url });
    connectToDB();
  } catch (error: any) {
    throw new Error(`failed to create/update product':${error.message}`);
  }
}
