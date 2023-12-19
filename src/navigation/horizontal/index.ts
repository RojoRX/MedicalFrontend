// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Pacientes en Espera',
    path: '/queuepacients',
    icon: 'mdi:home-outline',
  },
  {
    title: 'Registrar Nuevos Pacientes',
    path: '/create-pacient',
    icon: 'mdi:human',
  },
  {
    title: 'Gestionar Pacientes',
    path: '/test',
    icon: 'mdi:human-male-female',
  },
]

export default navigation
