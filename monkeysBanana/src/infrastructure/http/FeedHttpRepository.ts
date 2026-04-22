import type { FeedSelection } from '../../domain/feed/Feed'
import type { FeedRepository } from '../../domain/feed/FeedRepository'
import { httpGet, httpPost } from './client'

export class FeedHttpRepository implements FeedRepository {
  private email: string

  constructor(email: string) {
    this.email = email
  }

  get(): Promise<FeedSelection> {
    return httpGet<FeedSelection>('/feed', this.email)
  }

  save(selection: FeedSelection): Promise<void> {
    return httpPost<void>('/feed', this.email, selection)
  }
}
