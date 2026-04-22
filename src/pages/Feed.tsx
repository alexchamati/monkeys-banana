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
import styles from './Feed.module.css'

export default function Feed() {
  const { email } = useAuth()

  const feedMonkeys = useMemo(() => new FeedMonkeys(new FeedHttpRepository(email)), [email])
  const getMonkeys = useMemo(() => new GetMonkeys(new MonkeyHttpRepository(email)), [email])

  const [monkeys, setMonkeys] = useState<Monkey[]>([])
  const [bananasLeft, setBananasLeft] = useState(MAX_BANANAS)
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading')

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
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.navLink}>Voir le classement 🏆</Link>
      </nav>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Nourrir les singes 🐒</h1>
          <div className={styles.bananas}>
            {Array.from({ length: MAX_BANANAS }).map((_, i) => (
              <span key={i} className={i < bananasLeft ? styles.banana : styles.bananaEmpty}>
                🍌
              </span>
            ))}
          </div>
        </div>

        {monkeys.length === 0 ? (
          <p className={styles.empty}>
            {bananasLeft === 0 ? 'Toutes tes bananes ont été distribuées !' : 'Aucun singe dans ta liste.'}
          </p>
        ) : (
          <ul className={styles.list}>
            {monkeys.map(monkey => (
              <li key={monkey.id} className={styles.item}>
                <span className={styles.monkeyEmoji}>🐵</span>
                <span className={styles.monkeyName}>{monkey.name}</span>
                <button
                  className={styles.feedButton}
                  onClick={() => feedMonkey(monkey)}
                  disabled={bananasLeft === 0}
                >
                  Donner une banane 🍌
                </button>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromList(monkey.id)}
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
