import fs from "fs";
import path from "path";
import sharp from "sharp";

const SOURCE_IMAGE = path.resolve("images/Mohasti Logo.jpeg");

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2); // type 1 = icon
  dir.writeUInt16LE(count, 4);

  return Buffer.concat([dir, ...entries, ...pngBuffers.map((p) => p.buffer)]);
}

async function run() {
  console.log("Generating Mohasti brand assets from:", SOURCE_IMAGE);
  const srcBuffer = fs.readFileSync(SOURCE_IMAGE);

  // 1. High-res master PNG (1600x1600)
  const masterPng = await sharp(srcBuffer)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync("public/brand/mohasti-logo.png", masterPng);
  fs.copyFileSync(SOURCE_IMAGE, "public/brand/mohasti-logo.jpeg");
  fs.copyFileSync(SOURCE_IMAGE, "public/brand/mohasti-logo.jpg");
  console.log("✓ Created public/brand/mohasti-logo.png & .jpg/.jpeg");

  // 2. High-res sizes for brand directory
  const logo512 = await sharp(masterPng)
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync("public/brand/mohasti-logo-512.png", logo512);

  const logo192 = await sharp(masterPng)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync("public/brand/mohasti-logo-192.png", logo192);
  console.log("✓ Created public/brand/mohasti-logo-512.png & 192.png");

  // 3. App icons (Next.js & standard web)
  // public/icon.png & src/app/icon.png
  fs.writeFileSync("public/icon.png", logo512);
  fs.writeFileSync("src/app/icon.png", logo512);
  console.log("✓ Created public/icon.png & src/app/icon.png");

  // 4. Apple touch icon (180x180)
  const apple180 = await sharp(masterPng)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync("public/apple-icon.png", apple180);
  fs.writeFileSync("src/app/apple-icon.png", apple180);
  console.log("✓ Created public/apple-icon.png & src/app/apple-icon.png");

  // 5. Favicons (.ico multi-size container: 16, 32, 48)
  const fav16 = await sharp(masterPng)
    .ensureAlpha()
    .resize(16, 16, { kernel: sharp.kernel.lanczos3 })
    .png({ colourType: 6 })
    .toBuffer();
  const fav32 = await sharp(masterPng)
    .ensureAlpha()
    .resize(32, 32, { kernel: sharp.kernel.lanczos3 })
    .png({ colourType: 6 })
    .toBuffer();
  const fav48 = await sharp(masterPng)
    .ensureAlpha()
    .resize(48, 48, { kernel: sharp.kernel.lanczos3 })
    .png({ colourType: 6 })
    .toBuffer();

  const icoBuf = createIco([
    { width: 16, height: 16, buffer: fav16 },
    { width: 32, height: 32, buffer: fav32 },
    { width: 48, height: 48, buffer: fav48 },
  ]);
  fs.writeFileSync("public/favicon.ico", icoBuf);
  fs.writeFileSync("src/app/favicon.ico", icoBuf);
  console.log("✓ Created public/favicon.ico & src/app/favicon.ico");

  // 6. SVG wrapper for logo & favicons
  const base64Master = masterPng.toString("base64");
  const base64_512 = logo512.toString("base64");

  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1600" width="100%" height="100%" role="img" aria-label="Mohasti Logo">
  <image width="1600" height="1600" href="data:image/png;base64,${base64Master}" />
</svg>
`;
  fs.writeFileSync("public/brand/mohasti-logo.svg", logoSvg, "utf8");
  console.log("✓ Updated public/brand/mohasti-logo.svg (embedded authentic logo)");

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" role="img" aria-label="Mohasti">
  <defs>
    <clipPath id="squircle">
      <rect width="512" height="512" rx="100" ry="100" />
    </clipPath>
  </defs>
  <image width="512" height="512" href="data:image/png;base64,${base64_512}" clip-path="url(#squircle)" />
</svg>
`;
  fs.writeFileSync("public/favicon.svg", faviconSvg, "utf8");
  fs.writeFileSync("src/app/icon.svg", faviconSvg, "utf8");
  console.log("✓ Created public/favicon.svg & src/app/icon.svg");

  // 7. Thumbnail / OpenGraph / Social Preview Image (1200x630)
  // Perfectly extend gradient horizontally and maintain all elements (moon, heart ribbon, MOHASTI, SINCE 2025, and lotus)
  const original = await sharp(srcBuffer).raw().toBuffer({ resolveWithObject: true });
  const origW = original.info.width;
  const origH = original.info.height;
  const origData = original.data;

  // Visual content occupies Y=428 to Y=1436 (center ~ 932)
  // Target aspect ratio is 1200 / 630 = 1.90476
  const targetH = 1360;
  const targetW = Math.round(targetH * (1200 / 630)); // 2590
  const offsetX = Math.round((targetW - origW) / 2); // 495
  const startY = 250; // vertically balanced

  const canvasBuf = Buffer.alloc(targetW * targetH * 3);

  for (let y = 0; y < targetH; y++) {
    const origY = y + startY;
    for (let x = 0; x < targetW; x++) {
      const canvasIdx = (y * targetW + x) * 3;
      const origX = x - offsetX;

      if (origX >= 0 && origX < origW && origY >= 0 && origY < origH) {
        const srcIdx = (origY * origW + origX) * 3;
        canvasBuf[canvasIdx] = origData[srcIdx];
        canvasBuf[canvasIdx + 1] = origData[srcIdx + 1];
        canvasBuf[canvasIdx + 2] = origData[srcIdx + 2];
      } else {
        const t = Math.max(0, Math.min(1, (origX + origY) / (origW + origH)));
        canvasBuf[canvasIdx] = Math.round(14 + t * (255 - 14));
        canvasBuf[canvasIdx + 1] = Math.round(192 + t * (222 - 192));
        canvasBuf[canvasIdx + 2] = Math.round(222 + t * (91 - 222));
      }
    }
  }

  const ogBuffer = await sharp(canvasBuf, {
    raw: { width: targetW, height: targetH, channels: 3 },
  })
    .resize(1200, 630, { kernel: sharp.kernel.lanczos3 })
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  fs.writeFileSync("public/brand/og-image.png", ogBuffer);
  fs.writeFileSync("public/brand/og-image.jpg", await sharp(ogBuffer).jpeg({ quality: 92 }).toBuffer());
  fs.writeFileSync("src/app/opengraph-image.png", ogBuffer);
  fs.writeFileSync("src/app/twitter-image.png", ogBuffer);
  console.log("✓ Created public/brand/og-image.png, og-image.jpg, src/app/opengraph-image.png, and src/app/twitter-image.png");

  // 8. Web App Manifest
  const manifest = {
    name: "Mohasti — Spiritual Art & Mindful Stationery",
    short_name: "Mohasti",
    description: "Mohasti creates original art, postcards, journals, and mindful stationery inspired by stillness and everyday rituals.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0EC0DE",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/brand/mohasti-logo-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };

  fs.writeFileSync("public/manifest.json", JSON.stringify(manifest, null, 2), "utf8");
  console.log("✓ Created public/manifest.json");

  console.log("\nAll brand assets generated successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
