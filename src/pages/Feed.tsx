import { useEffect, useMemo, useState } from 'react'
import { FeedMonkeys } from '../application/usecases/FeedMonkeys'
import { GetMonkeys } from '../application/usecases/GetMonkeys'
import { MAX_BANANAS } from '../constants/monkey'
import { useAuth } from '../context/AuthContext'
import type { Monkey } from '../domain/monkey/Monkey'
import { FeedHttpRepository } from '../infrastructure/http/FeedHttpRepository'
import { MonkeyHttpRepository } from '../infrastructure/http/MonkeyHttpRepository'

export default function Feed() {
  const { email } = useAuth()

  const feedMonkeys = useMemo(() => {
    const feedRepo = new FeedHttpRepository(email)
    return new FeedMonkeys(feedRepo)
  }, [email])

  const getMonkeys = useMemo(() => {
    const monkeyRepo = new MonkeyHttpRepository(email)
    return new GetMonkeys(monkeyRepo)
  }, [email])

  const [monkeys, setMonkeys] = useState<Monkey[]>([])
  const [selection, setSelection] = useState<number[]>([])
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    Promise.all([getMonkeys.getAll(), feedMonkeys.getCurrentSelection()])
      .then(([allMonkeys, currentSelection]) => {
        setMonkeys(allMonkeys)
        setSelection(currentSelection)
        setStatus('idle')
      })
      .catch(() => setStatus('error'))
  }, [getMonkeys, feedMonkeys])

  function toggleBanana(id: number) {
    setSelection(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id)
      if (prev.length >= MAX_BANANAS) return prev
      return [...prev, id]
    })
  }

  function removeFromList(id: number) {
    setMonkeys(prev => prev.filter(m => m.id !== id))
    setSelection(prev => prev.filter(s => s !== id))
  }

  async function handleFeed() {
    try {
      await feedMonkeys.execute(selection)
      setFeedback({ type: 'success', message: 'Singes nourris avec succès !' })
    } catch (e) {
      setFeedback({ type: 'error', message: e instanceof Error ? e.message : 'Une erreur est survenue' })
    }
  }

  if (status === 'loading') return <p>Chargement...</p>
  if (status === 'error') return <p>Impossible de charger les singes.</p>

  const bananasLeft = MAX_BANANAS - selection.length

  return (
    <div>
      <h1>Nourrir les singes</h1>
      <p>{bananasLeft} banane{bananasLeft !== 1 ? 's' : ''} restante{bananasLeft !== 1 ? 's' : ''}</p>

      <ul>
        {monkeys.map(monkey => {
          const isSelected = selection.includes(monkey.id)
          const isDisabled = !isSelected && bananasLeft === 0

          return (
            <li key={monkey.id}>
              <span>{monkey.name}</span>
              <button
                onClick={() => toggleBanana(monkey.id)}
                disabled={isDisabled}
              >
                {isSelected ? 'Retirer la banane' : 'Donner une banane'}
              </button>
              <button onClick={() => removeFromList(monkey.id)}>
                Retirer de la liste
              </button>
            </li>
          )
        })}
      </ul>

      {feedback && <p>{feedback.message}</p>}

      <button onClick={handleFeed} disabled={selection.length === 0}>
        Nourrir ({selection.length}/{MAX_BANANAS})
      </button>
    </div>
  )
}
