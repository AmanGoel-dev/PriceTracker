import Product from "@/libs/models/product.model";
import { generateEmailBody, sendEmail } from "@/libs/nodemailer";
import { scrapeAmazonProduct } from "@/libs/scraper";
import { connectToDB } from "@/libs/scraper/mongoose";
import {
  getAveragePrice,
  getEmailNotificationType,
  getHighestPrice,
  getLowestPrice,
} from "@/libs/util";

import { url } from "inspector";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find();
    if (!products) throw new Error("No products found");
    // scraping the products and updating the database
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
        if (!scrapedProduct) throw new Error("failed to scrape product");
        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };
        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          { $set: product }
        );

        // getting the email notification type to send in email
        const emailNotificationType = getEmailNotificationType(
          scrapedProduct,
          product
        );
        if (emailNotificationType !== "Nothing") {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
            image: updatedProduct.image,
          };
          const emailContent = generateEmailBody(
            productInfo,
            emailNotificationType
          );
          // getting the users email and sending the email to them
          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );
          await sendEmail(emailContent, userEmails);
        }
        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "Products updated successfully",
      data: updatedProducts,
    });
  } catch (error) {
    console.error("Error updating products:", error);
  }
}
