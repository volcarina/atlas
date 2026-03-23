import { useParams } from 'react-router-dom'
import { trpc } from '../../lib/trpc'
import { type ViewProgramRouteParams } from '../../lib/routes'
import css from './index.module.scss'

export const ViewProgramPage = () => {
  const { programTitle } = useParams() as ViewProgramRouteParams

  const { data, error, isLoading, isFetching, isError } = trpc.getProgram.useQuery({
    programTitle,
  })

  if (isLoading || isFetching) {
    return <span>Загрузка...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data || !data.program) {
    return <span>Программа не найдена</span>
  }

  return (
    <div className={css.programPage}>
      <h1 className={css.title}>{data.program.name}</h1>

      <div className={css.programInfo}>
        <p className={css.description}>{data.program.description}</p>

        <div className={css.programDetails}>
          <div className={css.detailItem}>
            <h2 className={css.programTime}>20 минут</h2>
            <p>Время тренировки</p>
          </div>
          <div className={css.detailItem}>
            <h2 className={css.exercisesCount}>12 упражнений</h2>
            <p>Количество упражнений</p>
          </div>
        </div>
      </div>

      <div className={css.programStats}>
        <div className={css.statItem}>
          <p>Релиз</p>
          <span>2026</span>
        </div>
        <div className={css.statItem}>
          <p>Калорий</p>
          <span>350 ккал</span>
        </div>
        <div className={css.statItem}>
          <p>Прошло людей</p>
          <span>1,247</span>
        </div>
      </div>

      <button className={css.startButton}>Начать тренировку</button>

      <div className={css.programDescription}>
        <p>Описание программы</p>
        <ul className={css.exercisesList}>
          <li>Пункт 1</li>
          <li>Пункт 2</li>
          <li>Пункт 3</li>
          <li>Пункт 4</li>
        </ul>
      </div>
    </div>
  )
}
