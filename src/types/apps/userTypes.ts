// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  horaLlegada: string,
  ID_Paciente: number
  Nombre: string
  Edad: string
  Sexo: string
  Domicilio: string
  Carnet: string
  active: boolean
  contacto: string | null
  avatar: string
  avatarColor?: ThemeColor
  Fecha_Consulta: string
  Motivo_Consulta: string
  Nombre_Doctor: string
  ID_ExamenGeneral: number
  FrecuenciaCardiaca: number
  FrecuenciaRespiratoria: number
  Temperatura: number
  PresionArterial: string
  Talla: number
  Peso: number
  ID_Consulta: number
  ID_ExamenFisico: number
  Observaciones: string;
  ID_ExamenComplementario: number
  Tipo_Examen: string
  Resultados: string
  ID_DiagnosticoTratamiento: number | null
  Diagnostico: string | null
  Tratamiento: string | null
  consultaIDConsulta: number | null
}
export type PacientType = {
  ID_Paciente: number
  Nombre: string
  Edad: number
  Sexo: string
  Domicilio: string
  Carnet: string
  active: boolean
  contacto: string | null
  avatar: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
