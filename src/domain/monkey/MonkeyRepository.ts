import type { Monkey, MonkeyDetail } from './Monkey'

export interface MonkeyRepository {
  getAll(): Promise<Monkey[]>
  getById(id: number): Promise<MonkeyDetail>
}
