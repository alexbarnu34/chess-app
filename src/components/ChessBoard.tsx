import React from 'react';
import wK from '../assets/pieces/wK.svg';
import wQ from '../assets/pieces/wQ.svg';
import wR from '../assets/pieces/wR.svg';
import wB from '../assets/pieces/wB.svg';
import wN from '../assets/pieces/wN.svg';
import wP from '../assets/pieces/wP.svg';
import bK from '../assets/pieces/bK.svg';
import bQ from '../assets/pieces/bQ.svg';
import bR from '../assets/pieces/bR.svg';
import bB from '../assets/pieces/bB.svg';
import bN from '../assets/pieces/bN.svg';
import bP from '../assets/pieces/bP.svg';
import { useState } from "react";
import { Chess , Square} from 'chess.js';

const chess = new Chess();

function toAlgebraic(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return files[col] + (8 - row);
}

const pieceMap: { [key: string]: string } = {
    wK, wQ, wR, wB, wN, wP,
    bK, bQ, bR, bB, bN, bP,
  };

  const ChessBoard = () => {

    const [board, setBoard] = useState<(string | null)[][]>([
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ]);

    const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);

    function handleSquareClick(row: number, col: number) {
      const piece = board[row][col];

      if (selected === null) {
        if (piece) {
          setSelected({ row, col });
        }
      } else {
        if (selected.row === row && selected.col === col) {
          setSelected(null);
          return;
        }

        const from = toAlgebraic(selected.row, selected.col);
        const to = toAlgebraic(row, col);

        const move = chess.move({ from, to });

        if (move) {
          const newBoard = Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => {
              const square = toAlgebraic(r, c) as Square;
              const piece = chess.get(square);
          
              if (piece) {
                const color = piece.color === 'w' ? 'w' : 'b';
                const type = piece.type.toUpperCase(); // r, n, b, etc.
                return color + type;
              }
          
              return null;
            })
          );

          setBoard(newBoard);
        }

        setSelected(null);
      }
    }

    return (
      <div className="grid grid-cols-8 border-4 border-black w-fit">
        {board.map((row, rowIndex) =>
          row.map((pieceCode, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const bgColor = isDark ? 'bg-green-700' : 'bg-green-100';
            return (
              <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              className={`w-16 h-16 ${bgColor} flex items-center justify-center 
                ${selected?.row === rowIndex && selected?.col === colIndex ? 'ring-4 ring-yellow-400' : ''}`}
            >
              {pieceCode && (
                <img
                  src={pieceMap[pieceCode]}
                  alt={pieceCode}
                  className="w-10 h-10 select-none pointer-events-none"
                />
              )}
            </div>
            );
          })
        )}
      </div>
    );
  };

  export default ChessBoard;