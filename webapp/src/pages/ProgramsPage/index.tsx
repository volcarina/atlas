import { trpc } from '../../lib/trpc'
import { getViewProgramRoute } from '../../lib/routes'
import { Link } from 'react-router-dom'
import { Segment } from '../../components/Segment'
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
    <Segment title="Все программы">
      <div className={css.programs}>
        {data.programs.map((program) => (
          <Segment
          size={2}
          title={
            <Link className={css.programLink} to={getViewProgramRoute({ programTitle: program.name })}>
              {program.sport}
            </Link>
          }
          description={css.description}>
          </Segment>
        ))}
      </div>
    </Segment>
  )
}
