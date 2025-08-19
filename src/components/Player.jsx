import { useState } from 'react';

export default function Player({
  initialName,
  symbol,
  isActive,
  onChangeName,
}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    setIsEditing((editing) => !editing);

    if (isEditing) {
      onChangeName(symbol, playerName);
    }
  }

  function handleChange(event) {
    setPlayerName(event.target.value);
  }

  let editablePlayerName = <span className="player-name">{playerName}</span>;
  // let btnCaption = 'Editar';

  if (isEditing) {
    editablePlayerName = (
      <input
        type="text"
        required
        value={playerName}
        onChange={handleChange}
        placeholder="Ingresa un nombre…"
        aria-label={`Nombre para ${symbol}`}
        title={`Nombre para ${symbol}`}
      />
    );
    // btnCaption = 'Guardar';
  }

  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player" title={`Jugador ${symbol}`}>
        {editablePlayerName}
        <span className="player-symbol" aria-hidden="true">{symbol}</span>
      </span>
      <button
        onClick={handleEditClick}
        title={isEditing ? 'Guardar nombre' : 'Editar nombre'}
        aria-label={isEditing ? 'Guardar nombre' : 'Editar nombre'}
      >
        {isEditing ? 'Guardar ✔️' : 'Editar ✏️'}
      </button>
    </li>
  );
}
