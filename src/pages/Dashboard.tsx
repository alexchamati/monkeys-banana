import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetDashboard } from '../application/usecases/GetDashboard'
import { useAuth } from '../context/AuthContext'
import type { MonkeyDetail } from '../domain/monkey/Monkey'
import { MonkeyHttpRepository } from '../infrastructure/http/MonkeyHttpRepository'
import { MEDALS } from '../constants/monkey'

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
    <div>
      <Link to="/feed">Nourrir les singes</Link>
      <h1>Classement</h1>
      <ol>
        {monkeys.map((monkey, index) => (
          <li key={monkey.id}>
            <span>{MEDALS[index] ?? `#${index + 1}`}</span>
            <span>{monkey.name}</span>
            <span>{monkey.banana} banane{monkey.banana !== 1 ? 's' : ''}</span>
            {maxBananas > 0 && (
              <progress value={monkey.banana} max={maxBananas} />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
