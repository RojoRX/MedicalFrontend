import { useState, useEffect } from 'react';
import axios from 'axios';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import ConsultaDetail from 'src/views/forms/form-layouts/FormConsultaDetail';

import { Button, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';



const ConsultationManagement = () => {
    const router = useRouter()
    const userId = router.query.userId;
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState('');
    const [consultaDetails, setConsultaDetails] = useState(null);

    interface Consultation {
        ID_Consulta: number;
        Fecha_Consulta: string;
        Motivo_Consulta: string;
        Nombre_Doctor: string;
        active: boolean;
        EnEspera: boolean;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/all-consultation-pacient/${userId}`);

                setConsultations(response.data); // Ajusta esta línea según la estructura real de tu respuesta
            } catch (error) {
                console.error('Error al obtener las citas:', error);
            }
        };

        fetchData();
    }, [userId]);

    const fetchData = async (newSelectedConsultation: string) => {
        try {
            const response = await axios.get(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/database/alldata/${userId}/${newSelectedConsultation}`);
            setConsultaDetails(response.data); // Ajusta esta línea según la estructura real de tu respuesta
        } catch (error) {
            console.error('Error al obtener los detalles de la consulta:', error);
        }
    };

    useEffect(() => {
        if (selectedConsultation) {
            fetchData(selectedConsultation);
        }
    }, [userId, selectedConsultation]);

    const handleConsultationSelect = (event: any) => {
        setSelectedConsultation((prevSelectedConsultation) => {
            // Utilizamos prevSelectedConsultation para garantizar que tengamos el valor más reciente
            const newSelectedConsultation = event.target.value;
            // Llamar al segundo useEffect solo si el valor ha cambiado
            if (newSelectedConsultation !== prevSelectedConsultation) {
                // Agregamos una pequeña pausa para asegurarnos de que el estado se haya actualizado completamente
                setTimeout(() => {
                    fetchData(newSelectedConsultation);
                }, 0);
            }
            return newSelectedConsultation;
        });
    };
    return (
        <DatePickerWrapper>
            <Grid item xs={12}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push(`/apps/user/view/${userId}`)}
                >
                    Volver Atras
                </Button>
            </Grid>
            <Grid item xs={12}>
                <CardHeader title='Gestión de Consultas' sx={{ textAlign: 'center' }} />
            </Grid>
            <CardContent>
                <Typography sx={{ mb: 4 }}>Aqui puede ver a todas las consultas del paciente y seleccionar una para ver toda la informacion</Typography>
            </CardContent>
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id='form-layouts-tabs-select-label'>Seleccionar Consulta</InputLabel>
                            <Select
                                label='Seleccionar Consulta'
                                value={selectedConsultation}
                                onChange={handleConsultationSelect}
                                labelId='form-layouts-tabs-select-label'
                                required
                            >
                                <MenuItem value="" disabled>
                                    Seleccione una consulta
                                </MenuItem>
                                {consultations.map((consultation) => (
                                    <MenuItem key={consultation.ID_Consulta} value={consultation.ID_Consulta}>
                                        {consultation.Fecha_Consulta}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Divider sx={{ m: '0 !important' }} />
                {consultaDetails && (
                    <ConsultaDetail consultaDetails={consultaDetails[0]} />
                )}
            </CardContent>
        </DatePickerWrapper>
    );
};

export default ConsultationManagement;
