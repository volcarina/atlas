import _ from 'lodash'

export const programs = _.times(100, (i) => ({
  name: `cool-name-${i}`,
  sport: `program ${i}`,
  description: `Description of program ${i}...`,
  text: _.times(100, (j) => `<p>Text paragrph ${j} of program ${i}...</p>`).join(''),
}))

export const users = [
  {
    id: '1',
    email: 'arina@example.com',
    name: 'Арина Волчек',
    password: '123456',
  },
]

export const userProfile = {
  id: '1',
  name: 'Арина Волчек',
  email: 'arina.volchek@example.com',
}
