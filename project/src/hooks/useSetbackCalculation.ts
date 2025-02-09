import { useState, useCallback } from 'react';
import { Point, ParcelLine, SetbackLine } from '../types/drawing';
import { calculateSetbackLines } from '../utils/drawing';

export function useSetbackCalculation() {
  const [selectedEdges, setSelectedEdges] = useState<ParcelLine[]>([]);
  const [selectionPhase, setSelectionPhase] = useState<'road' | 'adjacent' | 'complete'>('road');
  const [setbackLines, setSetbackLines] = useState<SetbackLine[]>([]);

  const handleEdgeSelection = useCallback((line: ParcelLine) => {
    setSelectedEdges(prev => {
      const isSelected = prev.some(edge => 
        (edge.start.x === line.start.x && edge.start.y === line.start.y &&
         edge.end.x === line.end.x && edge.end.y === line.end.y) ||
        (edge.start.x === line.end.x && edge.start.y === line.end.y &&
         edge.end.x === line.start.x && edge.end.y === line.start.y)
      );

      if (isSelected) {
        return prev.filter(edge => 
          !(edge.start.x === line.start.x && edge.start.y === line.start.y &&
            edge.end.x === line.end.x && edge.end.y === line.end.y) &&
          !(edge.start.x === line.end.x && edge.start.y === line.end.y &&
            edge.end.x === line.start.x && edge.end.y === line.start.y)
        );
      }

      return [...prev, { ...line, type: selectionPhase === 'road' ? 'road' : 'adjacent' }];
    });
  }, [selectionPhase]);

  const calculateSetbacks = useCallback((frontSetback: number, sideSetback: number, rearSetback: number) => {
    const newSetbackLines = calculateSetbackLines(selectedEdges, frontSetback, sideSetback, rearSetback);
    setSetbackLines(newSetbackLines);
  }, [selectedEdges]);

  return {
    selectedEdges,
    selectionPhase,
    setbackLines,
    setSelectionPhase,
    handleEdgeSelection,
    calculateSetbacks
  };
}