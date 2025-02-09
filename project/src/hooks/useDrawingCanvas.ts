/**
 * Custom hook for managing canvas interactions and transformations.
 * Handles zoom, pan, and cursor state for the drawing canvas.
 */

import { useRef, useEffect, useState } from 'react';
import { Point, CursorStyle } from '../types/drawing';

interface UseDrawingCanvasProps {
  scale: number;
  offset: Point;
  onScaleChange: (scale: number) => void;
  onOffsetChange: (offset: Point) => void;
}

export const useDrawingCanvas = ({
  scale,
  offset,
  onScaleChange,
  onOffsetChange
}: UseDrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<Point | null>(null);
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>('default');
  const [cursorResetTimer, setCursorResetTimer] = useState<number>(0);

  // Handle mouse wheel events for zooming
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom parameters
    const zoomSpeed = 0.05;
    const zoomFactor = e.deltaY < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
    const newScale = scale * zoomFactor;

    // Calculate new offset to zoom towards mouse position
    const worldX = (mouseX - offset.x) / scale;
    const worldY = (window.innerHeight - mouseY - offset.y) / scale;
    const newOffsetX = mouseX - worldX * newScale;
    const newOffsetY = window.innerHeight - mouseY - worldY * newScale;

    // Update cursor style temporarily
    setCursorStyle(e.deltaY < 0 ? 'zoom-in' : 'zoom-out');
    
    // Reset cursor style after delay
    clearTimeout(cursorResetTimer);
    const timer = window.setTimeout(() => {
      setCursorStyle('default');
    }, 300);
    setCursorResetTimer(timer);

    // Update scale and offset
    onScaleChange(newScale);
    onOffsetChange({ x: newOffsetX, y: newOffsetY });
  };

  // Set up wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [scale, offset]);

  return {
    canvasRef,
    isDragging,
    setIsDragging,
    lastPanPosition,
    setLastPanPosition,
    cursorStyle,
    setCursorStyle
  };
};