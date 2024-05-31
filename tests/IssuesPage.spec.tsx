import { test } from "../fixtures/chromeExtension";
import { createScreenshot } from "../screenshots/screenshot";

test("Start timer", async ({ issuesPage: page, locale, colorScheme }) => {
  // Wait for the first issue to be rendered
  await page.waitForSelector("[role=listitem][data-type='issue']");

  // Start one of the first 3 timers
  const issues = await page.$$("[role=listitem][data-type='issue']");
  const issue = issues[Math.min(Math.floor(Math.random() * 3), issues.length - 1)];
  await (await issue.$("[data-type='start-timer']"))?.click();

  // Wait random time
  await page.waitForTimeout(Math.floor(Math.random() * 1000 * 5));

  // Take a screenshot
  createScreenshot("issues", page, locale!, colorScheme!);
});

test("Search by text", async ({ issuesPage: page, locale, colorScheme }) => {
  // Wait for the first issue to be rendered
  await page.waitForSelector("[role=listitem][data-type='issue']");

  // Activate search
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyF");
  await page.keyboard.up("Control");

  // Search for "dynamic"
  await page.fill("input[type=search]", "dynamic");

  // Wait for the first issue to be rendered
  await page.waitForSelector("[role=listitem][data-type='issue']");

  // Take a screenshot
  createScreenshot("issues-search", page, locale!, colorScheme!);
});

test("Add spent time", async ({ issuesPage: page, locale, colorScheme }) => {
  // Click on the first issue done-timer button to add spent time
  await page.click('[role="button"][data-type="done-timer"]');

  // Wait for modal
  await page.waitForSelector("role=dialog");

  // Fill form
  await page.fill('input[name="hours"]', (1 + Math.random() * 3).toFixed(2));
  await page.fill('input[name="comments"]', "Added new feature");

  // Focus on submit button
  await page.focus('button[type="submit"]');

  // Take a screenshot
  createScreenshot("issues-add-spent-time", page, locale!, colorScheme!);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for modal to close
  await page.waitForSelector("role=dialog", { state: "detached" });
});

test("Open issue context menu", async ({ issuesPage: page, locale, colorScheme }) => {
  // Open context menu on the first issue
  await page.click("[role=listitem][data-type='issue']", {
    button: "right",
    position: { x: 80, y: 15 },
  });

  // Wait for context menu
  await page.waitForSelector("role=menu");

  // Take a screenshot
  createScreenshot("issues-context-menu", page, locale!, colorScheme!);
});
