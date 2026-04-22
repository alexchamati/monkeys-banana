import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../helpers/login'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Adresse e-mail invalide.')
      return
    }

    if (email.toLowerCase() === import.meta.env.VITE_BLOCKED_EMAIL) {
      setError('Cette adresse e-mail n\'est pas autorisée.')
      return
    }

    login(email)
    navigate('/feed')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.emoji}>🐒</span>
        <h1 className={styles.title}>Monkey Feeder</h1>
        <p className={styles.subtitle}>Connecte-toi pour nourrir tes singes préférés</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.button} type="submit">
            Se connecter 🍌
          </button>
        </form>
      </div>
    </div>
  )
}
