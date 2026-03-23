import { trpc } from '../../lib/trpc'
import { useEffect, useState } from 'react'
import css from './index.module.scss'

interface User {
  id: string
  email: string
  name: string
}

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null)
  const { data, error, isLoading, isFetching, isError } = trpc.getUserProfile.useQuery()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User
      setUser(parsedUser)
      return
    }

    // Fallback на tRPC данные
    if (data?.user) {
      setUser(data.user)
    }
  }, [data])

  if (isLoading || isFetching) {
    return <span>Загрузка...</span>
  }

  if (isError) {
    return <span>Error: {error?.message}</span>
  }

  if (!user) {
    return <span>Профиль не найден</span>
  }

  return (
    <div className={css.profilePage}>
      <div className={css.profileHeader}>
        <div className={css.avatar}>{user.name.slice(0, 2).toUpperCase()}</div>
        <div className={css.profileInfo}>
          <h1 className={css.title}>{user.name}</h1>
          <p className={css.email}>{user.email}</p>
        </div>
      </div>

      <div className={css.statsGrid}>
        <div className={css.statCard}>
          <span className={css.statNumber}>47</span>
          <p>Тренировок</p>
        </div>
        <div className={css.statCard}>
          <span className={css.statNumber}>2,847</span>
          <p>Калорий</p>
        </div>
        <div className={css.statCard}>
          <span className={css.statNumber}>12</span>
          <p>Программ</p>
        </div>
      </div>

      <div className={css.activePrograms}>
        <h2 className={css.sectionTitle}>Активные программы</h2>
        <div className={css.programsList}>
          <div className={css.programItem}>
            <h3>Йога для начинающих</h3>
            <p>Прогресс: 3/10 дней</p>
          </div>
        </div>
      </div>

      <button className={css.editButton}>Редактировать профиль</button>
    </div>
  )
}
