// components/CitasStatisticsCard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface DoctorStats {
    totalCitas: number;
    consultas: number;
    reconsultas: number;
    emergencias: number;
    adultoMayor: number;
}

interface DoctorStatsMap {
    [doctor: string]: DoctorStats;
}

interface CitasStatisticsCardProps {
    date: string;
}

const CitasStatisticsCard: React.FC<CitasStatisticsCardProps> = ({ date }) => {
    const [stats, setStats] = useState<any>(null);

    // Convertir la fecha a una cadena ISO sin ajustes de zona horaria
    const isoDate = new Date(date).toISOString().split('T')[0];
    const apiUrl = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas/report/${isoDate}`;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [apiUrl, date]);

    return (
        <div>
          {/* Sección de Estadísticas Diarias */}
          <Card sx={{ minWidth: 275, margin: '20px', padding: '20px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              Estadísticas Diarias de Citas - {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}

              </Typography>
              {stats ? (
                <>
                  <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    Total de Citas: {stats.porDia.totalCitas}
                  </Typography>
                  <TableContainer sx={{ marginTop: '20px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Doctor</TableCell>
                          <TableCell>Total de Citas</TableCell>
                          <TableCell>Consultas</TableCell>
                          <TableCell>Reconsultas</TableCell>
                          <TableCell>Emergencias</TableCell>
                          <TableCell>Adulto Mayor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(stats.porDia.doctores).map(([doctor, doctorStats]) => (
                          <TableRow key={doctor}>
                            <TableCell>{doctor}</TableCell>
                            <TableCell>{(doctorStats as DoctorStats).totalCitas}</TableCell>
                            <TableCell sx={{ color: 'primary.main' }}>{(doctorStats as DoctorStats).consultas}</TableCell>
                            <TableCell sx={{ color: 'secondary.main' }}>{(doctorStats as DoctorStats).reconsultas}</TableCell>
                            <TableCell sx={{ color: 'error.main' }}>{(doctorStats as DoctorStats).emergencias}</TableCell>
                            <TableCell sx={{ color: 'warning.main' }}>{(doctorStats as DoctorStats).adultoMayor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Cargando estadísticas...
                </Typography>
              )}
            </CardContent>
          </Card>
      
          {/* Sección de Estadísticas Mensuales */}
          <Card sx={{ minWidth: 275, margin: '20px', padding: '20px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              Estadísticas Mensuales de Citas - {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long' })}

              </Typography>
              {stats ? (
                <>
                  <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    Total de Citas del Mes: {stats.porMes.totalCitas}
                  </Typography>
                  <TableContainer sx={{ marginTop: '20px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Doctor</TableCell>
                          <TableCell>Total de Citas</TableCell>
                          <TableCell>Consultas</TableCell>
                          <TableCell>Reconsultas</TableCell>
                          <TableCell>Emergencias</TableCell>
                          <TableCell>Adulto Mayor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(stats.porMes.doctores).map(([doctor, doctorStats]) => (
                          <TableRow key={doctor}>
                            <TableCell>{doctor}</TableCell>
                            <TableCell>{(doctorStats as DoctorStats).totalCitas}</TableCell>
                            <TableCell sx={{ color: 'primary.main' }}>{(doctorStats as DoctorStats).consultas}</TableCell>
                            <TableCell sx={{ color: 'secondary.main' }}>{(doctorStats as DoctorStats).reconsultas}</TableCell>
                            <TableCell sx={{ color: 'error.main' }}>{(doctorStats as DoctorStats).emergencias}</TableCell>
                            <TableCell sx={{ color: 'warning.main' }}>{(doctorStats as DoctorStats).adultoMayor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Cargando estadísticas...
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      );
};

export default CitasStatisticsCard;
