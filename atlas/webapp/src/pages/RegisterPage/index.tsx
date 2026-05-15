import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { getProfileRoute, getLoginRoute } from '../../lib/routes';
import { useAuth } from '../../contexts/AuthContext';
import css from './index.module.scss';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const registerMutation = trpc.register.useMutation({
    onSuccess: (data: { token: string; user: any }) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      updateUser({ name: data.user.name, email: data.user.email });
      navigate(getProfileRoute());
    },
    onError: (error: { message: any }) => {
      // shown via registerMutation.error
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password, name });
  };

  return (
    <div className={css.page}>
      <div className={css.card}>
        <div className={css.logoMark}>
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20L14 6L24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 14H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className={css.title}>Создать аккаунт</h1>
        <p className={css.subtitle}>Присоединяйтесь к ATLAS — это бесплатно</p>

        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.field}>
            <label className={css.label}>Имя и фамилия</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={css.input}
              disabled={registerMutation.isPending}
              autoComplete="name"
            />
          </div>

          <div className={css.field}>
            <label className={css.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={css.input}
              disabled={registerMutation.isPending}
              autoComplete="email"
            />
          </div>

          <div className={css.field}>
            <label className={css.label}>Пароль</label>
            <input
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={css.input}
              disabled={registerMutation.isPending}
              autoComplete="new-password"
            />
          </div>

          {registerMutation.error && (
            <p className={css.error}>{registerMutation.error.message}</p>
          )}

          <button type="submit" className={css.submit} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={css.footer}>
          Уже есть аккаунт? <Link to={getLoginRoute()}>Войти</Link>
        </p>
      </div>
    </div>
  );
};
