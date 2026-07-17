import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = "E:/Downloads/12/Ai edited for website";
const outputRoot = path.resolve("public/images/optimized/treatments");

const assets = [
  [
    "Pico laser face/efca1d62-191b-464d-ac5e-fcb09562a86d.png",
    "pico-face/pico-face-treatment.webp",
  ],
  [
    "Pico laser face/16669622-97a3-40fa-8150-88189f44c06b - Copy.png",
    "pico-face/pico-face-overview.webp",
  ],
  [
    "Pico laser face/efca1d62-191b-464d-ac5e-fcb09562a86d - Copy (2).png",
    "pico-face/pico-face-detail.webp",
  ],
  [
    "Pico laser face/a2e453ce-b346-4829-a710-34598528c751 - Copy (3).png",
    "pico-face/pico-face-room-view.webp",
  ],
  [
    "pico Laser underarm/36cac8c7-6454-4bd6-a46a-ba9f2e241a9f.png",
    "pico-underarm/pico-underarm-treatment.webp",
  ],
  [
    "pico Laser underarm/6b47e68f-614d-4faa-98d4-a970397cbfd6.png",
    "pico-underarm/pico-underarm-overview.webp",
  ],
  [
    "pico Laser underarm/649ca242-1a5d-498f-bf33-0a5d5df2796b - Copy (2).png",
    "pico-underarm/pico-underarm-detail.webp",
  ],
  ["HIFU/d52319af-4919-4159-be86-e9e0dbf8a971.png", "hifu/hifu-face-treatment.webp"],
  ["HIFU/f0fc0dad-1ef8-4d63-b129-942ecd7a6abe.png", "hifu/hifu-mature-skin-treatment.webp"],
  ["HIFU/e46cac73-f432-4c15-957d-0132498821d9.png", "hifu/hifu-handpiece-detail.webp"],
  ["MCCM/ChatGPT Image Jul 13, 2026, 12_58_36 PM (1).png", "mccm/mccm-pdrn-hero.webp"],
  ["MCCM/ChatGPT Image Jul 13, 2026, 12_58_36 PM (2).png", "mccm/mccm-pdrn-detail.webp"],
  ["MCCM/ChatGPT Image Jul 13, 2026, 12_58_36 PM (6).png", "mccm/mccm-eye-contour.webp"],
  [
    "Diode Laser Under/4a53496b-bba9-460c-9204-8d5af64f4cd5.png",
    "diode/diode-underarm-treatment.webp",
  ],
  [
    "Diode Laser Under/47b1f7b3-e4c4-431c-a136-1a095bb863df.png",
    "diode/diode-underarm-detail.webp",
  ],
  [
    "Diode Laser Under/fdd58cc5-cfa8-49b3-bb4f-9dcf1591229e.png",
    "diode/diode-underarm-overview.webp",
  ],
  [
    "Doc/to sort/HIKO/cd0f6e63-295a-4dd9-b601-89038475747a.png",
    "doctor/hiko/hiko-nose-lift-treatment.webp",
  ],
  [
    "Doc/to sort/HIKO/69e29d35-dcbe-4131-8a84-d646c9dbb53f.png",
    "doctor/hiko/hiko-nose-lift-overview.webp",
  ],
  [
    "Doc/to sort/Face lift threads/ChatGPT Image Jul 13, 2026, 06_36_13 PM (13).png",
    "doctor/thread-lift/thread-lift-treatment.webp",
  ],
  [
    "Doc/to sort/Face lift threads/ChatGPT Image Jul 13, 2026, 06_36_13 PM (12).png",
    "doctor/thread-lift/thread-lift-overview.webp",
  ],
  [
    "Doc/to sort/barbie arms/80c57452-07ac-43f6-b25a-cd052eb01215.png",
    "doctor/armtox/armtox-treatment.webp",
  ],
  [
    "Doc/to sort/barbie arms/4128e45b-f410-4776-a616-88bb0eb5fd53.png",
    "doctor/armtox/armtox-detail.webp",
  ],
  [
    "Doc/to sort/botox face/ChatGPT Image Jul 13, 2026, 06_36_07 PM (1).png",
    "doctor/anti-wrinkle/anti-wrinkle-treatment.webp",
  ],
  [
    "Doc/to sort/botox face/ChatGPT Image Jul 13, 2026, 06_36_13 PM (7).png",
    "doctor/anti-wrinkle/anti-wrinkle-forehead.webp",
  ],
  [
    "Pico Machine/ChatGPT Image Jul 13, 2026, 11_15_50 AM (4).png",
    "devices/pico/pico-laser-device.webp",
  ],
  ["HIFU machine/fe05b7c8-5239-4afa-a9f7-7b04c157fd04 (1).png", "devices/hifu/hifu-device.webp"],
  ["HIFU machine/8cdb3e4f-648c-4384-8e5d-6270428e4838.png", "devices/hifu/hifu-handpieces.webp"],
  [
    "Diode Machine/a8ecdd49-a62d-4452-bb48-b54e93b631c9.png",
    "devices/diode-4d/diode-4d-device.webp",
  ],
  [
    "Diode Machine/944fa22f-d051-4668-bab3-e940157c3ccb.png",
    "devices/diode-4d/diode-4d-treatment-room.webp",
  ],
];

await Promise.all(
  assets.map(async ([source, destination]) => {
    const input = path.join(sourceRoot, source);
    const output = path.join(outputRoot, destination);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await sharp(input)
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(output);
  }),
);

console.log(`Optimized ${assets.length} curated treatment assets.`);
