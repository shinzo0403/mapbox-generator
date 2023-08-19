# Mapbox GL JS HTML ファイル出力プログラム

![sample](./documents/sample.gif)

## 目次

- [インストール](#インストール)
- [使用方法](#使用方法)
- [使用ライブラリ](#使用ライブラリ)

<br />

---

<br />

## インストール

```bash
npm i @shinzo0403/mapbox-generator
```

<br />

---

<br />

## 使用方法

```typescript
import createMapboxGL from '@shinzo0403/mapbox-generator';
import type { Prop, Button } from '@shinzo0403/mapbox-generator';


const town15Layer: Prop = {
  sources: {
    id: 'towns',
    source: {
      type: 'geojson',
      data: // geojsonデータ,
    },
  },
  layers: {
    layer: {
      id: 'towns',
      type: 'fill',
      source: 'towns',
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.5,
        'fill-outline-color': 'orange',
      },
    },
    title: '町目',
  },
  popup: {
    town_id: 'id',
    town_name: 'name',
  },
};

const circle15Layer: Prop = {
  sources: {
    id: 'circle',
    source: {
      type: 'geojson',
      data: // geojsonデータ,
    },
  },
  layers: {
    layer: {
      id: 'circle',
      type: 'fill',
      source: 'circle',
      paint: {
        'fill-color': 'limegreen',
        'fill-opacity': 0.3,
      },
    },
    title: 'サークル',
  },
  popup: {
    name: '名称',
  },
};

const buttonOn: Button = {
  title: 'サークル表示',
  options: [
    {
      targetLayer: 'circle',
      paint: {
        'fill-opacity': 0.3,
      },
    },
  ],
};

const buttonOff: Button = {
  title: 'サークル非表示',
  options: [
    {
      targetLayer: 'circle',
      paint: {
        'fill-opacity': 0,
      },
    },
  ],
};

createMapboxGL({
    title: '駅徒歩15分',
    mapboxApiKey: process.env.MAPBOX_ACCESS_TOKEN,
    mapboxStyle: process.env.MAPBOX_STYLE,
    savepath: 'out/駅徒歩15分.html',
    layers: [town15Layer, areaLayer, circle15Layer],
    buttons: [buttonOn, buttonOff],
});
```
