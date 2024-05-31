import { Page } from "@playwright/test";
import fs from "fs";
import sharp from "sharp";

export const createScreenshot = async (name: string, page: Page, locale: string, colorScheme: string) => {
  // Take a screenshot
  const buffer = await page.screenshot({
    path: `screenshots/${locale}/${colorScheme}/${name}.png`,
  });

  // Create folder if not exists
  if (!fs.existsSync(`screenshots/${locale}/${colorScheme}/chrome-store`)) {
    fs.mkdirSync(`screenshots/${locale}/${colorScheme}/chrome-store`);
  }

  // Create store screenshot
  await sharp(`screenshots/chrome-template-${colorScheme}.png`)
    .composite([{ input: buffer, top: 80, left: 828 }])
    .toFile(`screenshots/${locale}/${colorScheme}/chrome-store/${name}.png`);
};
