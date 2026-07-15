# Archi + Vex merge into vicious-gadget

Both dropped in as siblings of `app/` at repo root, under `web/`. Nothing
in the Android module (`app/`, `build.gradle.kts`, `settings.gradle.kts`)
was touched — the Gradle build is untouched and should still work exactly
as before.

## Why these aren't WebView tabs (like Accio is)

Accio could become a tab in `MainActivity.kt` because it's plain static
HTML/JS — a WebView can load it straight from assets with no build step.

Archi and Vex are **Next.js apps**, not static sites:

- **vicious-vex** has real server API routes (`src/app/api/complete`,
  `/explain`, `/snippet`) that call Genkit AI flows. These need a running
  Node process — a WebView pointed at bundled static HTML can't serve
  them. Its own `capacitor.config.ts` confirms it was designed to be its
  own Capacitor-wrapped app (`appId: com.viciousvex.app`), not a fragment
  glued into Gadget.
- **vicious-archi** is missing a `package.json` and `tsconfig.json` in
  this drop — it's a set of loose `.ts` tool scripts (`scaffolder.ts`,
  `dissector.ts`, `genkit.ts`, `generate-codebase-readme.ts`) plus a
  `next.config.ts`/`tailwind.config.ts` that imply a Next.js app shell
  that isn't actually included here. It won't `npm install` as-is.

So "merged" here means **same git repo, same place you can `cd` into
and work on them** — not embedded inside the Gadget APK. If you want
Vex living inside Gadget as a real tab later, the WebView would need to
point at a Vex dev/prod server URL (`http://10.0.2.2:3000` from an
emulator, or a deployed URL) instead of local assets — worth a separate
pass once Vex is running.

## Building each piece in Termux

**vicious-vex** (has a package.json, should install cleanly):
```
cd ~/vicious-gadget/web/vicious-vex
npm install
npm run dev      # or: npm run build && npm start
```
Needs its own `.env.local` for the Genkit/AI keys (stripped from this
drop, add it back locally — it's already gitignored patterns you'll
want to keep out of the repo).

**vicious-archi**: needs a `package.json` before anything will run.
Either pull the missing files from wherever this export came from, or
scaffold a minimal Next.js `package.json`/`tsconfig.json` around the
existing `.ts` files so `npm install` has something to work with.

## Next command in Termux

```
cd ~/vicious-gadget
unzip -o ~/storage/downloads/vicious-web-merge.zip -d .
git add web/
git commit -m "Merge vicious-archi and vicious-vex source into repo as web/ modules"
git push -u origin main   # only after the GitHub repo itself exists — see below
```
