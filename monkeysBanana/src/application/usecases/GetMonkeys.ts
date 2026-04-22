import type { Monkey, MonkeyDetail } from '../../domain/monkey/Monkey'
import type { MonkeyRepository } from '../../domain/monkey/MonkeyRepository'

export class GetMonkeys {
  private monkeyRepo: MonkeyRepository

  constructor(monkeyRepo: MonkeyRepository) {
    this.monkeyRepo = monkeyRepo
  }

  async getAll(): Promise<Monkey[]> {
    return this.monkeyRepo.getAll()
  }

  async getById(id: number): Promise<MonkeyDetail> {
    return this.monkeyRepo.getById(id)
  }
}
