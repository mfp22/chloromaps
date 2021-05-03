export interface MapData {
  code: string;
  fill: string;
}

export interface LegendData {
  fill: string;
  hide: boolean;
  text: string;
}

export interface MapStoreType {
  defaultFillColor: string;
  mapStrokeColor: string;
  mapBackgroundColor: string;
  mapStrokeWidth: string;
  mapFillColor: string;
  mapData: MapData[];
  legendData: LegendData[];
}