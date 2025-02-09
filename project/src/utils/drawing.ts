/**
 * Advanced drawing utilities for handling parcel lines, setbacks, and buildable areas.
 * These functions implement the core geometric algorithms needed for architectural planning.
 */

import { Point, Line, ParcelLine, SetbackLine } from '../types/drawing';

/**
 * Calculates a parallel line at a specified distance from a given line.
 * Used for creating setback lines from parcel boundaries.
 * 
 * @param line - Original line segment
 * @param distance - Distance to offset the parallel line
 * @returns New line parallel to the original at the specified distance
 */
export const calculateParallelLine = (line: Line, distance: number): Line => {
  const dx = line.end.x - line.start.x;
  const dy = line.end.y - line.start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return line;

  // Calculate unit normal vector
  const unitNormal = {
    x: -dy / length,
    y: dx / length
  };

  // Create parallel line by offsetting both points
  return {
    start: {
      x: line.start.x + unitNormal.x * distance,
      y: line.start.y + unitNormal.y * distance
    },
    end: {
      x: line.end.x + unitNormal.x * distance,
      y: line.end.y + unitNormal.y * distance
    }
  };
};

/**
 * Calculates the intersection point of two lines.
 * Returns null if lines are parallel or don't intersect.
 * 
 * @param line1 - First line
 * @param line2 - Second line
 * @returns Intersection point or null if no intersection
 */
export const findIntersection = (line1: Line, line2: Line): Point | null => {
  const x1 = line1.start.x, y1 = line1.start.y;
  const x2 = line1.end.x, y2 = line1.end.y;
  const x3 = line2.start.x, y3 = line2.start.y;
  const x4 = line2.end.x, y4 = line2.end.y;

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator === 0) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1)
  };
};

/**
 * Generates setback lines for a parcel based on its boundaries and setback requirements.
 * Creates different setback lines for road frontage, adjacent parcels, and rear boundaries.
 * 
 * @param parcelLines - Array of parcel boundary lines with their types
 * @param frontSetback - Required setback distance from road
 * @param sideSetback - Required setback distance from adjacent parcels
 * @param rearSetback - Required setback distance from rear boundary
 * @returns Array of setback lines with their types and distances
 */
export const calculateSetbackLines = (
  parcelLines: ParcelLine[],
  frontSetback: number,
  sideSetback: number,
  rearSetback: number
): SetbackLine[] => {
  const setbackLines: SetbackLine[] = [];

  parcelLines.forEach(line => {
    // Determine setback distance based on line type
    const distance = line.type === 'road' ? frontSetback :
                    line.type === 'adjacent' ? sideSetback :
                    rearSetback;

    const parallelLine = calculateParallelLine(line, distance);
    
    // Create setback line with appropriate type
    setbackLines.push({
      ...parallelLine,
      type: line.type === 'road' ? 'front' :
            line.type === 'adjacent' ? 'side' : 'rear',
      distance
    });
  });

  return setbackLines;
};

/**
 * Determines if a point lies inside a polygon using the ray casting algorithm.
 * Used for checking if points are within the buildable area.
 * 
 * @param point - Point to check
 * @param polygon - Array of points forming the polygon
 * @returns true if the point is inside the polygon, false otherwise
 */
export const isPointInsidePolygon = (point: Point, polygon: Point[]): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Calculates the buildable area within a parcel considering setback lines.
 * Uses the intersection points of setback lines to determine the buildable polygon.
 * 
 * @param parcelPoints - Array of points defining the parcel boundary
 * @param setbackLines - Array of setback lines
 * @returns Array of points defining the buildable area
 */
export const findBuildableArea = (
  parcelPoints: Point[],
  setbackLines: SetbackLine[]
): Point[] => {
  if (setbackLines.length === 0) return parcelPoints;

  // Find all valid intersection points
  const intersectionPoints: Point[] = [];

  // Find intersections between setback lines
  for (let i = 0; i < setbackLines.length; i++) {
    for (let j = i + 1; j < setbackLines.length; j++) {
      const intersection = findIntersection(setbackLines[i], setbackLines[j]);
      if (intersection && isPointInsidePolygon(intersection, parcelPoints)) {
        intersectionPoints.push(intersection);
      }
    }
  }

  // Find intersections between setback lines and parcel edges
  for (let i = 0; i < setbackLines.length; i++) {
    for (let j = 0; j < parcelPoints.length; j++) {
      const parcelLine: Line = {
        start: parcelPoints[j],
        end: parcelPoints[(j + 1) % parcelPoints.length]
      };
      const intersection = findIntersection(setbackLines[i], parcelLine);
      if (intersection) {
        intersectionPoints.push(intersection);
      }
    }
  }

  // If no intersections found, return empty array (no buildable area)
  if (intersectionPoints.length === 0) return [];

  // Sort points to form a convex polygon
  const buildablePoints = intersectionPoints.filter(point => 
    isPointInsidePolygon(point, parcelPoints)
  );

  return buildablePoints.length >= 3 ? buildablePoints : [];
};