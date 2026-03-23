import { Link } from 'react-router-dom'
import { getAllProgramsRoute } from '../../lib/routes'
import css from './index.module.scss'

export const HomePage = () => {
  return (
    <>
      <section className={css.hero}>
        <div className={css.heroContent}>
          <h1 className={css.heroTitle}>Домашние тренировки с лучшими тренерами</h1>
          <p className={css.heroText}>Платформа ATLAS — ваш персональный гид в мире домашних тренировок.</p>
          <Link to={getAllProgramsRoute()} className={css.ctaButton}>
            Начни тренироваться
          </Link>
        </div>
      </section>

      <section className={css.popularPrograms}>
        <div className={css.sectionContainer}>
          <h2 className={css.sectionTitle}>Наши лучшие программы</h2>
          <div className={css.programsGrid}>
            <div className={css.programCard}>
              <h3 className={css.programName}>Full body mobility</h3>
              <p className={css.programCategory}>Фитнес</p>
            </div>
            <div className={css.programCard}>
              <h3 className={css.programName}>Продольный шпагат</h3>
              <p className={css.programCategory}>Растяжка</p>
            </div>
            <div className={css.programCard}>
              <h3 className={css.programName}>Кундалини йога</h3>
              <p className={css.programCategory}>Йога</p>
            </div>
            <div className={css.programCard}>
              <h3 className={css.programName}>Утренняя йога</h3>
              <p className={css.programCategory}>Йога</p>
            </div>
            <div className={css.programCard}>
              <h3 className={css.programName}>Functional core</h3>
              <p className={css.programCategory}>Пилатес</p>
            </div>
          </div>
        </div>
      </section>

      <section className={css.features}>
        <div className={css.sectionContainer}>
          <h2 className={css.sectionTitle}>Почему ATLAS?</h2>
          <div className={css.featuresGrid}>
            <div className={css.feature}>
              <div className={css.featureIcon}>🏋️</div>
              <h3>Для любого уровня</h3>
              <p>Тренировки для любого уровня подготовки</p>
            </div>
            <div className={css.feature}>
              <div className={css.featureIcon}>✅</div>
              <h3>Сертифицированные тренеры</h3>
              <p>Проверенные и сертифицированные тренеры</p>
            </div>
            <div className={css.feature}>
              <div className={css.featureIcon}>🏠</div>
              <h3>Удобно дома</h3>
              <p>Удобный формат занятий дома</p>
            </div>
            <div className={css.feature}>
              <div className={css.featureIcon}>📈</div>
              <h3>Отслеживание прогресса</h3>
              <p>Отслеживание прогресса тренировок</p>
            </div>
          </div>
        </div>
      </section>

      <section className={css.serviceSection}>
        <div className={css.sectionContainer}>
          <div className={css.serviceContent}>
            <div>
              <h2 className={css.sectionTitle}>Наш сервис</h2>
              <p className={css.sectionText}>
                Платформа ATLAS позволяет легко подобрать программу тренировок под ваш уровень и цели. Вы можете
                заниматься дома и следить за прогрессом прямо в приложении.
              </p>
            </div>
            <div className={css.serviceImage}>
              <div className={css.imagePlaceholder}>🏋️‍♀️</div>
            </div>
          </div>
        </div>
      </section>

      <section className={css.supportSection}>
        <div className={css.sectionContainer}>
          <div className={css.serviceContent}>
            <div className={css.supportImage}>
              <div className={css.imagePlaceholder}>💪</div>
            </div>
            <div>
              <h2 className={css.sectionTitle}>Поддержка и мотивация</h2>
              <p className={css.sectionText}>
                Наши тренеры всегда готовы дать советы и поддерживать вас на каждом этапе. Система напоминаний и
                трекинга прогресса помогает оставаться мотивированным.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={css.trainers}>
        <div className={css.sectionContainer}>
          <h2 className={css.sectionTitle}>Тренерский состав</h2>
          <div className={css.trainersGrid}>
            <div className={css.trainerCard}>
              <h3>Анна Иванова</h3>
              <p>Фитнес</p>
            </div>
            <div className={css.trainerCard}>
              <h3>Игорь Смирнов</h3>
              <p>Силовые тренировки</p>
            </div>
            <div className={css.trainerCard}>
              <h3>Мария Коваль</h3>
              <p>Йога</p>
            </div>
            <div className={css.trainerCard}>
              <h3>Алексей Петров</h3>
              <p>Функциональный тренинг</p>
            </div>
            <div className={css.trainerCard}>
              <h3>Екатерина Орлова</h3>
              <p>Пилатес</p>
            </div>
            <div className={css.trainerCard}>
              <h3>Дмитрий Волков</h3>
              <p>Кардио</p>
            </div>
          </div>
        </div>
      </section>

      <section className={css.reviews}>
        <div className={css.sectionContainer}>
          <h2 className={css.sectionTitle}>Отзывы пользователей</h2>
          <div className={css.reviewsGrid}>
            <div className={css.reviewCard}>
              <p>«Занимаюсь на ATLAS уже месяц — реально видно прогресс!»</p>
              <div className={css.reviewer}>Александр</div>
            </div>
            <div className={css.reviewCard}>
              <p>«Очень удобно тренироваться дома, программы понятные»</p>
              <div className={css.reviewer}>Елена</div>
            </div>
            <div className={css.reviewCard}>
              <p>«Лучшие тренеры и отличная подача материала»</p>
              <div className={css.reviewer}>Максим</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
