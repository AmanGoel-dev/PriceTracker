import axios from "axios";
import * as cheerio from "cheerio";
export async function scrapeAmazonProduct(url: string) {
  const apiKey = process.env.SCRAPER_API_KEY;
  const apiurl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
    url
  )}`;

  try {
    const response = await axios.get(apiurl);
    console.log(response.data);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = $(".a-price-whole").first().text().trim();
    console.log(title, currentPrice);
  } catch (error) {}
}
