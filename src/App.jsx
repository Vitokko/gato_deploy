import { useEffect, useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';

// Traducción de nombres por defecto
const JUGADORES = {
  X: 'Jugador 1',
  O: 'Jugador 2'
};

const TABLERO_INICIAL = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...TABLERO_INICIAL.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

export default function App() {
  const [players, setPlayers] = useState(JUGADORES);
  const [gameTurns, setGameTurns] = useState([]);

  // ⬇️ Marcador acumulado
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  // Flag para no sumar dos veces durante el mismo "Game Over"
  const [scoredThisRound, setScoredThisRound] = useState(false);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  // Sumar al marcador cuando termina la partida (una sola vez)
  useEffect(() => {
    if (scoredThisRound) return;

    if (winner) {
      // winner es el nombre del jugador; necesitamos saber si fue X u O
      // Buscamos qué símbolo tiene ese nombre actualmente
      const symbolWon = Object.keys(players).find(sym => players[sym] === winner);
      if (symbolWon === 'X' || symbolWon === 'O') {
        setScore(prev => ({ ...prev, [symbolWon]: prev[symbolWon] + 1 }));
        setScoredThisRound(true);
      }
    } else if (hasDraw) {
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      setScoredThisRound(true);
    }
  }, [winner, hasDraw, players, scoredThisRound]);

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      // Si ya terminó la partida, no permitir más jugadas
      if (winner || hasDraw) return prevTurns;

      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
    setScoredThisRound(false); // permitir sumar en la próxima partida
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  function handleResetScore() {
    setScore({ X: 0, O: 0, draws: 0 });
  }

  // Estilos mínimos en línea para el marcador (luego lo pasamos a CSS)
const scoreboardStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0.75rem 0 2.5rem',      
  padding: '0.6rem 0.8rem',
  borderRadius: '12px',
  background: '#f3f4f6',
  border: '1px solid #e5e7eb'
};
  const badgeStyle = {
    padding: '0.35rem 0.6rem',
    borderRadius: '999px',
    fontWeight: 600,
    background: '#fff',
    border: '1px solid #e5e7eb'
  };
  const resetBtnStyle = {
    marginLeft: '0.25rem',
    border: 'none',
    background: '#111827',
    color: '#fff',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    cursor: 'pointer'
  };

  return (
    <main>
      <div id="game-container">
        <h1 style={{ textAlign: 'center', marginTop: 0 }}>🎮 Tres en Raya</h1>

        <ol id="players" className="highlight-player">
          <Player
            initialName={JUGADORES.X}
            symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={JUGADORES.O}
            symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>

        {/* Marcador acumulado */}
        <div className="scoreboard" style={scoreboardStyle} aria-label="Marcador">
          <span style={badgeStyle}>🏆 X: {score.X}</span>
          <span style={badgeStyle}>🏆 O: {score.O}</span>
          <span style={badgeStyle}>🤝 Empates: {score.draws}</span>
          <button
            onClick={handleResetScore}
            style={resetBtnStyle}
            title="Reiniciar marcador"
            aria-label="Reiniciar marcador"
          >
            Reiniciar marcador
          </button>
        </div>

        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}

        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>

      <Log turns={gameTurns} />
    </main>
  );
}
