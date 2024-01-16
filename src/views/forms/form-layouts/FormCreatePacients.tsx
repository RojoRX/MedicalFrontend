// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import { FormEvent, useState } from 'react'
import axios from 'axios'
import React from 'react'

import { TransitionProps } from '@mui/material/transitions';
import Router from 'next/router'
import { format } from 'date-fns'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const FormCreatePacients = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        location.reload();
        setOpen(false);

    };
    const [formData, setFormData] = useState({
        nombre: '',
        fechaNacimiento: '',
        sexo: '',
        domicilio: '',
        carnet: null,
        contacto: null 
    });
    const [dialogMessage, setDialogMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'contacto' && value.length > 8) {
            return;
        }

        if (name === 'carnet' && value.length > 8) {
            return;
        }

        if (name === 'fechaNacimiento') {
            // Verificar si la fecha es válida antes de formatear
            if (value) {
                const formattedDate = formatDateForInput(value);
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: formattedDate
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const formatDateForInput = (inputDate: string): string => {
        // Implementa la lógica para formatear la fecha aquí
        // En este caso, asumimos que la fecha ya está en el formato correcto "dd/mm/aaaa"
        return inputDate;
    };




    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const selectedValue = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            sexo: selectedValue,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        // Convierte los nombres de campo a mayúsculas
        const formattedFormData = {
            Nombre: formData.nombre,
            FechaNacimiento: format(new Date(formData.fechaNacimiento), 'yyyy-MM-dd'),
            Sexo: formData.sexo,
            Domicilio: formData.domicilio,
            Carnet: formData.carnet,
            contacto: formData.contacto
        };
        e.preventDefault();
        try {
            // Realiza la solicitud POST a tu API
            //console.log(formattedFormData)
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


    };
    return (
        <Card>
            <CardHeader title='Crear un nuevo paciente' />
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Nombre Completo'
                                placeholder='Leonardo Perez del Castillo'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='nombre'
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type='date'
                                label='Fecha de Nacimiento'
                                InputLabelProps={{ shrink: true }}  // Agrega esta línea para evitar que la etiqueta se solape
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi-format-list-numbers' />
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        // Establecer el formato aceptado por el input date
                                        format: 'yyyy-MM-dd',
                                    },
                                }}
                                name='fechaNacimiento'
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                required
                            />
                        </Grid>



                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
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
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Direccion'
                                placeholder='Av. Murillo #123'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:home' />
                                        </InputAdornment>
                                    )
                                }}
                                name='domicilio'
                                value={formData.domicilio}
                                onChange={handleChange}
                                //required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type='text'
                                label='Carnet de Identidad'
                                placeholder='12405828'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi-account-multiple' />
                                        </InputAdornment>
                                    )
                                }}
                                name='carnet'
                                value={formData.carnet}
                                onChange={handleChange}
                                //required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type='number'
                                label='Numero de Contacto'
                                placeholder='70458090'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:phone' />
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        maxLength: 10,  // Aquí puedes establecer la longitud máxima que desees
                                    }
                                }}
                                name='contacto'
                                value={formData.contacto}
                                onChange={handleChange}
                               // required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' variant='contained' size='large'>
                                Registrar Paciente
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
            <React.Fragment>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Registro de Paciente"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Correcto</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </Card>

    )
}

export default FormCreatePacients
