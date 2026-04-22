import { MAX_BANANAS } from '../../constants/monkey'
import type { FeedSelection } from '../../domain/feed/Feed'
import type { FeedRepository } from '../../domain/feed/FeedRepository'

export class FeedMonkeys {
  private feedRepo: FeedRepository

  constructor(feedRepo: FeedRepository) {
    this.feedRepo = feedRepo
  }

  async getCurrentSelection(): Promise<FeedSelection> {
    return this.feedRepo.get()
  }

  async execute(selection: FeedSelection): Promise<void> {
    if (selection.length > MAX_BANANAS) {
      throw new Error(`Maximum ${MAX_BANANAS} bananes autorisées`)
    }
    if (new Set(selection).size !== selection.length) {
      throw new Error('Un singe ne peut recevoir qu\'une seule banane')
    }
    await this.feedRepo.save(selection)
  }
}
