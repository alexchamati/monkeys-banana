import type { MonkeyDetail } from '../../domain/monkey/Monkey'
import type { MonkeyRepository } from '../../domain/monkey/MonkeyRepository'

export class GetDashboard {
  private monkeyRepo: MonkeyRepository

  constructor(monkeyRepo: MonkeyRepository) {
    this.monkeyRepo = monkeyRepo
  }

  async execute(): Promise<MonkeyDetail[]> {
    const monkeys = await this.monkeyRepo.getAll()
    const details = await Promise.all(monkeys.map(m => this.monkeyRepo.getById(m.id)))
    return details.sort((a, b) => b.banana - a.banana)
  }
}
