import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Cura brand typefaces (Brand Guide v1.0, section 05), all SIL Open Font
// License, bundled in public/fonts so renders never depend on Google Fonts.
//   Playfair Display: wordmark and headlines
//   DM Sans: body, captions, buttons, UI
//   DM Mono: overline labels
export const fonts = {
  display: "Playfair Display",
  body: "DM Sans",
  mono: "DM Mono",
} as const;

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const load = (family: string, file: string, weight: string) => {
  loadFont({ family, url: staticFile(`fonts/${file}-latin-${weight}-normal.woff2`), weight, unicodeRange: LATIN });
  loadFont({ family, url: staticFile(`fonts/${file}-latin-ext-${weight}-normal.woff2`), weight, unicodeRange: LATIN_EXT });
};

for (const w of ["400", "500", "600", "700"]) load(fonts.body, "dm-sans", w);
for (const w of ["600", "700"]) load(fonts.display, "playfair-display", w);
load(fonts.mono, "dm-mono", "500");
