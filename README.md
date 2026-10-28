# TASKFRAME

TASKFRAME is a browser-based creative studio for making daily task wallpapers, custom text wallpapers, and social media graphics. It uses React, Vite, and the Canvas 2D API. There is no application backend: task data, original wallpaper settings, and recent theme history use browser localStorage. Creative editor projects and selected photos stay in memory while the page is open, survive switching between tools, and reset on reload.

## Run and validate

```sh
npm install
npm run dev
npm run test
npm run build
npm run lint
```

## Tools

- **Task wallpaper** — existing task list, theme, layout, and customization workflow; renders a live canvas preview and downloads a PNG.
- **Custom wallpaper** — phone, Full HD portrait, desktop, and bounded custom dimensions; solid, gradient, or uploaded-image background; editable text layers.
- **Instagram graphics** — square post, portrait post, and story/reel cover dimensions; supports the same background and text editor while retaining the composition when changing formats.

The creative tools share a normalized text-layer model and renderer. Text placement uses normalized canvas coordinates, so it remains in proportion when the output format changes. Uploaded images are resized and encoded locally using the existing image utility. The task wallpaper renderer and its localStorage keys remain independent from the creative editors.

## Source structure

```text
src/
  App.jsx                     Selects between existing task tool and creative tools
  constants.js                Task wallpaper defaults, limits, and theme options
  creative/
    creativeRegistry.js       Creative formats, fonts, limits, and layer defaults
    creativeRenderer.js       Canvas 2D rendering for the new editors
  components/
    CreativeStudio.jsx        Shared editor UI for custom wallpaper and social tools
    ToolSelector.jsx          Main three-tool navigation
    ...                       Existing task wallpaper UI components
  hooks/
    useCreativeProject.js     Independent in-memory creative composition state
    useLocalStorage.js        Existing browser storage helper
    useTasks.js               Existing task operations and progress
    useWallpaperSettings.js   Existing wallpaper settings and theme history
  themes/
    themeRegistry.js          Existing task wallpaper themes
  utils/
    canvasUtils.js            Shared low-level canvas helpers
    imageUtils.js             Local photo validation and compression
    downloadUtils.js          Canvas-to-PNG download helpers
    wallpaperLayouts.js       Existing task wallpaper sizing and layout
    wallpaperRenderer.js      Existing task wallpaper renderer
  styles/
    creative.css              Creative editor and tool navigation styles
    ...                       Existing global, layout, and component styles
  test/
    creativeStudio.test.jsx   Creative formats, state, renderer, and UI tests
    ...                       Existing task and wallpaper tests
```

## Extension notes

- Keep arbitrary creative text layers separate from task records. Their defaults, font registry, format presets, and dimension limits belong in `src/creative/creativeRegistry.js`.
- The task wallpaper preview and PNG are drawn by `src/utils/wallpaperRenderer.js`; creative output is drawn by `src/creative/creativeRenderer.js`. Keep these renderers separate to protect existing output.
- When adding a creative format, register its dimensions and test that switching formats retains layer content and normalized positions.
- When adding fonts, register the family and fallback centrally. The renderer waits for font availability and uses the fallback if a font cannot load.
- Keep user image processing in the browser. Do not persist large image data into localStorage or upload it to a server.
- Add focused tests in `src/test/` and run the complete test, build, and lint commands before considering a change complete.
