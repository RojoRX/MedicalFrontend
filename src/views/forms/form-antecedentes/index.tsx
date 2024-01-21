import { useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';
import {
    Card,
    Grid,
    Tab,
    Button,
    Divider,
    CardContent,
    CardActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface Antecedente {
    ID_Antecedente: number;
    nombre: string;
    descripcion: string;
}

interface Props {
    pacienteId: any;
}

const PatientAntecedentesTabs: React.FC<Props> = ({ pacienteId }) => {
    const [value, setValue] = useState<string>('view-antecedentes');
    const [antecedentes, setAntecedentes] = useState<Antecedente[]>([]);
    const [newAntecedente, setNewAntecedente] = useState<Antecedente>({ ID_Antecedente: 0, nombre: '', descripcion: '' });
    const [selectedAntecedenteId, setSelectedAntecedenteId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAntecedentes = async () => {
            try {
                const response = await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/antecedentes-personales/${pacienteId}`);
                const data: Antecedente[] = await response.json();
                setAntecedentes(data);
            } catch (error) {
                console.error('Error fetching patient antecedentes:', error);
            }
        };

        fetchAntecedentes();
    }, [pacienteId]);

    const handleTabsChange = (_event: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleNewAntecedenteChange = (prop: keyof Antecedente) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setNewAntecedente({ ...newAntecedente, [prop]: event.target.value });
    };

    const handleAddNewAntecedente = () => {
        fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/antecedentes-personales/${pacienteId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAntecedente),
        })
            .then((response) => response.json())
            .then((data: Antecedente) => {
                setAntecedentes([...antecedentes, data]);
                setNewAntecedente({ ID_Antecedente: 0, nombre: '', descripcion: '' });
            })
            .catch((error) => {
                console.error('Error adding new antecedente:', error);
            });
    };

    const handleDeleteAntecedente = () => {
        if (selectedAntecedenteId) {
            fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/antecedentes-personales/${selectedAntecedenteId}`, {
                method: 'DELETE',
            })
                .then(() => {
                    setAntecedentes(antecedentes.filter((antecedente) => antecedente.ID_Antecedente !== selectedAntecedenteId));
                    setSelectedAntecedenteId(null);
                })
                .catch((error) => {
                    console.error('Error deleting antecedente:', error);
                });
        }
    };

    return (
        <Card>
            <TabContext value={value}>
                <TabList onChange={handleTabsChange}>
                    <Tab value='view-antecedentes' label='Ver Alergias' />
                    <Tab value='add-antecedente' label='Agregar Alergias' />
                    <Tab value='delete-antecedente' label='Eliminar Alergia' />
                </TabList>
                <Divider />
                <CardContent>
                    <TabPanel value='view-antecedentes'>
                        {antecedentes && antecedentes.length > 0 ? (
                            <ul>
                                {antecedentes.map((antecedente) => (
                                    <li key={antecedente.ID_Antecedente}>
                                        {antecedente.nombre} - {antecedente.descripcion}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay datos para mostrar</p>
                        )}
                    </TabPanel>
                    <TabPanel value='add-antecedente'>
                        <Grid container spacing={2}>
                            <Grid item md={12} sx={{ marginBottom: "10px" }}>
                                <TextField
                                    fullWidth
                                    label='Alergia'
                                    value={newAntecedente.nombre}
                                    onChange={handleNewAntecedenteChange('nombre')}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextField
                                    fullWidth
                                    label='Descripcion'
                                    value={newAntecedente.descripcion}
                                    onChange={handleNewAntecedenteChange('descripcion')}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <Button variant='contained' onClick={handleAddNewAntecedente}>
                                    Agregar Alergia
                                </Button>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='delete-antecedente'>
                        <FormControl fullWidth>
                            <InputLabel>Seleccione una alergia para borrarla</InputLabel>
                            <Select
                                sx={{ marginBottom: "15px" }}
                                label='Seleccione una alergia para borrarla'
                                onChange={(event: SelectChangeEvent<unknown>) => {
                                    setSelectedAntecedenteId(event.target.value as number);
                                }}
                            >
                                {antecedentes && antecedentes.length > 0 ? (
                                    antecedentes.map((antecedente) => (
                                        <MenuItem key={antecedente.ID_Antecedente} value={antecedente.ID_Antecedente}>
                                            {antecedente.nombre} - {antecedente.descripcion}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No hay alergias disponibles</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <Button variant='contained' onClick={handleDeleteAntecedente}>
                            Borrar
                        </Button>
                    </TabPanel>
                </CardContent>
            </TabContext>
        </Card>
    );
    
};

export default PatientAntecedentesTabs;
