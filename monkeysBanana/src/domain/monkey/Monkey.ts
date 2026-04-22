export type Monkey = {
  id: number
  name: string
}

export type MonkeyDetail = Monkey & {
  banana: number
}
