# Bibleify Desktop
Simple bible app with dramatized audio built with [Electron](https://electronjs.org/), [React](https://reactjs.org/), [Rematch](https://rematch.gitbooks.io/rematch/#getting-started), [Realm](https://github.com/realm/realm-js) & [Clappr](https://github.com/clappr/clappr)

![bibleifyscreen](/images/bibleifyscreen.jpg)

## Downloads

[Click here](https://sonnylab.itch.io/bibleify) to download the latest version.

## About Bibleify

Bibleify is a simple & fast bible app with dramatized audio. The design is modern, distraction-free, and easy-to-use.

## Features

- Easy & quick navigation
- Blazing fast search
- High quality dramatized bible audio
- Offline bible reading
- Multiple languages & bible versions
  - New King James Version (NKJV)
  - King James Version (KJV)
  - New International Version (NIV)
  - English Standard Version (ESV)
  - Terjemahan Baru (TB)
  - Bahasa Jawa (JAWA)
  - Bahasa Sunda (SUNDA)
  - Amharic Bible (AMH) placeholder (add `amharic.realm` file)
- New offline-first reader improvements
  - Verse highlights (multi-color)
  - Verse notes
  - Theme mode (light, dark, auto)
  - Font-size slider
  - Faster toolbar navigation for books + chapters
  - Loading and error states for offline realm data

## Prerequisites

- Git
- Node.js 18-20

## Setup Development

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start development mode: `npm run dev`

## Running the Application

- Development with hot reload: `npm run dev`
- Start Electron only: `npm run dev:electron`
- Build renderer bundle: `npm run build`

## Troubleshooting

If `webpack-dev-server` is not recognized, ensure dependencies are installed and run the script via npm (`npm run dev`). The project now uses webpack 5 + webpack-dev-server 5 through npm scripts.


### Windows `npm install` ENOENT (`Could not read package.json`)

If you see:

```
ENOENT: no such file or directory, open ...\bibleify-desktop-master\package.json
```

it means npm is being run from a folder that does not contain this repository's `package.json`.

Use these exact commands in PowerShell (adjust path if needed):

```powershell
cd "D:\Media\download\bibleify-desktop-master"
dir package.json
npm install
```

If `dir package.json` fails, locate the correct folder first:

```powershell
cd "D:\Media\download"
Get-ChildItem -Path . -Filter package.json -Recurse -ErrorAction SilentlyContinue
```

Then `cd` into the folder printed by the command and run `npm install` again.


## Modernized toolchain notes

- Webpack upgraded to v5 + webpack-dev-server v5.
- Babel upgraded to v7.
- `node-sass` replaced with `sass` (dart-sass).
- Electron upgraded and remote access migrated to `@electron/remote`.
- Realm access now uses the npm `realm` package instead of the bundled native `lib/realm.node` binary.

If you are upgrading from an old checkout, remove lockfiles/modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```
