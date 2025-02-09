export interface Point {
  x: number;
  y: number;
}

export interface Line {
  start: Point;
  end: Point;
}

export interface ParcelLine extends Line {
  type: 'road' | 'adjacent';
}

export interface SetbackLine extends Line {
  type: 'front' | 'side' | 'rear';
  distance: number;
}

export interface Project {
  id: string;
  land_area: number | null;
  parcel_lines?: ParcelLine[];
  nizam_type?: 'ayrik' | 'bitisik' | 'ikiz' | 'blok';
  front_setback?: number;
  side_setback?: number;
  rear_setback?: number;
}

export type SelectionPhase = 'road' | 'adjacent' | 'complete';
export type CursorStyle = 'crosshair' | 'grab' | 'grabbing' | 'no-drop' | 'zoom-in' | 'zoom-out' | 'default' | 'pointer';