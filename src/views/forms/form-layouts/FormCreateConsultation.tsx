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
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, Divider } from '@mui/material'
import { FormEvent, useState } from 'react'
import axios from 'axios'
import React from 'react'

import { TransitionProps } from '@mui/material/transitions';
import Router, { useRouter } from 'next/router'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    userId: any
    enEspera: string,
}
const FormCreateConsultation = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const { userId, enEspera } = props
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        Router.push(`/apps/user/view/${userId}`)
        setOpen(false);
    };
    const [formData, setFormData] = useState({
        Motivo_Consulta: '',
        Nombre_Doctor: '',
        pacienteId: userId,
    });
    const [examenData, setExamenData] = useState({
        FrecuenciaCardiaca: 0,
        FrecuenciaRespiratoria: 0,
        Temperatura: 0,
        PresionArterial: 0,
        Talla: 0,
        Peso: 0,
        Observaciones: '',
        Tipo_Examen: '',
        Resultados: '',
        Diagnostico: '',
        Tratamiento: ''
    });

    const [sendData, setSendData] = useState({
        consultaId: null,
        examenGeneralData: {
            FrecuenciaCardiaca: examenData.FrecuenciaCardiaca,
            FrecuenciaRespiratoria: examenData.FrecuenciaRespiratoria,
            Temperatura: examenData.Temperatura,
            PresionArterial: examenData.PresionArterial,
            Talla: examenData.Talla,
            Peso: examenData.Peso,
        },
        examenFisicoRegionalData: {
            Observaciones: examenData.Observaciones
        },
        examenesComplementariosData: {
            Tipo_Examen: examenData.Tipo_Examen,
            Resultados: examenData.Resultados
        },
        diagnosticoTratamientoData: {
            Diagnostico: examenData.Diagnostico,
            Tratamiento: examenData.Tratamiento
        }
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
        if (name === 'edad' && value.length > 3) {
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setExamenData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        // Actualiza también el sendData directamente aquí
        setSendData((prevData) => ({
            ...prevData,
            examenGeneralData: {
                ...prevData.examenGeneralData,
                [name]: value
            },
            examenFisicoRegionalData: {
                ...prevData.examenFisicoRegionalData,
                [name]: value
            },
            examenesComplementariosData: {
                ...prevData.examenesComplementariosData,
                [name]: value
            },
            diagnosticoTratamientoData: {
                ...prevData.diagnosticoTratamientoData,
                [name]: value
            },
            // Agrega más propiedades según sea necesario
        }));
    }
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const selectedValue = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            Nombre_Doctor: selectedValue,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST a tu API para crear la consulta
            const response = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/consultas`, formData);
            // Actualiza consultaId en sendData
            sendData.consultaId = response.data.consultaId.toString();
            // Realiza la segunda solicitud POST a tu API para ejecutar el procedimiento almacenado
            const response2 = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/allDataconsulta`, sendData);
            // Ahora, quita al paciente de la cola
            const enEsperaBoolean = enEspera === 'true';

            if (enEsperaBoolean) {
                const response3 = await axios.put(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/pacientes/togglee/${userId}`);
                // Puedes agregar lógica adicional si es necesario con la respuesta de la tercera solicitud
            }
            // Configura el mensaje de éxito para el diálogo
            setDialogMessage('Se guardaron los datos Correctamente!! :) ');
            
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
            <CardHeader title='Registrar Consulta para Paciente' sx={{ textAlign: 'center' }} />
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Motivo de la Consulta'
                                placeholder='Fuertes Dolores Estomacales'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Motivo_Consulta'
                                value={formData.Motivo_Consulta}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id='form-layouts-tabs-select-label'>Nombre del Doctor</InputLabel>
                                <Select
                                    label='Nombre del Doctor'
                                    value={formData.Nombre_Doctor} // Asigna el valor seleccionado
                                    onChange={handleSelectChange} // Maneja el cambio de valor
                                    labelId='form-layouts-tabs-select-label'
                                    required
                                >
                                    <MenuItem value='Dr. Ramiro Quispe Zarate'>Dr. Ramiro Quispe Zarate</MenuItem>
                                    <MenuItem value='Dra. Janneth Condori Llanos'>Dra. Janneth Condori Llanos</MenuItem>
                                    <MenuItem value='Dr. Sara Montesinos'>Dr. Sara Montesinos</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Diagnostico'
                                placeholder='Agregue aqui el Diagnostico del paciente'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Diagnostico'
                                value={examenData.Diagnostico}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Tratamiento'
                                placeholder='Agregue aqui el Tratamiento del paciente'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Tratamiento'
                                value={examenData.Tratamiento}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='subtitle1' sx={{ mr: 2, color: 'text.primary' }}>
                                Agregue aqui los datos del Examen General
                            </Typography>
                            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type='number'
                                label='Frecuencia Cardiaca'
                                placeholder='80'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='FrecuenciaCardiaca'
                                value={examenData.FrecuenciaCardiaca}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type='number'
                                label='FrecuenciaRespiratoria'
                                placeholder='30'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='FrecuenciaRespiratoria'
                                value={examenData.FrecuenciaRespiratoria}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type='number'
                                label='Temperatura'
                                placeholder='36'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Temperatura'
                                value={examenData.Temperatura}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Presion Arterial'
                                placeholder='30'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='PresionArterial'
                                value={examenData.PresionArterial}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type='number'
                                label='Talla'
                                placeholder='165'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Talla'
                                value={examenData.Talla}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type='number'
                                label='Peso'
                                placeholder='70'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Peso'
                                value={examenData.Peso}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='subtitle1' sx={{ mr: 2, color: 'text.primary' }}>
                                Agregue aqui los datos del Examen Regional
                            </Typography>
                            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Observaciones'
                                placeholder='Escriba aqui las observaciones del Examen Regional'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Observaciones'
                                value={examenData.Observaciones}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='subtitle1' sx={{ mr: 2, color: 'text.primary' }}>
                                Agregue aqui los datos del Examen Complementario
                            </Typography>
                            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Tipo Examen'
                                placeholder='Escriba aqui el tipo de Examen Complementario'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Tipo_Examen'
                                value={examenData.Tipo_Examen}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Resultados'
                                placeholder='Escriba aqui el Resultado del Examen Complementario'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                name='Resultados'
                                value={examenData.Resultados}
                                onChange={handleChange}
                            //required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' variant='contained' size='large'>
                                Registrar Consulta y Datos
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

export default FormCreateConsultation
