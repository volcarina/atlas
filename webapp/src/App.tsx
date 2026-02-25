import React, { useState } from 'react'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div>
      <header style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        <h1>ATLAS</h1>
        <nav>
          <button onClick={() => setPage('home')}>Главная</button> |{' '}
          <button onClick={() => setPage('programs')}>Программы</button> | <button>Личный кабинет</button>
          <button>Выход</button>
        </nav>
      </header>

      {page === 'home' && (
        <>
          <section style={{ padding: '40px', background: '#f5f5f5' }}>
            <h2>Домашние тренировки с лучшими тренерами</h2>
            <p>Платформа ATLAS — ваш персональный гид в мире домашних тренировок.</p>

            <br />
            <button
              onClick={() => setPage('programs')}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Начни тренироваться
            </button>
          </section>

          <section style={{ padding: '40px', background: '#fafafa' }}>
            <h2>Наши лучшие программы</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <strong>Full body mobility</strong>
                <p>Фитнес</p>
              </div>
              <div>
                <strong>Продольный шпагат</strong>
                <p>Растяжка</p>
              </div>
              <div>
                <strong>Кундалини йога</strong>
                <p>Йога</p>
              </div>
              <div>
                <strong>Утренняя йога</strong>
                <p>Йога</p>
              </div>
              <div>
                <strong>Functional core</strong>
                <p>Пилатес</p>
              </div>
            </div>
          </section>

          <section style={{ padding: '40px' }}>
            <h2>Почему ATLAS?</h2>
            <ul>
              <li>Тренировки для любого уровня подготовки</li>
              <li>Проверенные и сертифицированные тренеры</li>
              <li>Удобный формат занятий дома</li>
              <li>Отслеживание прогресса тренировок</li>
              <li>Большой выбор программ</li>
            </ul>
          </section>

          <section
            style={{ display: 'flex', alignItems: 'center', padding: '40px', gap: '20px', background: '#f5f5f5' }}
          >
            <img
              src="https://img.freepik.com/free-photo/group-people-exercising-together-outdoors_23-2151061449.jpg"
              alt="Сервис ATLAS"
              style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
            />
            <div>
              <h2>Наш сервис</h2>
              <p>
                Платформа ATLAS позволяет легко подобрать программу тренировок под ваш уровень и цели. Вы можете
                заниматься дома и следить за прогрессом прямо в приложении.
              </p>
            </div>
          </section>

          <section
            style={{ display: 'flex', alignItems: 'center', padding: '40px', gap: '20px', background: '#f5f5f5' }}
          >
            <div>
              <h2>Поддержка и мотивация</h2>
              <p>
                Наши тренеры всегда готовы дать советы и поддерживать вас на каждом этапе. Система напоминаний и
                трекинга прогресса помогает оставаться мотивированным.
              </p>
            </div>
            <img
              src="https://img.freepik.com/premium-photo/gym-with-people-exercising-gym_662214-69593.jpg"
              alt="Мотивация с ATLAS"
              style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
            />
          </section>

          <section style={{ padding: '40px', background: '#fafafa' }}>
            <h2>Тренерский состав</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <strong>Анна Иванова</strong>
                <p>Фитнес</p>
              </div>
              <div>
                <strong>Игорь Смирнов</strong>
                <p>Силовые тренировки</p>
              </div>
              <div>
                <strong>Мария Коваль</strong>
                <p>Йога</p>
              </div>
              <div>
                <strong>Алексей Петров</strong>
                <p>Функциональный тренинг</p>
              </div>
              <div>
                <strong>Екатерина Орлова</strong>
                <p>Пилатес</p>
              </div>
              <div>
                <strong>Дмитрий Волков</strong>
                <p>Кардио</p>
              </div>
            </div>
          </section>

          <section style={{ padding: '40px' }}>
            <h2>Отзывы пользователей</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '250px' }}>
                <p>«Занимаюсь на ATLAS уже месяц — реально видно прогресс!»</p>
                <strong>Александр</strong>
              </div>
              <div style={{ maxWidth: '250px' }}>
                <p>«Очень удобно тренироваться дома, программы понятные»</p>
                <strong>Елена</strong>
              </div>
              <div style={{ maxWidth: '250px' }}>
                <p>«Лучшие тренеры и отличная подача материала»</p>
                <strong>Максим</strong>
              </div>
            </div>
          </section>
        </>
      )}

      {page === 'programs' && (
        <section style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Каталог программ</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ height: '160px', background: '#f0f8ff', borderRadius: '8px', marginBottom: '16px' }}></div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Full Body Mobility</h3>
              <p style={{ color: '#666', margin: '0 0 16px 0' }}>Фитнес</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>20 мин</span>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Начать
                </button>
              </div>
            </div>

            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ height: '160px', background: '#fff0f5', borderRadius: '8px', marginBottom: '16px' }}></div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Продольный шпагат</h3>
              <p style={{ color: '#666', margin: '0 0 16px 0' }}>Растяжка</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>20 мин</span>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Начать
                </button>
              </div>
            </div>

            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ height: '160px', background: '#f0fff0', borderRadius: '8px', marginBottom: '16px' }}></div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Кундалини йога</h3>
              <p style={{ color: '#666', margin: '0 0 16px 0' }}>Йога</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>20 мин</span>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Начать
                </button>
              </div>
            </div>

            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ height: '160px', background: '#fff8f0', borderRadius: '8px', marginBottom: '16px' }}></div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Functional Core</h3>
              <p style={{ color: '#666', margin: '0 0 16px 0' }}>Пилатес</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>20 мин</span>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Начать
                </button>
              </div>
            </div>
          </div>
        </section>

        

        
      )}

      <footer
        style={{
          padding: '30px',
          background: '#222',
          color: '#fff',
          marginTop: '40px',
        }}
      >
        <h3>Контакты</h3>
        <p>Email: support@atlas-fit.ru</p>

        <p>Мы в соцсетях:</p>
        <ul>
          <li>
            <a href="#" style={{ color: '#fff' }}>
              ВКонтакте
            </a>
          </li>
          <li>
            <a href="#" style={{ color: '#fff' }}>
              Telegram
            </a>
          </li>
          <li>
            <a href="#" style={{ color: '#fff' }}>
              Яндекс Дзен
            </a>
          </li>
        </ul>
      </footer>
    </div>
  )
}
