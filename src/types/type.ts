import { default as GL } from 'mapbox-gl';

interface Source {
  id: string;
  source: GL.AnySourceData;
}

interface Layer {
  title: string;
  layer: GL.AnyLayer;
}

export type Prop = {
  sources: Source;
  layers: Layer;
  popup: {
    [T: string]: string;
  };
};

export interface Button {
  title: string;
  options: {
    targetLayer: string;
    paint: GL.AnyPaint;
  }[];
}

export interface MapboxGL {
  title: string;
  mapboxApiKey?: string;
  mapboxStyle?: string;
  bounds?: number[][];
  layers: Prop[];
  savepath: string;
  buttons: Button[];
}
