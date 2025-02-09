import React, { useRef, useEffect, useState } from 'react';
import { Point, Line } from '../../types/drawing';

interface CanvasProps {
  points: Point[];
  lines: Line[];
  selectedEdges: Line[];
  polygon: Point[];
  scale: number;
  offset: Point;
  gridSize: number;
  calculatedArea: number | null;
  isPanMode: boolean;
  cursorStyle: 'crosshair' | 'grab' | 'grabbing' | 'no-drop' | 'zoom-in' | 'zoom-out' | 'default' | 'pointer';
  onCanvasClick: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  points,
  lines,
  selectedEdges,
  polygon,
  scale,
  offset,
  gridSize,
  calculatedArea,
  isPanMode,
  cursorStyle: propCursorStyle,
  onCanvasClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const [hoveredLine, setHoveredLine] = useState<Line | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    context.current = canvasRef.current.getContext('2d');
    handleResize();
  }, []);

  const getDistanceFromPointToLine = (point: Point, line: Line) => {
    const A = point.x - line.start.x;
    const B = point.y - line.start.y;
    const C = line.end.x - line.start.x;
    const D = line.end.y - line.start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = line.start.x;
      yy = line.start.y;
    } else if (param > 1) {
      xx = line.end.x;
      yy = line.end.y;
    } else {
      xx = line.start.x + param * C;
      yy = line.start.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseMoveForHover = (e: React.MouseEvent) => {
    if (!canvasRef.current || isPanMode) {
      setHoveredLine(null);
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - offset.x) / scale;
    const canvasHeight = canvasRef.current.height;
    const mouseY = (canvasHeight - (e.clientY - rect.top) - offset.y) / scale;
    const mousePoint = { x: mouseX, y: mouseY };

    let closestLine: Line | null = null;
    let minDistance = Infinity;

    lines.forEach(line => {
      const distance = getDistanceFromPointToLine(mousePoint, line);
      if (distance < minDistance && distance < 10 / scale) {
        minDistance = distance;
        closestLine = line;
      }
    });

    setHoveredLine(closestLine);
  };

  const drawBaseGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, size: number) => {
    const range = 2 * Math.max(width, height);

    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2 / scale;
    ctx.moveTo(-range, 0);
    ctx.lineTo(range, 0);
    ctx.moveTo(0, -range);
    ctx.lineTo(0, range);
    ctx.stroke();

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1 / scale;

    for (let x = -range; x <= range; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, -range);
      ctx.lineTo(x, range);
      ctx.stroke();

      if ((Math.abs(x) / size) % 5 === 0) {
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1 / scale;

        ctx.save();
        ctx.scale(1, -1);
        ctx.fillStyle = '#6b7280';
        ctx.font = `${12 / scale}px Arial`;
        ctx.fillText(`${x}`, x - (10 / scale), (20 / scale));
        ctx.restore();
      }
    }

    for (let y = -range; y <= range; y += size) {
      ctx.beginPath();
      ctx.moveTo(-range, y);
      ctx.lineTo(range, y);
      ctx.stroke();

      if ((Math.abs(y) / size) % 5 === 0) {
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1 / scale;

        ctx.save();
        ctx.scale(1, -1);
        ctx.fillStyle = '#6b7280';
        ctx.font = `${12 / scale}px Arial`;
        ctx.fillText(`${y}`, -(30 / scale), -y + (4 / scale));
        ctx.restore();
      }
    }

    ctx.save();
    ctx.scale(1, -1);
    ctx.fillStyle = '#000000';
    ctx.font = `${12 / scale}px Arial`;
    ctx.fillText('0', -(15 / scale), (15 / scale));
    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.save();
    
    const effectiveGridSize = gridSize * scale;
    const minGridSpacing = 50;
    
    if (effectiveGridSize < minGridSpacing) {
      const ratio = Math.ceil(minGridSpacing / effectiveGridSize);
      drawBaseGrid(ctx, canvasWidth, canvasHeight, gridSize * ratio);
    } else {
      drawBaseGrid(ctx, canvasWidth, canvasHeight, gridSize);
    }

    ctx.restore();
  };

  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pointSize = 4;
    const labelOffset = 8;
    
    const screenX = offset.x + x * scale;
    const screenY = canvasRef.current!.height - offset.y - y * scale;

    ctx.beginPath();
    ctx.arc(screenX, screenY, pointSize, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff0000';
    ctx.fill();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(
      `(${x.toFixed(2)}, ${y.toFixed(2)})`,
      screenX + labelOffset,
      screenY - labelOffset
    );
    ctx.restore();
  };

  const fillPolygon = (ctx: CanvasRenderingContext2D) => {
    if (polygon.length < 3) return;

    ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
    ctx.beginPath();
    
    const firstPoint = polygon[0];
    ctx.moveTo(
      offset.x + firstPoint.x * scale,
      canvasRef.current!.height - offset.y - firstPoint.y * scale
    );

    polygon.slice(1).forEach(point => {
      ctx.lineTo(
        offset.x + point.x * scale,
        canvasRef.current!.height - offset.y - point.y * scale
      );
    });

    ctx.closePath();
    ctx.fill();
  };

  const drawLines = (ctx: CanvasRenderingContext2D) => {
    lines.forEach(line => {
      const startX = offset.x + line.start.x * scale;
      const startY = canvasRef.current!.height - offset.y - line.start.y * scale;
      const endX = offset.x + line.end.x * scale;
      const endY = canvasRef.current!.height - offset.y - line.end.y * scale;

      const isSelected = selectedEdges.some(
        edge => 
          (edge.start.x === line.start.x && edge.start.y === line.start.y &&
           edge.end.x === line.end.x && edge.end.y === line.end.y) ||
          (edge.start.x === line.end.x && edge.start.y === line.end.y &&
           edge.end.x === line.start.x && edge.end.y === line.start.y)
      );

      const isHovered = hoveredLine && 
        ((line.start.x === hoveredLine.start.x && line.start.y === hoveredLine.start.y &&
          line.end.x === hoveredLine.end.x && line.end.y === hoveredLine.end.y) ||
         (line.start.x === hoveredLine.end.x && line.start.y === hoveredLine.end.y &&
          line.end.x === hoveredLine.start.x && line.end.y === hoveredLine.start.y));

      ctx.strokeStyle = isSelected ? '#3B82F6' : isHovered ? '#60A5FA' : '#2c3e50';
      ctx.lineWidth = isSelected || isHovered ? 3 : 2;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });
  };

  const handleResize = () => {
    if (!canvasRef.current || !context.current) return;

    const canvas = canvasRef.current;
    const ctx = context.current;

    canvas.width = canvas.parentElement!.clientWidth;
    canvas.height = canvas.parentElement!.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    fillPolygon(ctx);
    drawLines(ctx);
    points.forEach((p) => drawPoint(ctx, p.x, p.y));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [points, offset, scale, selectedEdges, hoveredLine]);

  const getCursorStyle = () => {
    if (isPanMode) return propCursorStyle;
    if (hoveredLine) return 'pointer';
    return 'default';
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={onCanvasClick}
      onMouseDown={onMouseDown}
      onMouseMove={(e) => {
        handleMouseMoveForHover(e);
        onMouseMove(e);
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={() => {
        setHoveredLine(null);
        onMouseLeave();
      }}
      className="w-full h-full"
      style={{ cursor: getCursorStyle() }}
    />
  );
};

export default Canvas;