import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';  // Importa Axios

interface NewAppointmentData {
  userId: any;
  onClose: () => void;
}

interface EditAppointmentData {
  idCita: any;
  doctor: any;
  tipoConsulta: any;
  onClose: () => void;
}

interface EditAppointmentFormProps extends EditAppointmentData {
  userId?: never;
}

interface NewAppointmentFormProps extends NewAppointmentData {
  idCita?: never;
  doctor?: never;
  tipoConsulta?: never;
}

type AppointmentFormProps = EditAppointmentFormProps | NewAppointmentFormProps;

const doctorsList = [
  'Dr. Silvio Ramiro Zarate',
  'Dra. Janneth Condori Llanos',
  'Dra. Sara Montesinos',
  'Dra. Patricia Nardin Mainz',
];

const typesList = ['consulta', 'reconsulta', 'emergencia', 'adulto mayor'];

const AppointmentForm: React.FC<AppointmentFormProps> = (props) => {
  const [formData, setFormData] = useState({
    paciente: props.userId || '',
    doctor: props.doctor || doctorsList[0],
    tipoConsulta: props.tipoConsulta || typesList[0],
    fechaCita: new Date().toISOString(),
  });

  const [editData, setEditData] = useState({
    Motivo_Consulta: '',
    Nombre_Doctor: '',
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleDialogClose = () => {
    setDialogOpen(false);
    props.onClose();
  };

  const handleDialogOpen = (message: string) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };


  useEffect(() => {
    if (props.idCita) {
      // Lógica para obtener datos de la cita existente y actualizar editData
      // const existingAppointmentData = fetchAppointmentDataById(props.idCita);
      // setEditData(existingAppointmentData);
      setEditData({
        Motivo_Consulta: props.tipoConsulta || typesList[0],
        Nombre_Doctor: props.doctor || doctorsList[0],
      });
    }
  }, [props.idCita, props.tipoConsulta, props.doctor]);

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleEditInputChange = (key: keyof typeof editData, value: string) => {
    setEditData((prevData) => ({ ...prevData, [key]: value }));
  };

  const createNewAppointment = async () => {
    try {
      const response = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas`, {
        paciente: formData.paciente,
        doctor: formData.doctor,
        tipo_consulta: formData.tipoConsulta,
        fecha_cita: formData.fechaCita,
      });
      console.log(response.data.message);
      handleDialogOpen(response.data.message);  // Mensaje de la respuesta del servidor
    } catch (error) {
      handleDialogOpen('Error al enviar datos al servidor');
    }
  };

  const updateAppointmentData = async () => {
    try {
      const response = await axios.put(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas/${props.idCita}`, {
        tipo_consulta: editData.Motivo_Consulta,
        doctor: editData.Nombre_Doctor,
      });
      console.log(response.data.message);
      handleDialogOpen(response.data.message);  // Mensaje de la respuesta del servidor
    } catch (error) {
        handleDialogOpen('Error al enviar datos al servidor');
    }
  };

  const handleSubmit = () => {
    if (props.idCita) {
      updateAppointmentData();
    } else {
      createNewAppointment();
    }
  };

  return (
    <>
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>{props.idCita ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={6} sx={{marginBottom:"30px"}}>
          {props.userId && (
            <Grid item sm={12} sx={{ marginTop: "5px" }}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={formData.doctor}
                  onChange={(e) => handleInputChange('doctor', e.target.value as string)}
                >
                  {doctorsList.map((doc, index) => (
                    <MenuItem key={index} value={doc}>
                      {doc}
                    </MenuItem>
                  ))}
                </Select>
                <br />
              </FormControl>
            </Grid>
          )}

          {props.userId && (
            <Grid item sm={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Consulta</InputLabel>
                <Select
                  value={formData.tipoConsulta}
                  onChange={(e) => handleInputChange('tipoConsulta', e.target.value as string)}
                >
                  {typesList.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={6}>
        {props.idCita && (
        <>
          <Grid item sm={12} sx={{marginTop:"25px"}}>
            <FormControl fullWidth sx={{ marginTop: "10px", marginBottom: "5px" }}>
              <InputLabel>Motivo de Consulta</InputLabel>
              <Select
                value={editData.Motivo_Consulta}
                onChange={(e) => handleEditInputChange('Motivo_Consulta', e.target.value as string)}
              >
                {typesList.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
        <Grid item sm={12}>
            <FormControl fullWidth sx={{ marginTop: "10px", marginBottom: "5px" }}>
              <InputLabel>Nombre del Doctor</InputLabel>
              <Select
                value={editData.Nombre_Doctor}
                onChange={(e) => handleEditInputChange('Nombre_Doctor', e.target.value as string)}
              >
                {doctorsList.map((doc, index) => (
                  <MenuItem key={index} value={doc}>
                    {doc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
        </>
        )}
    </Grid>
        {/* 
        {props.userId && (
          <TextField
            label="Fecha de Cita"
            type="date"
            value={formData.fechaCita}
            onChange={(e) => handleInputChange('fechaCita', e.target.value)}
            fullWidth
          />
        )}*/}
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: "10px" }}>
          {props.idCita ? 'Guardar Cambios' : 'Crear Cita'}
        </Button>
        <Button variant="contained" color="secondary" onClick={props.onClose} sx={{ marginTop: "10px", marginLeft: "15px" }}>
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Resultado de la Operación</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
          <Button variant="contained" color="primary" onClick={handleDialogClose} sx={{ marginTop: '10px' }}>
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentForm;
