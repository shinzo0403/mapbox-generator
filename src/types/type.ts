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
  /** button label */
  title: string;

  /** button handler */
  options: {
    /** target layer id */
    targetLayer: string;

    /** target layer paint */
    paint: GL.AnyPaint;
  }[];
}

export interface MapboxGL {
  /** title for HTML */
  title: string;

  /** mapbox api key */
  mapboxApiKey?: string;

  /** mapbox style */
  mapboxStyle?: string;

  /** bounds for map */
  bounds?: number[][];

  /** layers for map */
  layers: Prop[];

  savepath: string;
  buttons: Button[];
}
