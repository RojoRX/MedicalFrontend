// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Pacientes en Espera',
      path: '/citas-espera',
      icon: 'mdi:human',
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
      icon: 'mdi:human',
    },

  ]
}

export default navigation
