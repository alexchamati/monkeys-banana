import type { Monkey, MonkeyDetail } from '../../domain/monkey/Monkey'
import type { MonkeyRepository } from '../../domain/monkey/MonkeyRepository'
import { httpGet } from './client'

export class MonkeyHttpRepository implements MonkeyRepository {
  private email: string

  constructor(email: string) {
    this.email = email
  }

  getAll(): Promise<Monkey[]> {
    return httpGet<Monkey[]>('/monkeys', this.email)
  }

  getById(id: number): Promise<MonkeyDetail> {
    return httpGet<MonkeyDetail>(`/monkeys/${id}`, this.email)
  }
}
