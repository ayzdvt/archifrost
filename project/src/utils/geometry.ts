/**
 * Utility functions for geometric calculations and transformations.
 * These functions handle basic geometric operations needed for the drawing application.
 */

import { Point, Line } from '../types/drawing';

/**
 * Rounds a number to two decimal places.
 * Used for coordinate precision in the drawing interface.
 */
export const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

/**
 * Sorts points in clockwise order around their centroid.
 * This is essential for creating valid polygons and calculating areas.
 * 
 * @param points - Array of points to be sorted
 * @returns Sorted array of points in clockwise order
 */
export const sortPoints = (points: Point[]): Point[] => {
  // Calculate centroid
  const center = points.reduce((acc, p) => ({
    x: acc.x + p.x / points.length,
    y: acc.y + p.y / points.length
  }), { x: 0, y: 0 });

  // Sort points based on their angle from centroid
  return [...points].sort((a, b) => {
    const angleA = Math.atan2(a.y - center.y, a.x - center.x);
    const angleB = Math.atan2(b.y - center.y, b.x - center.x);
    return angleA - angleB;
  });
};

/**
 * Determines if two line segments intersect.
 * Uses the counterclockwise test for line intersection.
 * 
 * @param line1 - First line segment
 * @param line2 - Second line segment
 * @returns true if the lines intersect, false otherwise
 */
export const linesIntersect = (line1: Line, line2: Line): boolean => {
  const { start: a1, end: a2 } = line1;
  const { start: b1, end: b2 } = line2;

  // Helper function to determine if three points are counterclockwise
  const ccw = (A: Point, B: Point, C: Point): number => {
    return (B.x - A.x)*(C.y - A.y) - (B.y - A.y)*(C.x - A.x);
  };

  // Check if the lines intersect using the counterclockwise test
  return (
    ccw(a1, a2, b1) * ccw(a1, a2, b2) < 0 &&
    ccw(b1, b2, a1) * ccw(b1, b2, a2) < 0
  );
};

/**
 * Calculates the area of a polygon using the shoelace formula (surveyor's formula).
 * The points should be ordered (clockwise or counterclockwise).
 * 
 * @param polygon - Array of points forming the polygon
 * @returns Area of the polygon in square units
 */
export const calculateArea = (polygon: Point[]): number => {
  if (polygon.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y;
    area -= polygon[j].x * polygon[i].y;
  }
  return Math.abs(area / 2);
};