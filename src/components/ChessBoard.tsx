import React, { useState, useEffect } from "react";
import { fetchBoard, makeMove, fetchValidMoves } from "../api";

// importă piesele SVG
import wK from "../assets/pieces/wK.svg";
import wQ from "../assets/pieces/wQ.svg";
import wR from "../assets/pieces/wR.svg";
import wB from "../assets/pieces/wB.svg";
import wN from "../assets/pieces/wN.svg";
import wP from "../assets/pieces/wP.svg";
import bK from "../assets/pieces/bK.svg";
import bQ from "../assets/pieces/bQ.svg";
import bR from "../assets/pieces/bR.svg";
import bB from "../assets/pieces/bB.svg";
import bN from "../assets/pieces/bN.svg";
import bP from "../assets/pieces/bP.svg";

const pieceMap: { [key: string]: string } = {
  wK: wK,
  wQ: wQ,
  wR: wR,
  wB: wB,
  wN: wN,
  wP: wP,
  bK: bK,
  bQ: bQ,
  bR: bR,
  bB: bB,
  bN: bN,
  bP: bP,
};

function toAlgebraic(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return files[col] + (8 - row);
}

const ChessBoard = () => {
  const [board, setBoard] = useState<string[][]>([]);

  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);

  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);

  const [lastMove, setLastMove] = useState<{ from: { row: number; col: number }, to: { row: number; col: number } } | null>(null);

  const handleSquareClick = async (row: number, col: number) => {
    const piece = board[row][col];
  
    // Dacă nu e nimic selectat și dai click pe o piesă
    if (!selectedSquare && piece) {
      setSelectedSquare({ row, col });
      const from = toAlgebraic(row, col);
      const moves = await fetchValidMoves(from); // apelează API-ul
      const targets = moves.map((square) => {
        const col = square.charCodeAt(0) - "a".charCodeAt(0);
        const row = 8 - Number(square[1]);
        return { row, col };
      });

      setValidMoves(targets);

      return;
    }
  
    // Dacă ai selectat deja o piesă
    if (selectedSquare) {
      const from = toAlgebraic(selectedSquare.row, selectedSquare.col);
      const to = toAlgebraic(row, col);
  
      try {
        const moveResult = await makeMove(from, to); // apel API către backend
        if (!moveResult) {
          alert("Mutare invalidă!");
          setSelectedSquare(null);
          return;
        }
        setLastMove({
          from: { row: selectedSquare.row, col: selectedSquare.col },
          to: { row, col },
        });
        const newBoard = await fetchBoard(); // reîncarcă tabla actualizată
        setBoard(newBoard);
        setSelectedSquare(null);
      } catch (error) {
        alert("Mutare invalidă!");
        setSelectedSquare(null);
      }
    }
    setValidMoves([]);
  };

  useEffect(() => {
    const loadBoard = async () => {
      const data = await fetchBoard(); // [["r", "n", "b", ...], ...]
      console.log("Datele primite de la API:");
      (data as (string | null)[][]).forEach((row, i) => {
        console.log(`Rând ${i}:`, row);
      });
      setBoard(data);
    };
    loadBoard();
  }, []);

  return (
    <div className="grid grid-cols-8 border-4 border-black w-fit">
      {board.map((row, rowIndex) =>
        row.map((pieceCode, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const bgColor = isDark ? "bg-green-700" : "bg-green-100";
          const isHighlighted = validMoves.some(
            (m) => m.row === rowIndex && m.col === colIndex
          );
          const highlightClass = isHighlighted ? "ring-2 ring-blue-500" : "";
          const isLastMoveSquare =
          (lastMove?.from.row === rowIndex && lastMove?.from.col === colIndex) ||
          (lastMove?.to.row === rowIndex && lastMove?.to.col === colIndex);

          const lastMoveHighlight = isLastMoveSquare ? 'bg-yellow-300' : '';
          return (
            <div key={`${rowIndex}-${colIndex}`} className={`w-16 h-16 ${bgColor} ${highlightClass} ${lastMoveHighlight} flex items-center justify-center`} onClick={() => handleSquareClick(rowIndex, colIndex)}>
              {pieceCode && pieceMap[pieceCode] && (
                <img src={pieceMap[pieceCode]} alt={pieceCode} className="w-12 h-12" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
