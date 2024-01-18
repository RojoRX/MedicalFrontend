import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FormCreateConsultation from 'src/views/forms/form-layouts/FormCreateConsultation'

const CreateConsultation = () => {
  const router = useRouter()
  const { userId, enEspera, idCita } = router.query

  return (
    <DatePickerWrapper>
      <Button
        sx={{marginBottom:"10px"}}
        variant="outlined"
        color="primary"
        onClick={() => router.push(`/apps/user/view/${userId}?id_cita=${idCita}`)}
      >
        Volver Atras
      </Button>
      <FormCreateConsultation userId={userId as string} enEspera={enEspera as string} idCita={idCita as string} />
    </DatePickerWrapper>
  )
}

export default CreateConsultation
