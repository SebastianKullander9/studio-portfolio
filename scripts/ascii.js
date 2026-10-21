import sharp from "sharp";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SIZE = 80;
const DIR = "src/lib/assets/works";
const OUT = "src/lib/data/ascii.json";

const files = await readdir(DIR, { recursive: true, withFileTypes: true });
const out = {};

for (const f of files) {
    if (!f.isFile() || !/\.(png|jpe?g|avif|webp)$/i.test(f.name)) continue;

    const full = path.join(f.parentPath, f.name);
    const key = path
        .relative(DIR, full)
        .replace(/\\/g, "/")
        .replace(/\.[^.]+$/, ""); // "lewa/img1"

    const { data, info } = await sharp(full)
        .resize(SIZE, SIZE, { fit: "inside" })
        .flatten()
        .greyscale()
        .extractChannel(0)
        .raw()
        .toBuffer({ resolveWithObject: true });

    out[key] = {
        w: info.width,
        h: info.height,
        data: [...data].map((b) => (b >> 4).toString(16)).join(""),
    };
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out));
console.log(`Generated lightness maps for ${Object.keys(out).length} images`);
