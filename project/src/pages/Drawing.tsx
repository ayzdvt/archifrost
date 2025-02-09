import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Canvas from '../components/drawing/Canvas';
import Toolbar from '../components/drawing/Toolbar';
import ChatBot from '../components/ChatBot';
import { Point, Line, Project } from '../types/drawing';
import { roundToTwoDecimals, sortPoints, linesIntersect, calculateArea } from '../utils/geometry';

export default function Drawing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 50, y: 50 }); 
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [polygon, setPolygon] = useState<Point[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPanMode, setIsPanMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<Point | null>(null);
  const [cursorStyle, setCursorStyle] = useState<'crosshair' | 'grab' | 'grabbing' | 'no-drop' | 'zoom-in' | 'zoom-out' | 'default' | 'pointer'>('default');
  const [cursorResetTimer, setCursorResetTimer] = useState<number>(0);
  const [gridSize] = useState(50);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);
  const [areaWarning, setAreaWarning] = useState<string>('');
  const [initialFitDone, setInitialFitDone] = useState(false);
  const [isEdgeSelectionMode, setIsEdgeSelectionMode] = useState(false);
  const [selectedEdges, setSelectedEdges] = useState<Line[]>([]);

  const buildOptimalPolygon = () => {
    if (points.length < 3) return;

    const sortedPoints = sortPoints(points);
    let currentPolygon: Point[] = [];
    let remainingPoints = [...sortedPoints];
    let attempts = 0;

    setLines([]);

    while (remainingPoints.length > 0 && attempts < 100) {
      const currentPoint = remainingPoints.shift()!;
      currentPolygon.push(currentPoint);

      if (currentPolygon.length >= 2) {
        const newLine = {
          start: currentPolygon[currentPolygon.length - 2],
          end: currentPoint
        };

        const hasIntersection = lines.some(existingLine => 
          linesIntersect(newLine, existingLine)
        );

        if (hasIntersection) {
          currentPolygon.pop();
          remainingPoints.push(currentPoint);
          attempts++;
        } else {
          setLines(prev => [...prev, newLine]);
          attempts = 0;
        }
      }
    }

    if (currentPolygon.length >= 3) {
      const closingLine = {
        start: currentPolygon[currentPolygon.length - 1],
        end: currentPolygon[0]
      };

      if (!lines.some(line => linesIntersect(closingLine, line))) {
        setLines(prev => [...prev, closingLine]);
        setPolygon(currentPolygon);
      }
    }
  };

  const handleSave = async () => {
    if (!id || points.length === 0) return;

    setSaving(true);
    try {
      const roundedPoints = points.map(p => ({
        x: roundToTwoDecimals(p.x),
        y: roundToTwoDecimals(p.y)
      }));

      const { error } = await supabase
        .from('projects')
        .update({ parcel_coordinates: roundedPoints })
        .eq('id', id);

      if (error) throw error;
      alert('Koordinatlar başarıyla kaydedildi');
    } catch (err) {
      console.error('Kayıt hatası:', err);
      alert('Koordinatlar kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (points.length >= 3) {
      buildOptimalPolygon();
      const area = calculateArea(polygon);
      setCalculatedArea(area);

      if (projectData?.land_area) {
        const difference = Math.abs(area - projectData.land_area);
        const percentDifference = (difference / projectData.land_area) * 100;

        if (percentDifference > 5) {
          setAreaWarning(
            `Dikkat: Çizilen alan (${area.toFixed(2)}m²) ile belgede belirtilen alan ` +
            `(${projectData.land_area}m²) arasında %${percentDifference.toFixed(1)} fark var!`
          );
        } else {
          setAreaWarning('');
        }
      }
    } else {
      setCalculatedArea(null);
      setAreaWarning('');
    }
  }, [points, projectData?.land_area]);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomSpeed = 0.05;
    const zoomFactor = e.deltaY < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
    
    const newScale = scale * zoomFactor;

    const worldX = (mouseX - offset.x) / scale;
    const worldY = (window.innerHeight - mouseY - offset.y) / scale;

    const newOffsetX = mouseX - worldX * newScale;
    const newOffsetY = window.innerHeight - mouseY - worldY * newScale;

    setCursorStyle(e.deltaY < 0 ? 'zoom-in' : 'zoom-out');
    
    clearTimeout(cursorResetTimer);
    const timer = window.setTimeout(() => {
      setCursorByMode();
    }, 300);
    setCursorResetTimer(timer);

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleStartEdgeSelection = () => {
    setIsEdgeSelectionMode(true);
    setIsPanMode(false);
  };

  const handleCompleteEdgeSelection = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          road_frontages: selectedEdges.map(edge => ({
            start: { x: edge.start.x, y: edge.start.y },
            end: { x: edge.end.x, y: edge.end.y }
          }))
        })
        .eq('id', id);

      if (error) throw error;

      setIsEdgeSelectionMode(false);
      setIsPanMode(true);
    } catch (err) {
      console.error('Yol cepheleri kaydedilirken hata:', err);
      setError('Yol cepheleri kaydedilemedi');
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!wrapperRef.current || !isEdgeSelectionMode) return;
    
    const rect = wrapperRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const canvasHeight = wrapperRef.current.clientHeight;

    const realX = (mouseX - offset.x) / scale;
    const realY = (canvasHeight - mouseY - offset.y) / scale;

    const clickPoint = { x: realX, y: realY };
    let closestLine: Line | null = null;
    let minDistance = Infinity;

    lines.forEach(line => {
      const distance = getDistanceFromPointToLine(clickPoint, line);
      if (distance < minDistance && distance < 10 / scale) {
        minDistance = distance;
        closestLine = line;
      }
    });

    if (closestLine) {
      const isSelected = selectedEdges.some(
        edge => 
          (edge.start.x === closestLine!.start.x && edge.start.y === closestLine!.start.y &&
           edge.end.x === closestLine!.end.x && edge.end.y === closestLine!.end.y) ||
          (edge.start.x === closestLine!.end.x && edge.start.y === closestLine!.end.y &&
           edge.end.x === closestLine!.start.x && edge.end.y === closestLine!.start.y)
      );

      if (isSelected) {
        setSelectedEdges(prev => prev.filter(edge => 
          !(edge.start.x === closestLine!.start.x && edge.start.y === closestLine!.start.y &&
            edge.end.x === closestLine!.end.x && edge.end.y === closestLine!.end.y) &&
          !(edge.start.x === closestLine!.end.x && edge.start.y === closestLine!.end.y &&
            edge.end.x === closestLine!.start.x && edge.end.y === closestLine!.start.y)
        ));
      } else {
        setSelectedEdges(prev => [...prev, closestLine!]);
      }
    }
  };

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanMode) return;
    setIsDragging(true);
    setLastPanPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !lastPanPosition || !isPanMode) return;

    const dx = e.clientX - lastPanPosition.x;
    const dy = e.clientY - lastPanPosition.y;

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y - dy,
    }));

    setLastPanPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastPanPosition(null);
  };

  const setCursorByMode = () => {
    if (isPanMode) {
      setCursorStyle(isDragging ? 'grabbing' : 'grab');
    } else {
      setCursorStyle('default');
    }
  };

  useEffect(() => {
    setCursorByMode();
  }, [isPanMode, isDragging]);

  const togglePanMode = () => {
    setIsPanMode(!isPanMode);
  };

  const fitAllPoints = () => {
    if (!wrapperRef.current || points.length === 0) return;
    
    const headerHeight = 180;
    const width = wrapperRef.current.clientWidth;
    const height = window.innerHeight - headerHeight;

    const xCoords = points.map(p => p.x);
    const yCoords = points.map(p => p.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const boundingWidth = maxX - minX;
    const boundingHeight = maxY - minY;

    if (boundingWidth === 0 && boundingHeight === 0) {
      setScale(1);
      setOffset({ x: width / 2 - minX, y: height / 2 - minY });
      return;
    }

    const margin = 50;
    const availableWidth = width - 2 * margin;
    const availableHeight = height - 2 * margin;

    const scaleX = availableWidth / boundingWidth;
    const scaleY = availableHeight / boundingHeight;
    let newScale = Math.min(scaleX, scaleY);
    newScale = Math.min(Math.max(newScale, 0.1), 10);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const newOffsetX = width / 2 - centerX * newScale;
    const newOffsetY = height - (height / 2) - centerY * newScale;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('parcel_coordinates, land_area')
          .eq('id', id)
          .single();

        if (error) throw error;

        setProjectData(data);

        if (data?.parcel_coordinates) {
          const roundedCoordinates = data.parcel_coordinates.map((point: Point) => ({
            x: roundToTwoDecimals(point.x),
            y: roundToTwoDecimals(point.y)
          }));
          setPoints(roundedCoordinates);
          
          requestAnimationFrame(() => {
            fitAllPoints();
            setInitialFitDone(true);
          });
        }
      } catch (err) {
        console.error('Proje verileri yüklenirken hata:', err);
        setError('Proje verileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [id]);

  useEffect(() => {
    if (!initialFitDone && !loading && points.length > 0) {
      fitAllPoints();
      setInitialFitDone(true);
    }
  }, [loading, initialFitDone, points]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    wrapper.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
    };
  }, [scale, offset, isPanMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/project/${id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Geri
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Çizim Ekranı</h1>
              {calculatedArea !== null && (
                <p className="text-sm text-gray-600">
                  Çizilen Alan: {calculatedArea.toFixed(2)}m²
                  {projectData?.land_area && (
                    <span className="ml-2">
                      (Belgedeki Alan: {projectData.land_area}m²)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          
          <Toolbar
            isPanMode={isPanMode}
            saving={saving}
            hasPoints={points.length > 0}
            onTogglePan={togglePanMode}
            onFitAll={fitAllPoints}
            onSave={handleSave}
          />
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div ref={wrapperRef} className="w-full h-full">
          <Canvas
            points={points}
            lines={lines}
            selectedEdges={selectedEdges}
            polygon={polygon}
            scale={scale}
            offset={offset}
            gridSize={gridSize}
            calculatedArea={calculatedArea}
            isPanMode={isPanMode}
            cursorStyle={cursorStyle}
            onCanvasClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      <ChatBot 
        onStartEdgeSelection={handleStartEdgeSelection}
        onCompleteSelection={handleCompleteEdgeSelection}
        selectedEdgesCount={selectedEdges.length}
      />
    </div>
  );
}