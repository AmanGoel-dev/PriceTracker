"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../scraper/mongoose";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../util";
import toast from "react-hot-toast";

export async function ScrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    connectToDB();
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;
    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );
    // this fetch the new data as the data is change for the /prodcuts/newproductid page
    revalidatePath(`/products/${newProduct.id}`);
  } catch (error: any) {
    throw new Error(`failed to create/update product':${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    // always have to make a db connection in each fuction as they work independtly no long live server
    // connection is there like express its like hono
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    toast.error("Error occured while fetching the item");
    console.log(error);
  }
}
export async function getAllProducts() {
  try {
    connectToDB();
    const prodcuts = Product.find();
    return prodcuts;
  } catch (error) {
    console.log(error);
  }
}
export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();
    //cehcking wheter this product id related product is in the db or not
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const similarProduct = await Product.find({
      _id: { $ne: productId },
    }).limit(3);
    return similarProduct;
  } catch (error) {
    console.log(error);
  }
}
