import { trpc } from '../../lib/trpc'
import css from './index.module.scss'

export const ProfilePage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getUserProfile.useQuery()

  if (isLoading || isFetching) {
    return <span>Загрузка...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data || !data.user) {
    return <span>Профиль не найден</span>
  }

  return (
    <div className={css.profilePage}>
      <div className={css.profileHeader}>
        <div className={css.avatar}>АВ</div>
        <div className={css.profileInfo}>
          <h1 className={css.title}>{data.user.name}</h1>
          <p className={css.email}>{data.user.email}</p>
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
