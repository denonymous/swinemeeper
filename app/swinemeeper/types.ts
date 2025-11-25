export type Coords = {
  x: number
  y: number
}

export type Cell = {
  coords: Coords
  isHidden: boolean
  isMine: boolean
  isFlagged: boolean
}

export type GameStatus = 'IN PROGRESS' | 'WON' | 'LOST'
