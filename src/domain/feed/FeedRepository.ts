import type { FeedSelection } from './Feed'

export interface FeedRepository {
  get(): Promise<FeedSelection>
  save(selection: FeedSelection): Promise<void>
}
