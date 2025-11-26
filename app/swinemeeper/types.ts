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

export type GameStatus = 'NONE' | 'IN PROGRESS' | 'WON' | 'LOST'

export type Settings = {
  colCount: number
  mineCount: number
  rowCount: number
}

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'


//   {
//   'BEGINNER': {
//     colCount: 8,
//     mineCount: 10,
//     rowCount: 8
//   },
//   'INTERMEDIATE': {
//     colCount: 16,
//     mineCount: 40,
//     rowCount: 16
//   },
//   'EXPERT': {
//     colCount: 30,
//     mineCount: 99,
//     rowCount: 16
//   }
// }

// export type Difficulties = typeof difficulties
// export type Difficulty = keyof Difficulties

// const f: Difficulty = 'BEGINNER'
// const g = difficulties[f]
