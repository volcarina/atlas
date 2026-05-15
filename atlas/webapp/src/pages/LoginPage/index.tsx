import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfileRoute, getRegisterRoute } from '../../lib/routes';
import { useAuth } from '../../contexts/AuthContext';
import css from './index.module.scss';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(getProfileRoute());
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
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
        <h1 className={css.title}>Вход в ATLAS</h1>
        <p className={css.subtitle}>Введите данные вашего аккаунта</p>

        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.field}>
            <label className={css.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={css.input}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={css.field}>
            <label className={css.label}>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={css.input}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && <p className={css.error}>{error}</p>}

          <button type="submit" className={css.submit} disabled={isLoading}>
            {isLoading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className={css.footer}>
          Нет аккаунта? <Link to={getRegisterRoute()}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};
