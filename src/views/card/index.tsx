import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface DoctorStats {
  totalCitas: number;
  consultas: number;
  reconsultas: number;
  emergencias: number;
  adultoMayor: number;
}

interface StatsData {
  porMes: any;
  porDia: any;
  totalCitas: number;
  doctores: { [doctor: string]: DoctorStats };
}

interface CitasStatisticsCardProps {
  date: string;
}

const CitasStatisticsCard: React.FC<CitasStatisticsCardProps> = ({ date }) => {
  const [dailyStats, setDailyStats] = useState<StatsData | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<StatsData | null>(null);

  // Convertir la fecha a una cadena ISO sin ajustes de zona horaria
  const isoDate = new Date(date).toISOString().split('T')[0];

  const dailyApiUrl = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas/reporteDia/${isoDate}`;
  const monthlyApiUrl = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas/reporteMes/${isoDate}`;
  const dailyPdf = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}/informe/diario/${isoDate}`;
  const monthlyPdf = `http://${process.env.NEXT_PUBLIC_SERVER_HOST}/informe/mensual/${isoDate}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyResponse = await axios.get(dailyApiUrl);
        const monthlyResponse = await axios.get(monthlyApiUrl);

        console.log('Daily Stats:', dailyResponse.data);
        console.log('Monthly Stats:', monthlyResponse.data);

        setDailyStats(dailyResponse.data);
        setMonthlyStats(monthlyResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dailyApiUrl, monthlyApiUrl, date]);

  const openPdfInNewWindow = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      {/* Sección de Estadísticas Diarias */}
      <Card sx={{ minWidth: 275, margin: '20px', padding: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Estadísticas Diarias de Citas - {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </Typography>
          {dailyStats ? (
            <>
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                Total de Citas: {dailyStats.porDia.totalCitas}
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
                    {Object.entries(dailyStats?.porDia?.doctores || {}).map(([doctor, doctorStats]) => {
                      const typedDoctorStats = doctorStats as DoctorStats;
                      return (
                        <TableRow key={doctor}>
                          <TableCell>{doctor}</TableCell>
                          <TableCell>{typedDoctorStats?.totalCitas || 0}</TableCell>
                          <TableCell sx={{ color: 'primary.main' }}>{typedDoctorStats?.consultas || 0}</TableCell>
                          <TableCell sx={{ color: 'secondary.main' }}>{typedDoctorStats?.reconsultas || 0}</TableCell>
                          <TableCell sx={{ color: 'error.main' }}>{typedDoctorStats?.emergencias || 0}</TableCell>
                          <TableCell sx={{ color: 'warning.main' }}>{typedDoctorStats?.adultoMayor || 0}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="contained" onClick={() => openPdfInNewWindow(dailyPdf)} sx={{ marginTop: '20px' }}>
                Ver Informe Dia PDF
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Cargando estadísticas diarias...
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
          {monthlyStats ? (
            <>
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                Total de Citas del Mes: {monthlyStats.porMes.totalCitas}
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
                    {Object.entries(monthlyStats?.porMes?.doctores || {}).map(([doctor, doctorStats]) => {
                      const typedDoctorStats = doctorStats as DoctorStats;
                      return (
                        <TableRow key={doctor}>
                          <TableCell>{doctor}</TableCell>
                          <TableCell>{typedDoctorStats?.totalCitas || 0}</TableCell>
                          <TableCell sx={{ color: 'primary.main' }}>{typedDoctorStats?.consultas || 0}</TableCell>
                          <TableCell sx={{ color: 'secondary.main' }}>{typedDoctorStats?.reconsultas || 0}</TableCell>
                          <TableCell sx={{ color: 'error.main' }}>{typedDoctorStats?.emergencias || 0}</TableCell>
                          <TableCell sx={{ color: 'warning.main' }}>{typedDoctorStats?.adultoMayor || 0}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="contained" onClick={() => openPdfInNewWindow(monthlyPdf)} sx={{ marginTop: '20px' }}>
                Ver Informe Mes PDF
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Cargando estadísticas mensuales...
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CitasStatisticsCard;
