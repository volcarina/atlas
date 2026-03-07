import { trpc } from '../../lib/trpc'
import { getViewProgramRoute } from '../../lib/routes'
import { Link } from 'react-router-dom'
import css from './index.module.scss'

export const ProgramsPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getPrograms.useQuery()

  if (isLoading || isFetching) {
    return <span>Загрузка...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data || !data.programs) {
    return <span>Программы не найдены</span>
  }

  return (
    <div>
      <h1 className={css.title}>Все программы</h1>
      <div className={css.programs}>
        {data.programs.map((program) => (
          <div className={css.program} key={program.name}>
            <h2 className={css.programTitle}>
              <Link className={css.programLink} to={getViewProgramRoute({programTitle: program.name})}>
              {program.sport}
              </Link>
            </h2>
            <p className={css.description}>{program.description}</p>
          </div>
        ))}
      </div>
  </div>
  )
}
