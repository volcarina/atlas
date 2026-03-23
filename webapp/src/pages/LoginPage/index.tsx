import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { trpc } from '../../lib/trpc'
import { getProfileRoute, getRegisterRoute } from '../../lib/routes'
import css from './index.module.scss'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const loginMutation = trpc.login.useMutation({
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
    loginMutation.mutate({ email, password })
  }

  return (
    <div className={css.loginPage}>
      <div className={css.container}>
        <form className={css.form} onSubmit={handleSubmit}>
          <h1 className={css.title}>Вход в ATLAS</h1>

          <div className={css.field}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={css.input}
              disabled={loginMutation.isPending}
            />
          </div>

          <div className={css.field}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={css.input}
              disabled={loginMutation.isPending}
            />
          </div>

          <button type="submit" className={css.submit} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Входим...' : 'Войти'}
          </button>

          {loginMutation.error && <p className={css.error}>{loginMutation.error.message}</p>}
        </form>

        <p className={css.signupLink}>
          Нет аккаунта? <Link to={getRegisterRoute()}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
