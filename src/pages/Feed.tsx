import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { FeedMonkeys } from '../application/usecases/FeedMonkeys'
import { GetMonkeys } from '../application/usecases/GetMonkeys'
import { MAX_BANANAS } from '../constants/monkey'
import { useAuth } from '../context/AuthContext'
import type { Monkey } from '../domain/monkey/Monkey'
import { FeedHttpRepository } from '../infrastructure/http/FeedHttpRepository'
import { MonkeyHttpRepository } from '../infrastructure/http/MonkeyHttpRepository'
import { getThankYouMessage } from '../helpers/monkey'

type Status = 'loading' | 'idle' | 'error'

export default function Feed() {
  const { email } = useAuth()

  const feedMonkeys = useMemo(() => new FeedMonkeys(new FeedHttpRepository(email)), [email])
  const getMonkeys = useMemo(() => new GetMonkeys(new MonkeyHttpRepository(email)), [email])

  const [monkeys, setMonkeys] = useState<Monkey[]>([])
  const [bananasLeft, setBananasLeft] = useState(MAX_BANANAS)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    Promise.all([getMonkeys.getAll(), feedMonkeys.getCurrentSelection()])
      .then(([allMonkeys, alreadyFed]) => {
        const remaining = MAX_BANANAS - alreadyFed.length
        setMonkeys(allMonkeys.filter(m => !alreadyFed.includes(m.id)))
        setBananasLeft(remaining)
        setStatus('idle')
      })
      .catch(() => setStatus('error'))
  }, [getMonkeys, feedMonkeys])

  async function feedMonkey(monkey: Monkey) {
    try {
      await feedMonkeys.execute([monkey.id])
      setMonkeys(prev => prev.filter(m => m.id !== monkey.id))
      setBananasLeft(prev => prev - 1)
      toast.success(getThankYouMessage(monkey.name))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Une erreur est survenue')
    }
  }

  function removeFromList(id: number) {
    setMonkeys(prev => prev.filter(m => m.id !== id))
  }

  if (status === 'loading') return <p>Chargement...</p>
  if (status === 'error') return <p>Impossible de charger les singes.</p>

  return (
    <div>
      <Link to="/dashboard">Voir le classement</Link>
      <h1>Nourrir les singes</h1>
      <p>
        {bananasLeft > 0
          ? `${bananasLeft} banane${bananasLeft > 1 ? 's' : ''} restante${bananasLeft > 1 ? 's' : ''}`
          : 'Plus de bananes disponibles'}
      </p>

      <ul>
        {monkeys.map(monkey => (
          <li key={monkey.id}>
            <span>{monkey.name}</span>
            <button
              onClick={() => feedMonkey(monkey)}
              disabled={bananasLeft === 0}
            >
              Donner une banane
            </button>
            <button onClick={() => removeFromList(monkey.id)}>
              Retirer de la liste
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
