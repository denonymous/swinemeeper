import { useCallback, useMemo, useState } from 'react'
import type { Cell, Coords, GameStatus } from './types'
import { CellComponent } from './CellComponent'

export function SwineMeeperComponent() {
  const rowCount = 16
  const colCount = 30
  const mineCount = 50

  const [cells, setCells] = useState<Map<string, Cell>>()
  const [status, setStatus] = useState<GameStatus>('IN PROGRESS')

  const newGameCallback = useCallback(() => {
    const f = generateCellMap(colCount, rowCount, mineCount)
    setCells(f)
  }, [])

  const onCellClick = (cell: Cell) => {
    const { status: evaluatedStatus, cells: evaluatedCells } = cells
      ? evaluateBoard(writeCellToMap({ ...cell, isHidden: false }, cells))
      : { status: 'IN PROGRESS' as GameStatus, cells }

    setCells(new Map(evaluatedCells))
    setStatus(evaluatedStatus)
  }

  const onCellRightClick = (cell: Cell) => {
    setCells(
      cells
        ? new Map(writeCellToMap({ ...cell, isFlagged: !cell.isFlagged }, cells))
        : cells
    )
  }

  useMemo(() => {
    if (status === 'LOST') {
      alert('OINK OINK OINK')
    } else if (status === 'WON') {
      alert('WINNER WINNER CHICKY DINNER')
    }
  }, [status])

  return (
    <>
      <span id="board">
        {
          cells && [ ...cells.values() ]
            .map((c) => {
              const neighborMineCount = findNeighbors(c.coords, cells).filter((c) => c.isMine).length
              return (
                <CellComponent
                  clickCallback={onCellClick}
                  rightClickCallback={onCellRightClick}
                  cell={c}
                  neighborMineCount={neighborMineCount}
                  key={JSON.stringify(c.coords)}
                />
              )
            })
        }
      </span>

      <div></div>

      <button onClick={newGameCallback} style={{ backgroundColor: '#ccc', border: '1px solid #000', padding: '8px', margin: '4px' }}>
        new game
      </button>
    </>
  )
}

const writeCellToMap = (cell: Cell, cells: Map<string, Cell>) => cells.set(JSON.stringify(cell.coords), cell)

const mapCells = (cells: readonly Cell[]): Map<string, Cell> =>
  cells.reduce((acc, curr) => writeCellToMap(curr, acc), new Map<string, Cell>())

const addNewMine = (mines: Set<string>, colCount: number, rowCount: number): Set<string> => {
  const x = Math.floor(Math.random() * rowCount)
  const y = Math.floor(Math.random() * colCount)
  const sCoords = JSON.stringify({ x, y })

  return mines.has(sCoords)
    ? addNewMine(mines, colCount, rowCount)
    : mines.add(sCoords)
}

const findNeighbors = (coords: Coords, cells: Map<string, Cell>): readonly Cell[] =>
  [ -1, 0, 1 ]
    .reduce((accY, yDifferential) => {
      const neighbors = [ -1, 0, 1 ]
        .reduce((accX, xDifferential) => {
          const neighborCoords = { x: coords.x + xDifferential, y: coords.y + yDifferential }
          const sNeighborCoords = JSON.stringify(neighborCoords)

          const validNeighbor = cells.get(sNeighborCoords)

          const isValid = validNeighbor
            && !(neighborCoords.x === coords.x && neighborCoords.y === coords.y)
          
          return isValid
            ? [ ...accX, validNeighbor ]
            : accX
        }, [] as readonly Cell[])
      
      return [ ...accY, ...neighbors ]
    }, [] as readonly Cell[])

const generateCellMap = (colCount: number, rowCount: number, mineCount: number): Map<string, Cell> => {
  const mines = [ ...Array<void>(mineCount) ]
    .reduce((acc) => addNewMine(acc, colCount, rowCount), new Set<string>())

  const cells = [ ...Array(colCount).keys() ].map<Cell[]>(
    (y) => [ ...Array(rowCount).keys() ].map<Cell>(
        (x) => {
          const coords = { x, y }

          return {
            coords,
            isFlagged: false,
            isHidden: true,
            isMine: mines.has(JSON.stringify(coords))
          }
        }
      )
  )
  .flat()

  return mapCells(cells)
}

const flipEmptyCells = (cells: Map<string, Cell>): Map<string, Cell> => {
  const emptyCell = [ ...cells.values() ]
    .find((cell) => {
      // if it's hidden or is a mine, skip
      if (cell.isHidden || cell.isMine) {
        return false
      }

      const neighbors = findNeighbors(cell.coords, cells)

      // if it's showing but has mine neighbors, skip
      if (!cell.isHidden && neighbors.find((cell) => cell.isMine)) {
        return false
      }

      // if it has unshown neighbors that are not a mine, skip
      if (!neighbors.find((cell) => !cell.isMine && cell.isHidden)) {
        return false
      }

      return (
        !cell.isHidden // uncovered
        && !cell.isMine  // not a mine
        && !neighbors.some((cell) => cell.isMine) // has no mine neighbors
        && neighbors.some((cell) => !cell.isMine && cell.isHidden) // has at least one neighbor that's hidden and not a mine
      )
    })
  
  if (!emptyCell) {
    return cells
  }

  const flippableNeighbors = findNeighbors(emptyCell.coords, cells)
    .filter((cell) => !cell.isMine && cell.isHidden)
  
  if (!flippableNeighbors) {
    return cells
  }

  const flipped = flippableNeighbors
    .reduce((acc, curr) => writeCellToMap({ ...curr, isHidden: false }, acc), cells)
  
  return flipEmptyCells(new Map(flipped))
}

const evaluateBoard = (cells: Map<string, Cell>): { status: GameStatus, cells: Map<string, Cell> } => {
  const flippedCells = flipEmptyCells(cells)
  
  const exploded = [ ...flippedCells.values() ].some((cell) => cell.isMine && !cell.isHidden)

  if (exploded) {
    return {
      status: 'LOST',
      cells: mapCells(
        [ ...flippedCells.values() ]
          .map((cell) => ({ ...cell, isHidden: false }))
      )
    }
  }

  const won = [ ...flippedCells.values() ].every((cell) => (cell.isMine && cell.isHidden) || !cell.isHidden)

  if (won) {
    return {
      status: 'WON',
      cells: mapCells(
        [ ...flippedCells.values() ]
          .map((cell) => ({ ...cell, isHidden: false }))
      )
    }
  }

  return {
    status: 'IN PROGRESS',
    cells: flippedCells
  }
}
