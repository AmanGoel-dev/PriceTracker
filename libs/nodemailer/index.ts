import { EmailProductInfo, Notification, NotificationType } from "@/Types";
import nodemailer from "nodemailer";
export const THRESHOLD_PERCENTAGE = 40; // Example threshold percentage for discount notifications
export const generateEmailBody = (
  product: EmailProductInfo,
  type: NotificationType
) => {
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}.....`
      : `${product.title}`;

  let subject = "";
  let body = "";
  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
        <div>
          <h2>Welcome to PriceWise 🚀</h2>
          <p>You’ve successfully started tracking ${product.title}.</p>
          <p>Here’s a preview of how your future updates will look:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} is back in stock!</h3>
            <p>Good news! ${product.title} is now back in stock.</p>
            <p>Don’t miss your chance - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Stay tuned for more updates on ${product.title} and other items you’re tracking with us.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Great news! ${product.title} is available again!</h4>
          <p>Hurry and grab yours before it sells out once more!</p>
          <p>Check the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Price Drop Alert! ${product.title} just hit its lowest price yet!</h4>
          <p>Don’t miss this deal - <a href="${product.url}" target="_blank" rel="noopener noreferrer">grab it now</a>.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Awesome! ${product.title} is now discounted by more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Act fast and get yours from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }
  return { subject, body };
};
