import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { trpc } from '../../lib/trpc'
import { getProfileRoute, getLoginRoute } from '../../lib/routes'
import css from './index.module.scss'

export const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const registerMutation = trpc.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate(getProfileRoute())
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate({ email, password, name })
  }

  return (
    <div className={css.registerPage}>
      <div className={css.container}>
        <form className={css.form} onSubmit={handleSubmit}>
          <h1 className={css.title}>Регистрация в ATLAS</h1>

          <div className={css.field}>
            <input
              type="text"
              placeholder="Имя и фамилия"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={css.input}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className={css.field}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={css.input}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className={css.field}>
            <input
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={css.input}
              disabled={registerMutation.isPending}
            />
          </div>

          <button type="submit" className={css.submit} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
          </button>

          {registerMutation.error && <p className={css.error}>{registerMutation.error.message}</p>}
        </form>

        <p className={css.loginLink}>
          Уже есть аккаунт? <Link to={getLoginRoute()}>Войти</Link>
        </p>
      </div>
    </div>
  )
}
