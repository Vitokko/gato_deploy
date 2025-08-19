export default function Log({ turns }) {
  return (
    <ol id="log" aria-label="Historial de jugadas">
      {turns.map((turn) => {
        const fila = turn.square.row + 1;
        const columna = turn.square.col + 1;
        return (
          <li key={`${turn.square.row}${turn.square.col}`}>
            {turn.player} marcó en fila {fila}, columna {columna}
          </li>
        );
      })}
    </ol>
  );
}