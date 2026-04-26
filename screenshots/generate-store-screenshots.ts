import fs from "fs";
import path from "path";
import sharp from "sharp";

const LANGUAGES = ["en", "de", "fr", "ru"] as const;
type Language = (typeof LANGUAGES)[number];

const SCREENSHOT_WIDTH = 1280;
const SCREENSHOT_HEIGHT = 800;
const THUMBNAIL_WIDTH = 440;
const THUMBNAIL_HEIGHT = 280;
const BANNER_WIDTH = 1280;
const BANNER_HEIGHT = 640;

const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 548;

const RADIUS = 12;
const BORDER_BLUR = 18;
const BORDER_GRAD = ["#1e40af", "#3b82f6", "#93c5fd"];

const THEME = {
  bgStart: "#0f172a",
  bgEnd: "#1e293b",
  accent: "#3b82f6",
  accentGlow: "rgba(59, 130, 246, 0.15)",
  text: "#f8fafc",
  textSub: "#94a3b8",
};

interface Messages {
  [key: string]: { message: string };
}

function loadMessages(locale: Language): Messages {
  const filePath = path.join("public", "_locales", locale, "messages.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Messages;
}

function getHeadline(titleKey: string, subtitleKey: string, messages: Messages): { title: string; subtitle: string } {
  return {
    title: messages[titleKey]?.message ?? titleKey,
    subtitle: messages[subtitleKey]?.message ?? "",
  };
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function popupPath(locale: Language, testFile: string, testName: string): string {
  return path.join("tests", "screenshots", `Chrome-popup-dark-${locale}`, testFile, `${testName}.png`);
}

function backgroundSvg(w: number, h: number): string {
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${THEME.bgStart}" />
      <stop offset="100%" stop-color="${THEME.bgEnd}" />
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${THEME.accentGlow}" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" />
  <rect width="${w}" height="${h}" fill="url(#glow)" />
</svg>`;
}

function headlineSvg(w: number, h: number, title: string, subtitle: string, iconPath: string, options: { x: number; y: number; iconSize?: number; titleSize?: number; subtitleSize?: number }): string {
  const iconSize = options.iconSize ?? 34;
  const titleSize = options.titleSize ?? 38;
  const subtitleSize = options.subtitleSize ?? 16;
  const x = options.x;
  const groupY = options.y;
  const iconTextGap = 12;
  const textX = x + iconSize + iconTextGap;

  const titleY = groupY + titleSize;
  const capTop = titleY - Math.round(titleSize * 0.72);
  const capHeight = Math.round(titleSize * 0.72);
  const iconY = capTop + Math.round((capHeight - iconSize) / 2);
  const subtitleY = titleY + subtitleSize + 10;
  const lineY = subtitleY + subtitleSize + 6;

  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${x}, ${iconY}) scale(${iconSize / 24})"
     stroke="${THEME.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    ${iconPath}
  </g>
  <text x="${textX}" y="${titleY}" font-family="Segoe UI, Arial, sans-serif" font-size="${titleSize}" font-weight="700" fill="${THEME.text}">
    ${escapeXml(title)}
  </text>
  <text x="${x}" y="${subtitleY}" font-family="Segoe UI, Arial, sans-serif" font-size="${subtitleSize}" font-weight="400" fill="${THEME.textSub}">
    ${escapeXml(subtitle)}
  </text>
  <rect x="${x}" y="${lineY}" width="50" height="3" rx="2" fill="${THEME.accent}" />
</svg>`;
}

function roundedMaskSvg(w: number, h: number, r: number): string {
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white" />
</svg>`;
}

function borderGradDefs(id: string): string {
  const [c0, c1, c2] = BORDER_GRAD;
  return `<defs>
        <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c0}"/>
          <stop offset="50%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>`;
}

async function roundImage(inputPath: string, w: number, h: number, r: number): Promise<Buffer> {
  const mask = Buffer.from(roundedMaskSvg(w, h, r));
  return sharp(inputPath)
    .resize(w, h)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function addScreenshotWithBorder(composites: sharp.OverlayOptions[], image: Buffer, top: number, left: number, imgW: number, imgH: number) {
  const sw = 14;
  const expand = sw / 2;
  const glowSvg = Buffer.from(
    `<svg width="${SCREENSHOT_WIDTH}" height="${SCREENSHOT_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${borderGradDefs("g")}
      <rect x="${left - expand}" y="${top - expand}" width="${imgW + sw}" height="${imgH + sw}"
            rx="${RADIUS + expand}" ry="${RADIUS + expand}"
            fill="none" stroke="url(#g)" stroke-width="${sw}" opacity="0.7"/>
    </svg>`
  );
  const glow = await sharp(glowSvg).blur(BORDER_BLUR).png().toBuffer();

  const crispSvg = Buffer.from(
    `<svg width="${SCREENSHOT_WIDTH}" height="${SCREENSHOT_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${borderGradDefs("g")}
      <rect x="${left - 0.5}" y="${top - 0.5}" width="${imgW + 1}" height="${imgH + 1}"
            rx="${RADIUS + 0.5}" ry="${RADIUS + 0.5}"
            fill="none" stroke="url(#g)" stroke-width="1" opacity="0.65"/>
    </svg>`
  );

  composites.push({ input: glow, top: 0, left: 0 });
  composites.push({ input: image, top, left });
  composites.push({ input: crispSvg, top: 0, left: 0 });
}

async function generateSinglePopup(
  outputPath: string,
  popup: { file: string; name: string },
  headline: { titleKey: string; subtitleKey: string; icon: string },
  locale: Language,
  messages: Messages
): Promise<boolean> {
  const ppPath = popupPath(locale, popup.file, popup.name);
  if (!fs.existsSync(ppPath)) {
    console.warn(`\x1b[31m  skip ${path.basename(outputPath)} — screenshot not found:\x1b[0m\n    ${ppPath}`);
    return false;
  }

  const hl = getHeadline(headline.titleKey, headline.subtitleKey, messages);
  const bg = Buffer.from(backgroundSvg(SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT));
  const composites: sharp.OverlayOptions[] = [];

  const ppScale = 1.2;
  const ppW = Math.round(POPUP_WIDTH * ppScale);
  const ppH = Math.round(POPUP_HEIGHT * ppScale);
  const ppLeft = SCREENSHOT_WIDTH - ppW - 140;
  const ppTop = Math.round((SCREENSHOT_HEIGHT - ppH) / 2);

  const ppRounded = await roundImage(ppPath, ppW, ppH, RADIUS);
  await addScreenshotWithBorder(composites, ppRounded, ppTop, ppLeft, ppW, ppH);

  composites.push({
    input: Buffer.from(
      headlineSvg(SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT, hl.title, hl.subtitle, headline.icon, {
        x: 60,
        y: Math.round(SCREENSHOT_HEIGHT / 2 - 90),
        titleSize: 38,
        subtitleSize: 16,
        iconSize: 34,
      })
    ),
    top: 0,
    left: 0,
  });

  await sharp(bg).composite(composites).png().toFile(outputPath);
  console.log(`\x1b[32m  created ${outputPath}\x1b[0m`);
  return true;
}

async function generateDualPopup(
  outputPath: string,
  popup1: { file: string; name: string },
  popup2: { file: string; name: string },
  headline: { titleKey: string; subtitleKey: string; icon: string },
  locale: Language,
  messages: Messages
): Promise<boolean> {
  const p1Path = popupPath(locale, popup1.file, popup1.name);
  const p2Path = popupPath(locale, popup2.file, popup2.name);
  const missing = [p1Path, p2Path].filter((p) => !fs.existsSync(p));
  if (missing.length > 0) {
    console.warn(`\x1b[31m  skip ${path.basename(outputPath)} — screenshots not found:\x1b[0m\n${missing.map((p) => `    ${p}`).join("\n")}`);
    return false;
  }

  const hl = getHeadline(headline.titleKey, headline.subtitleKey, messages);
  const bg = Buffer.from(backgroundSvg(SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT));
  const composites: sharp.OverlayOptions[] = [];

  const ppScale = 0.95;
  const ppW = Math.round(POPUP_WIDTH * ppScale);
  const ppH = Math.round(POPUP_HEIGHT * ppScale);
  const gap = 28;
  const popupsLeft = SCREENSHOT_WIDTH - (ppW * 2 + gap) - 80;
  const pp1Top = Math.round((SCREENSHOT_HEIGHT - ppH) / 2) - 20;
  const pp2Top = pp1Top + 40;

  const [pp1Rounded, pp2Rounded] = await Promise.all([roundImage(p1Path, ppW, ppH, RADIUS), roundImage(p2Path, ppW, ppH, RADIUS)]);
  await addScreenshotWithBorder(composites, pp1Rounded, pp1Top, popupsLeft, ppW, ppH);
  await addScreenshotWithBorder(composites, pp2Rounded, pp2Top, popupsLeft + ppW + gap, ppW, ppH);

  composites.push({
    input: Buffer.from(
      headlineSvg(SCREENSHOT_WIDTH, SCREENSHOT_HEIGHT, hl.title, hl.subtitle, headline.icon, {
        x: 50,
        y: Math.round(SCREENSHOT_HEIGHT / 2 - 90),
        titleSize: 36,
        subtitleSize: 15,
        iconSize: 32,
      })
    ),
    top: 0,
    left: 0,
  });

  await sharp(bg).composite(composites).png().toFile(outputPath);
  console.log(`\x1b[32m  created ${outputPath}\x1b[0m`);
  return true;
}

interface PromoImageOptions {
  canvasWidth: number;
  canvasHeight: number;
  pad: number;
  textAreaRight: number;
  iconSize: number;
  fontSize: number;
  lineGap: number;
  iconTextGap: number;
  outputSize?: { width: number; height: number };
}

async function generatePromoImage(outputPath: string, locale: Language, messages: Messages, opts: PromoImageOptions): Promise<boolean> {
  const { canvasWidth: cW, canvasHeight: cH, pad: PAD, textAreaRight, iconSize, fontSize, lineGap, iconTextGap } = opts;
  const scale = 2;

  const shotPaths = [
    popupPath(locale, "IssuesPage.spec.tsx", "Start-timer"),
    popupPath(locale, "IssuesPage.spec.tsx", "Add-spent-time"),
    popupPath(locale, "SettingsPage.spec.tsx", "Settings-page"),
  ] as const;

  const missing = shotPaths.filter((p) => !fs.existsSync(p));
  if (missing.length > 0) {
    console.warn(`\x1b[31m  skip ${path.basename(outputPath)} — screenshots not found:\x1b[0m\n${missing.map((p) => `    ${p}`).join("\n")}`);
    return false;
  }

  const appName = messages["extName"]?.message ?? "Redmine Time Tracking";

  const bg = Buffer.from(backgroundSvg(cW, cH));
  const composites: sharp.OverlayOptions[] = [];

  const ppH = Math.round(cH * 0.82);
  const ppW = Math.round(ppH * (POPUP_WIDTH / POPUP_HEIGHT));
  const frontLeft = cW - PAD - ppW;
  const frontTop = cH - PAD - ppH;
  const cardStep = Math.round((frontLeft - textAreaRight) / 2);
  const vertRange = frontTop - PAD;

  const stackConfigs = [
    { shot: 2, dx: -cardStep * 2, dy: -vertRange },
    { shot: 1, dx: -cardStep, dy: -Math.round(vertRange / 2) },
    { shot: 0, dx: 0, dy: 0 },
  ] as const;

  const stackedShots = await Promise.all(
    stackConfigs.map(async (cfg) => ({
      cfg,
      image: await roundImage(shotPaths[cfg.shot], ppW, ppH, RADIUS * scale),
    }))
  );

  for (const { cfg, image } of stackedShots) {
    const left = frontLeft + cfg.dx;
    const top = frontTop + cfg.dy;

    const borderSvg = Buffer.from(
      `<svg width="${ppW}" height="${ppH}" xmlns="http://www.w3.org/2000/svg">
        ${borderGradDefs(`b${cfg.shot}`)}
        <rect x="0.5" y="0.5" width="${ppW - 1}" height="${ppH - 1}"
              rx="${RADIUS * scale}" ry="${RADIUS * scale}"
              fill="none" stroke="url(#b${cfg.shot})" stroke-width="2" opacity="0.7"/>
      </svg>`
    );

    composites.push({ input: image, top, left });
    composites.push({ input: Buffer.from(borderSvg), top, left });
  }

  const nameParts = appName.split(" ");
  const midIdx = Math.ceil(nameParts.length / 2);
  const line1 = nameParts.slice(0, midIdx).join(" ");
  const line2 = nameParts.slice(midIdx).join(" ");

  const groupH = iconSize + iconTextGap + fontSize + (line2 ? lineGap + fontSize : 0);
  const groupTop = Math.round((cH - groupH) / 2);
  const textTop = groupTop + iconSize + iconTextGap;
  const centerX = Math.round(textAreaRight / 2);

  const icon = await sharp("public/icon/128.png").resize(iconSize, iconSize).png().toBuffer();
  composites.push({ input: icon, top: groupTop, left: centerX - Math.round(iconSize / 2) });

  composites.push({
    input: Buffer.from(
      `<svg width="${cW}" height="${cH}" xmlns="http://www.w3.org/2000/svg">
        <text x="${centerX}" y="${textTop + fontSize}" font-family="Segoe UI, Arial, sans-serif"
              font-size="${fontSize}" font-weight="700" fill="${THEME.text}" text-anchor="middle">${escapeXml(line1)}</text>
        ${
          line2
            ? `<text x="${centerX}" y="${textTop + fontSize + lineGap + fontSize}" font-family="Segoe UI, Arial, sans-serif"
              font-size="${fontSize}" font-weight="700" fill="${THEME.accent}" text-anchor="middle">${escapeXml(line2)}</text>`
            : ""
        }
      </svg>`
    ),
    top: 0,
    left: 0,
  });

  const composed = await sharp(bg).composite(composites).png().toBuffer();
  const output = opts.outputSize ? sharp(composed).resize(opts.outputSize.width, opts.outputSize.height).png() : sharp(composed);
  await output.toFile(outputPath);
  console.log(`\x1b[32m  created ${outputPath}\x1b[0m`);
  return true;
}

async function generateThumbnail(outputPath: string, locale: Language, messages: Messages): Promise<boolean> {
  return generatePromoImage(outputPath, locale, messages, {
    canvasWidth: THUMBNAIL_WIDTH * 2,
    canvasHeight: THUMBNAIL_HEIGHT * 2,
    pad: 20,
    textAreaRight: 300,
    iconSize: 56,
    fontSize: 30,
    lineGap: 6,
    iconTextGap: 14,
    outputSize: { width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT },
  });
}

async function generateBanner(outputPath: string, locale: Language, messages: Messages): Promise<boolean> {
  return generatePromoImage(outputPath, locale, messages, {
    canvasWidth: BANNER_WIDTH,
    canvasHeight: BANNER_HEIGHT,
    pad: 40,
    textAreaRight: Math.round(BANNER_WIDTH * 0.38),
    iconSize: 72,
    fontSize: 42,
    lineGap: 8,
    iconTextGap: 18,
  });
}

const ICON_ISSUES = `<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>`;
const ICON_TIMER = `<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>`;
const ICON_TIME = `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>`;
const ICON_SETTINGS = `<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>`;

interface StoreImage {
  filename: string;
  generate: (outputPath: string, locale: Language, messages: Messages) => Promise<boolean>;
}

const STORE_IMAGES: StoreImage[] = [
  {
    filename: "1.png",
    generate: (out, locale, messages) =>
      generateDualPopup(
        out,
        { file: "IssuesPage.spec.tsx", name: "Start-timer" },
        { file: "IssuesPage.spec.tsx", name: "Search-issues" },
        { titleKey: "screenshotIssuesTitle", subtitleKey: "screenshotIssuesSubtitle", icon: ICON_ISSUES },
        locale,
        messages
      ),
  },
  {
    filename: "2.png",
    generate: (out, locale, messages) =>
      generateDualPopup(
        out,
        { file: "TimersPage.spec.tsx", name: "Timers-page" },
        { file: "IssuesPage.spec.tsx", name: "Add-spent-time" },
        { titleKey: "screenshotTimersTitle", subtitleKey: "screenshotTimersSubtitle", icon: ICON_TIMER },
        locale,
        messages
      ),
  },
  {
    filename: "3.png",
    generate: (out, locale, messages) =>
      generateSinglePopup(
        out,
        { file: "TimePage.spec.tsx", name: "Time-page" },
        { titleKey: "screenshotTimeEntriesTitle", subtitleKey: "screenshotTimeEntriesSubtitle", icon: ICON_TIME },
        locale,
        messages
      ),
  },
  {
    filename: "4.png",
    generate: (out, locale, messages) =>
      generateDualPopup(
        out,
        { file: "IssuesPage.spec.tsx", name: "Create-issue" },
        { file: "IssuesPage.spec.tsx", name: "Edit-issue" },
        { titleKey: "screenshotManageIssuesTitle", subtitleKey: "screenshotManageIssuesSubtitle", icon: ICON_ISSUES },
        locale,
        messages
      ),
  },
  {
    filename: "5.png",
    generate: (out, locale, messages) =>
      generateSinglePopup(
        out,
        { file: "SettingsPage.spec.tsx", name: "Settings-page" },
        { titleKey: "screenshotSettingsTitle", subtitleKey: "screenshotSettingsSubtitle", icon: ICON_SETTINGS },
        locale,
        messages
      ),
  },
];

async function main() {
  for (const locale of LANGUAGES) {
    const messages = loadMessages(locale);
    const chromeDir = path.join("screenshots", "chrome", locale);
    fs.mkdirSync(chromeDir, { recursive: true });
    console.log(`[${locale}]`);
    await Promise.all(STORE_IMAGES.map((img) => img.generate(path.join(chromeDir, img.filename), locale, messages)));
  }

  const enMessages = loadMessages("en");

  const chromeRoot = path.join("screenshots", "chrome");
  console.log("[thumbnail]");
  await generateThumbnail(path.join(chromeRoot, "thumbnail.png"), "en", enMessages);

  const screenshotsRoot = path.join("screenshots");
  console.log("[banner]");
  await generateBanner(path.join(screenshotsRoot, "banner.png"), "en", enMessages);
}

main().catch(console.error);
