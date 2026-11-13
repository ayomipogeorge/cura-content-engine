# Cura Content Engine

Turns Cura's video scripts into finished motion-explainer videos: native 4K vertical (2160 × 3840), scene-to-scene handoff transitions, burned-in captions, Gemini voiceover, a quiet generated sound bed and a loudness master ready for social.

Built with [Remotion](https://www.remotion.dev) (React for video). Scripts and on-screen claims follow the **Cura Content System** doc.

## What's in the box

| Video | Pillar | Audience |
| --- | --- | --- |
| `s01-hr-plan-fits-nobody` | The HR Fix | Employers / HR |
| `s02-provider-paid-today` | Paid Today | Pharmacies and clinics |
| `s03-plan-match-same-budget` | Plan Match | Employees and HR |
| `s04-five-staff-rule` | HR in 60 Seconds | SME owners and HR |
| `s05-what-is-a-health-wallet` | Wallet Wednesday | Employees |

Script 6 (founder on camera) is filmed, so it isn't animated here.

## Render on GitHub (no setup on your computer)

1. **Add your Gemini key once.** Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). In this repo go to *Settings → Secrets and variables → Actions → New repository secret*, name it `GEMINI_API_KEY`.
   Optional: under the *Variables* tab add `CURA_VOICE` to change the voice (default `Sulafat`).
2. Go to *Actions → Render videos → Run workflow*.
   - **only**: e.g. `s02` for one video, or leave empty for all five.
   - **preview**: tick for a fast low-res check, untick for the 4K master.
3. When it finishes, download the **cura-videos** artifact at the bottom of the run page. You get:
   - `<id>-4k.mp4`: the 2160 × 3840 master, loudness-normalised to −14 LUFS / −1.5 dBTP
   - `<id>-1080.mp4`: the 1080 × 1920 copy to upload to Instagram, TikTok, LinkedIn, X and YouTube Shorts

Without the key, videos still render, with captions and estimated timing but no voice.

## Run it on your own computer

Needs Node 22+ and ffmpeg.

```bash
npm install
npm run studio            # live preview and scrubbing in the browser
npm run sfx               # generate the sound kit
GEMINI_API_KEY=... npm run voiceover
npm run render:preview -- s02
npm run render            # all videos, 4K + 1080
npm run sheets -- s01     # contact sheet of frames for quick QA (out/sheets)
```

## Make a new video

1. Write the script with Prompt 1 from the content doc and run it through the claims check (Prompt 4).
2. Copy one of the scripts in `src/scripts/index.ts`, give it a new `id` and add it to the `scripts` list.
3. For each scene, pick a visual template:

| `visual.kind` | What it shows |
| --- | --- |
| `people` | Grid of staff icons; optional plan stamped on everyone, pop-in one by one, shrugs |
| `personas` | 2–3 persona cards with need chips and tags; optional equal wallets |
| `stack` | `bubbles` (complaints to HR), `slam` (bills landing), `steps` (numbered steps with ticks) |
| `dashboard` | Employer dashboard; a cursor edits one person's wallet amount |
| `walletsToPlans` | Wallets fly to staff; each picks a different matched plan; optional documents folder |
| `planSort` | Plan cards fan out and get filtered by matching factors |
| `planAssign` | Matched plans slide to two people; `drain: true` shows them choosing |
| `walletHero` | The Health Wallet card: `spin`, `fill` (employer funds it) or `menu` |
| `pay` | Phone pays from the Health Wallet; payment pulse; "Paid, Today" |
| `calendar` | Days-waiting counter with money walking away |
| `document` | Reference document with a highlighted line |
| `clip` | A Google Flow clip from `public/clips/` (placeholder until the file exists) |
| `end` | Logo, line, CTA and URL |

4. Run `npm run sheets -- <id>` or the preview workflow to check it, then render the master.

Scene length stretches automatically to fit the voiceover. Each scene's `exit` picks its handoff: `push`, `wipe`, `iris` or `slide`. Scenes never fade.

## Live-action clips

Scenes with `kind: "clip"` play `public/clips/<file>`. Generate a 4–8 s vertical clip in Google Flow with Prompt 5 from the content doc, save it under that exact name and commit it.

## Brand

Everything follows the **Cura Brand Identity Guide v1.0** (March 2026). The tokens live in `src/brand.ts`:

- **Colours:** Cura Navy `#0F1F3D` and Off-White Cream `#F8F6F1` for scenes, Cura Amber `#F59E0B` only as an accent (always navy text on amber), Success Green for "Paid" and ticks, Error Red for problems.
- **Type:** Playfair Display for the wordmark and headlines, DM Sans for captions and UI, DM Mono for the amber overline labels. All three are bundled in `public/fonts` (SIL Open Font License).
- **Components:** cards carry the amber left-border motif; buttons have small rounded corners, never pills; badges are pills; icons are Heroicons outline inside circles.
- **Motion:** calm ease-out entrances, ease-in-out for emphasis, no bounce, no elastic, no linear. Numbers count up when a balance appears; success states pulse once.
- **End cards:** navy, with the amber Playfair wordmark.
- **Sound:** a quiet ambient bed and a soft air under scene transitions only. No click or "paid" sound effects, because the guide rules out sound effects for interactions.

Guide sizes are scaled about 2.4x for the 1080 × 1920 video canvas, so they read the same on a phone.

## Claims

Every script must pass the claims guardrails in the content doc: Cura is never called an insurer or HMO, partners are not named until signed, no "instant" or "guaranteed", no statistics without a source.
