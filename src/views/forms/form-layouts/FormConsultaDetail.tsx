import React, { SyntheticEvent, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionSummary, Divider, AccordionDetails, Grid, Box, CardContent, Card, Button } from '@mui/material';
import Icon from 'src/@core/components/icon';
type Props = {
    consultaDetails: any
}
const ConsultaDetail = ({ consultaDetails }: any) => {
    const {
        Nombre,
        Edad,
        Sexo,
        Domicilio,
        Contacto,
        Carnet,
        contacto,
        Diagnostico,
        Tratamiento,
        Fecha_Consulta,
        Motivo_Consulta,
        Nombre_Doctor,
        FrecuenciaCardiaca,
        FrecuenciaRespiratoria,
        Temperatura,
        PresionArterial,
        Talla,
        Peso,
        Observaciones,
        Tipo_Examen,
        Resultados,
    } = consultaDetails;
    const [expanded, setExpanded] = useState<string | false>('panel1')
    const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <>
            <Card sx={{ marginTop: '12px' }}>
                <CardContent>
                    <Typography variant='h6'>Informacion del Paciente</Typography>
                    
                    <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
                    <Box sx={{ pt: 2, pb: 1 }}>
                        <Box sx={{ display: 'flex', mb: 2.7 }}>
                            <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                                Nombre Completo:
                            </Typography>
                            <Typography variant='body2'>{Nombre}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 2.7 }}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Edad:</Typography>
                            <Typography variant='body2'>{Edad}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 2.7 }}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Sexo:</Typography>
                            <Typography variant='body2'>{Sexo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 2.7 }}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Cedula de Identidad:</Typography>
                            <Typography variant='body2'>{Carnet}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 2.7 }}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Domicilio:</Typography>
                            <Typography variant='body2'>{Domicilio}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 2.7 }}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Contacto:</Typography>
                            <Typography variant='body2'>+591 {contacto}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ marginTop: '12px' }}>
                <AccordionSummary
                    expandIcon={<Icon icon='mdi:chevron-down' />}
                    id='form-layouts-collapsible-header-1'
                    aria-controls='form-layouts-collapsible-content-1'
                >
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                        Datos de la Consulta del Paciente
                    </Typography>
                </AccordionSummary>
                <Divider sx={{ m: '0 !important' }} />
                <AccordionDetails>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Diagnóstico:</Typography>
                            <Typography variant='body2'>{Diagnostico}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tratamiento:</Typography>
                            <Typography variant='body2'>{Tratamiento}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Fecha de Consulta:</Typography>
                            <Typography variant='body2'>{Fecha_Consulta}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Motivo de Consulta:</Typography>
                            <Typography variant='body2'>{Motivo_Consulta}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Doctor que atendio la Consulta:</Typography>
                            <Typography variant='body2'>{Nombre_Doctor}</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<Icon icon='mdi:chevron-down' />}
                    id='form-layouts-collapsible-header-2'
                    aria-controls='form-layouts-collapsible-content-2'
                >
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                        Datos del Examen General
                    </Typography>
                </AccordionSummary>
                <Divider sx={{ m: '0 !important' }} />
                <AccordionDetails>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Frecuencia Cardiaca:</Typography>
                            <Typography variant='body2'>{FrecuenciaCardiaca}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Frecuencia Respiratoria:</Typography>
                            <Typography variant='body2'>{FrecuenciaRespiratoria}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Temperatura:</Typography>
                            <Typography variant='body2'>{Temperatura}º</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Presion Arterial:</Typography>
                            <Typography variant='body2'>{PresionArterial}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Talla:</Typography>
                            <Typography variant='body2'>{Talla} cm</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Peso:</Typography>
                            <Typography variant='body2'>{Peso} Kg</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<Icon icon='mdi:chevron-down' />}
                    id='form-layouts-collapsible-header-3'
                    aria-controls='form-layouts-collapsible-content-3'
                >
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                        Datos del Examen Fisico Regional
                    </Typography>
                </AccordionSummary>
                <Divider sx={{ m: '0 !important' }} />
                <AccordionDetails>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Observaciones del Examen:</Typography>
                            <Typography variant='body2'>{Observaciones}</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                    expandIcon={<Icon icon='mdi:chevron-down' />}
                    id='form-layouts-collapsible-header-4'
                    aria-controls='form-layouts-collapsible-content-4'
                >
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                        Datos de Examenes Complementarios
                    </Typography>
                </AccordionSummary>
                <Divider sx={{ m: '0 !important' }} />
                <AccordionDetails>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tipo de Examen:</Typography>
                            <Typography variant='body2'>{Tipo_Examen}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Resultados:</Typography>
                            <Typography variant='body2'>{Resultados}</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    );
};
export default ConsultaDetail;
