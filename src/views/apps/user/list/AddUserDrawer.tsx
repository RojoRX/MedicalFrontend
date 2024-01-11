// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import { Router } from 'next/router'
import React from 'react'
import { format } from 'date-fns'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  nombre: string
  fechaNacimiento: string
  sexo: string
  domicilio: string
  carnet: number
  contacto: number
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} Este campo es requerido`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener al menos ${min} caracteres`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))
const fechaActual = new Date();
const schema = yup.object().shape({
  fechaNacimiento: yup
    .date() // Cambia esto a 'date'
    .typeError('Debe llenar la fecha de Nacimiento')
    .max(fechaActual, 'La fecha de nacimiento no puede ser mayor o igual a la fecha actual') // Usa la fecha actual como valor máximo
    .required(),

  domicilio: yup.string().required(),
  contacto: yup
    .number()
    .typeError('El Numero de Contacto es necesario')
    .min(7, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  carnet: yup
    .number()
    .typeError('El Carnet es Obligatorio')
    .min(2000000, obj => showErrors('Carnet', obj.value.length, obj.min))
    .required(),
  nombre: yup
    .string()
    .min(3, obj => showErrors('Nombre de Paciente', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  nombre: '',
  fechaNacimiento: '',
  sexo: '',
  domicilio: '',
  carnet: Number(''),
  contacto: Number('')
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  const [formData, setFormData] = useState({
    sexo: '',
  });

  // ** Hooks

  const [opened, setOpened] = React.useState(false);
  const handleClickOpen = () => {
    setOpened(true);
  };
  const handleClosed = () => {
    setOpened(false);
    window.location.reload();
  };
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      sexo: selectedValue,
    }));
  };

  const onSubmit = async (data: UserData) => {
    console.log("Test")
    const formattedFormData = {
      Nombre: data.nombre,
      FechaNacimiento: format(new Date(data.fechaNacimiento), 'yyyy-MM-dd'),
      Sexo: formData.sexo,
      Domicilio: data.domicilio,
      Carnet: data.carnet,
      contacto: data.contacto
    };
    //dispatch(addUser({ ...data, role, currentPlan: sexo }))
    toggle()
    //reset()
    console.log(formattedFormData)
    try {
      // Realiza la solicitud POST a tu API
      console.log(formattedFormData)
      const response = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/pacientes`, formattedFormData);
      // Configura el mensaje de éxito para el diálogo
      setDialogMessage(response.data.mensaje);


    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Si el servidor devuelve un mensaje de error, úsalo
        setDialogMessage(`Error: ${error.response.data.message}`);
      } else {
        // Si no, usa un mensaje de error genérico
        setDialogMessage('Falla al enviar el formulario. Por favor, inténtalo de nuevo más tarde.');
      }
    }
    // Abre el diálogo
    handleClickOpen();
  }

  const handleClose = () => {
    toggle()
    reset()
  }
  const [dialogMessage, setDialogMessage] = useState('');

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Registrar Paciente</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='nombre'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Nombre Completo'
                  onChange={onChange}
                  placeholder='John Doe'
                  error={Boolean(errors.nombre)}
                />
              )}
            />

            {errors.nombre && <FormHelperText sx={{ color: 'error.main' }}>{errors.nombre.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='fechaNacimiento'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='date'
                  value={value}
                  label='Fecha de nacimiento'
                  onChange={onChange}
                  //error={Boolean(errors.fechaNacimiento)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    placeholder: '', // Esto establece el placeholder a una cadena vacía
                  }}
                />

              )}
            />
            {errors.fechaNacimiento && <FormHelperText sx={{ color: 'error.main' }}>{errors.fechaNacimiento.message}</FormHelperText>}
           </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='form-layouts-tabs-select-label'>Sexo</InputLabel>
            <Select
              label='Sexo'
              value={formData.sexo} // Asigna el valor seleccionado
              onChange={handleSelectChange} // Maneja el cambio de valor
              labelId='form-layouts-tabs-select-label'
              required
            >
              <MenuItem value='Masculino'>Masculino</MenuItem>
              <MenuItem value='Femenino'>Femenino</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='domicilio'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='text'
                  value={value}
                  label='Domicilio'
                  onChange={onChange}
                  placeholder='Av. Las Banderas #322'
                  error={Boolean(errors.domicilio)}
                />
              )}
            />
            {errors.domicilio && <FormHelperText sx={{ color: 'error.main' }}>{errors.domicilio.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='carnet'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Carnet de Identidad'
                  onChange={onChange}
                  placeholder='4008980'
                  error={Boolean(errors.carnet)}
                />
              )}
            />
            {errors.carnet && <FormHelperText sx={{ color: 'error.main' }}>{errors.carnet.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='contacto'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Celular o Telefono'
                  onChange={onChange}
                  placeholder='77-86-20-45'
                  error={Boolean(errors.contacto)}
                />
              )}
            />
            {errors.contacto && <FormHelperText sx={{ color: 'error.main' }}>{errors.contacto.message}</FormHelperText>}
          </FormControl>


          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Registrar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
      <React.Fragment>
        <Dialog
          open={opened}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClosed}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Registro de Paciente"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosed}>Correcto</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Drawer>

  )
}

export default SidebarAddUser
