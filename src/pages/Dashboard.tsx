import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetDashboard } from '../application/usecases/GetDashboard'
import { MEDALS } from '../constants/monkey'
import { useAuth } from '../context/AuthContext'
import type { MonkeyDetail } from '../domain/monkey/Monkey'
import { MonkeyHttpRepository } from '../infrastructure/http/MonkeyHttpRepository'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { email } = useAuth()

  const getDashboard = useMemo(
    () => new GetDashboard(new MonkeyHttpRepository(email)),
    [email]
  )

  const [monkeys, setMonkeys] = useState<MonkeyDetail[]>([])
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading')

  useEffect(() => {
    getDashboard.execute()
      .then(setMonkeys)
      .then(() => setStatus('idle'))
      .catch(() => setStatus('error'))
  }, [getDashboard])

  if (status === 'loading') return <p>Chargement...</p>
  if (status === 'error') return <p>Impossible de charger le classement.</p>

  const maxBananas = monkeys[0]?.banana ?? 0

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/feed" className={styles.navLink}>Nourrir les singes 🐒</Link>
      </nav>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>🐒 Le trône des bananes</h1>
        </div>

        {monkeys.length === 0 ? (
          <p className={styles.empty}>Aucun singe n'a encore été nourri.</p>
        ) : (
          <ol className={styles.list}>
            {monkeys.map((monkey, index) => (
              <li
                key={monkey.id}
                className={`${styles.item} ${index === 0 ? styles.itemTop : ''}`}
              >
                <span className={styles.medal}>
                  {MEDALS[index] ?? `${index + 1}`}
                </span>
                <div className={styles.itemContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className={styles.name}>{monkey.name}</span>
                    <span className={styles.count}>
                      {monkey.banana} 🍌
                    </span>
                  </div>
                  {maxBananas > 0 && (
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${(monkey.banana / maxBananas) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
