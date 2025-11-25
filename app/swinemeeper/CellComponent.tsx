import type { Cell } from './types'

type Props = {
  cell: Cell
  neighborMineCount: number
  clickCallback: (cell: Cell) => void
  rightClickCallback: (cell: Cell) => void
}

export function CellComponent({ cell, neighborMineCount, clickCallback, rightClickCallback }: Props) {
  const bgColor = cell.isHidden
    ? '#ccc'
    : cell.isMine
      ? '#600'
      : '#cfc'

  return (
    <span 
      onClick={() => clickCallback(cell)}
      onContextMenu={(e) => {
        e.preventDefault()
        rightClickCallback(cell)
      }}
      style={{
        gridColumnStart: cell.coords.y + 1,
        gridRowStart: cell.coords.x + 1,
        backgroundColor: bgColor,
      }}
      className="cell"
    >
      {
        cell.isHidden && cell.isFlagged
          ? <Flag />
          : cell.isHidden
            ? null
            : cell.isMine
              ? <Swine />
              : neighborMineCount || <Meep />
      }
    </span>
  )
}

function Swine() {
  return (
    <span role="img" aria-label={'swine'}>
        {String.fromCodePoint(128055)}
    </span>
  )
}

function Meep() {
  return (
    <span role="img" aria-label={'meep'}>
        {String.fromCodePoint(128037)}
    </span>
  )
}

function Flag() {
  return (
    <span role="img" aria-label={'meep'}>
        {String.fromCodePoint(128681)}
    </span>
  )
}
