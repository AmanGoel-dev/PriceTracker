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

import { NextResponse } from "next/server";
export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic"; // to make sure the route is dynamic and not static
export const revalidate = 0; // to make sure the route is not cached
export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find();
    if (!products) throw new Error("No products found");
    // scraping the products and updating the database
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
        if (!scrapedProduct) throw new Error("failed to scrape product");
        console.log(scrapedProduct);
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
          { url: currentProduct.url },
          product
        );

        // getting the email notification type to send in email
        const emailNotificationType = getEmailNotificationType(
          scrapedProduct,
          currentProduct
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
    return NextResponse.json(
      { message: "Error updating products", error: (error as Error).message },
      { status: 500 }
    );
  }
}
