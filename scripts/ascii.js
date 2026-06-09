import sharp from "sharp";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const COLS = 80,
    ROWS = 22;
const CHARS = " .-=+#%@";
const DIR = "static/works";
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

    const { data } = await sharp(full)
        .resize(COLS, ROWS, { fit: "cover" })
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    out[key] = [...data]
        .map((b) => CHARS[Math.floor((b / 255) * (CHARS.length - 1))])
        .join("");
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out));
console.log(`Generated ASCII for ${Object.keys(out).length} images`);
