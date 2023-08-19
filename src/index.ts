import fs from 'fs';
import * as C from './constants.js';
import type { MapboxGL, Button, Prop } from './types/type.js';

const defaultBounds = [
  [139.50591336736562, 35.42978851434312],
  [139.9530128274145, 35.927967518933144],
];

function createLayer(prop: Prop) {
  const { sources, layers } = prop;
  const { id, source } = sources;
  const { layer } = layers;

  const addSource = `map.addSource('${id}', ${JSON.stringify(source)});`;
  const addLayer = `map.addLayer(${JSON.stringify(layer)});`;

  return `
    map.on('load', () => {
        ${addSource}
        ${addLayer}
    });
    `;
}

function createPopup(
  target: string,
  title: string,
  popup: { [T: string]: string }
) {
  const html = `\`
        <div>
            <h3>${title}</h3>
            <ul>
                \${Object.entries(e.features[0].properties).flatMap(([k, v]) => {
                    const popup = ${JSON.stringify(popup)};
                    if (popup[k] === undefined) return [];
                    let key = popup[k]
                    return \`
                    <li>
                        <span>\${key}: \${v}</span>
                    </li>\`;
                }).join('')}
            </ul>
        </div>
    \``;

  return `
    map.on('click', '${target}', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(${html})
            .setMaxWidth("auto")
            .addTo(map);
    });
    `;
}

function createButtonList(buttons: Button[]) {
  const buttonHTML = buttons
    .map((button, id) => `<button id="button_${id}">${button.title}</button>`)
    .join('');
  return `<div id="buttonContainer">${buttonHTML}</div>`;
}

function createButtonHandler(buttons: Button[]) {
  const buttonHandler = buttons
    .map(
      (button, id) =>
        `document.getElementById("button_${id}").addEventListener('click', () => {
            ${button.options
              .map((option) => {
                const { paint, targetLayer } = option;
                return Object.entries(paint)
                  .map(
                    ([key, value]) =>
                      `map.setPaintProperty('${targetLayer}', '${key}', ${JSON.stringify(
                        value
                      )});`
                  )
                  .join('');
              })
              .join('')}
          });`
    )
    .join('');
  return buttonHandler;
}

export default function createMapboxGL(prop: MapboxGL) {
  const {
    title,
    mapboxApiKey,
    mapboxStyle,
    bounds,
    layers,
    savepath,
    buttons,
  } = prop;

  if (!mapboxApiKey || !mapboxStyle) {
    throw new Error('mapboxApiKey or mapboxStyle is undefined');
  }

  let html = fs.readFileSync(C.SOURCE_FILE, 'utf-8');

  // replace configs
  html = html
    .replace(C.REPLACE_HEADER, title)
    .replace(C.REPLACE_TITLE, title)
    .replace(C.REPLACE_MAPBOX_API_KEY, mapboxApiKey)
    .replace(C.REPLACE_MAPBOX_STYLE, mapboxStyle)
    .replace(C.REPLACE_BOUNDS, JSON.stringify(bounds || defaultBounds));

  let replaceOnload = '';
  let replaceOnhover = `
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });
  `;

  // replace layers
  layers.forEach((lyr) => {
    const { layers, sources, popup } = lyr;
    const { id } = sources;
    const { title } = layers;

    const layerHTML = createLayer(lyr);
    const popupHTML = createPopup(id, title, popup);

    replaceOnload = replaceOnload + layerHTML;
    replaceOnhover = replaceOnhover + popupHTML;
  });

  html = html
    .replace(C.REPLACE_ONLOAD, replaceOnload)
    .replace(C.REPLACE_ONHOVER, replaceOnhover);

  // replace buttons
  if (buttons) {
    html = html
      .replace(C.REPLACE_BUTTONS, createButtonList(buttons))
      .replace(C.REPLACE_BUTTON_HANLDER, createButtonHandler(buttons))
      .replace(C.REPLACE_BUTTON_STYLE, C.BUTTON_STYLE);
  } else {
    html = html
      .replace(C.REPLACE_BUTTONS, '')
      .replace(C.REPLACE_BUTTON_HANLDER, '')
      .replace(C.REPLACE_BUTTON_STYLE, '');
  }

  fs.writeFileSync(savepath, html, 'utf-8');
}
