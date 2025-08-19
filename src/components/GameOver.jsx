export default function GameOver({ winner, onRestart }) {
  return (
    <div id="game-over" role="dialog" aria-live="assertive" aria-label="Fin de la partida">
      <h2>¡Fin de la partida!</h2>

      {winner && <p>🏆 {winner} ganó</p>}
      {!winner && <p>🤝 ¡Empate!</p>}

      <p>
        <button onClick={onRestart} title="Nueva partida" aria-label="Nueva partida">
          Nueva partida 🔄
        </button>
      </p>
    </div>
  );
}
