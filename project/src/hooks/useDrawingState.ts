import { useState, useCallback } from 'react';
import { Point, Line, ParcelLine, SelectionPhase } from '../types/drawing';

interface DrawingState {
  points: Point[];
  lines: Line[];
  polygon: Point[];
  selectedEdges: ParcelLine[];
  selectionPhase: SelectionPhase;
  isDrawingMode: boolean;
  isPanMode: boolean;
  isDeleteMode: boolean;
  isEdgeSelectionMode: boolean;
}

export const useDrawingState = () => {
  const [state, setState] = useState<DrawingState>({
    points: [],
    lines: [],
    polygon: [],
    selectedEdges: [],
    selectionPhase: 'road',
    isDrawingMode: false,
    isPanMode: true,
    isDeleteMode: false,
    isEdgeSelectionMode: false
  });

  const setPoints = useCallback((points: Point[]) => {
    setState(prev => ({ ...prev, points }));
  }, []);

  const addPoint = useCallback((point: Point) => {
    setState(prev => ({
      ...prev,
      points: [...prev.points, point]
    }));
  }, []);

  const deletePoint = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index)
    }));
  }, []);

  const setLines = useCallback((lines: Line[]) => {
    setState(prev => ({ ...prev, lines }));
  }, []);

  const setPolygon = useCallback((polygon: Point[]) => {
    setState(prev => ({ ...prev, polygon }));
  }, []);

  const addSelectedEdge = useCallback((edge: ParcelLine) => {
    setState(prev => ({
      ...prev,
      selectedEdges: [...prev.selectedEdges, edge]
    }));
  }, []);

  const removeSelectedEdge = useCallback((edge: ParcelLine) => {
    setState(prev => ({
      ...prev,
      selectedEdges: prev.selectedEdges.filter(e =>
        !(e.start.x === edge.start.x && e.start.y === edge.start.y &&
          e.end.x === edge.end.x && e.end.y === edge.end.y)
      )
    }));
  }, []);

  const setSelectionPhase = useCallback((phase: SelectionPhase) => {
    setState(prev => ({ ...prev, selectionPhase: phase }));
  }, []);

  const toggleDrawingMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDrawingMode: !prev.isDrawingMode,
      isPanMode: false,
      isDeleteMode: false
    }));
  }, []);

  const togglePanMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPanMode: !prev.isPanMode,
      isDrawingMode: false,
      isDeleteMode: false
    }));
  }, []);

  const toggleDeleteMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDeleteMode: !prev.isDeleteMode,
      isDrawingMode: false,
      isPanMode: false
    }));
  }, []);

  const setEdgeSelectionMode = useCallback((enabled: boolean) => {
    setState(prev => ({
      ...prev,
      isEdgeSelectionMode: enabled
    }));
  }, []);

  return {
    state,
    setPoints,
    addPoint,
    deletePoint,
    setLines,
    setPolygon,
    addSelectedEdge,
    removeSelectedEdge,
    setSelectionPhase,
    toggleDrawingMode,
    togglePanMode,
    toggleDeleteMode,
    setEdgeSelectionMode
  };
};