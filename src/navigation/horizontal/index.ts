// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Pacientes en Espera',
    path: '/citas-espera',
    icon: 'mdi:human-greeting',
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
  {
    title: 'Estadísticas y Detalles de Citas Médicas',
    path: '/gestion-citas',
    icon: 'mdi:database',
  },
]

export default navigation
