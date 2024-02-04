// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import router from 'next/router'
import { io } from 'socket.io-client'
import { useQuery, useQueryClient } from 'react-query'
import AppointmentForm from 'src/views/dialogs/editCite'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars
const userRoleObj: UserRoleType = {
  Masculino: { icon: 'mdi-gender-male', color: '#007bff' },
  Femenino: { icon: 'mdi-gender-female', color: '#ff66ff' },
  MASCULINO: { icon: 'mdi-gender-male', color: '#007bff' },
  FEMENINO: { icon: 'mdi-gender-female', color: '#ff66ff' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}
const getColor = (status: any) => {
  switch (status) {
    case 'consulta':
      return 'primary.main';
    case 'reconsulta':
      return 'secondary.main';
    case 'emergencia':
      return 'error.main';
    case 'adulto mayor':
      return 'warning.main';
    default:
      return 'text.primary';
  }
};

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))
{/** */ }
// ** renders client column
const renderClient = (row: UsersType) => {
  if (row.hasOwnProperty("avatar")) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 45, height: 45, fontSize: '1.2rem' }}
      >
        {getInitials(row.Nombre ? row.Nombre : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id, row }: { id: number | string; row: any }) => {
  const userId = id;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      // Llama al endpoint para actualizar el campo enEspera
      await axios.put(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas/${row.id_cita}/en-espera`);
      // Puedes agregar lógica adicional después de una actualización exitosa si es necesario
      // Cierra el menú de opciones de fila
      handleRowOptionsClose();
    } catch (error) {
      console.error('Error al actualizar:', error);
      // Puedes manejar errores aquí si es necesario
    }
  };
  const handleDeleteCita = async () => {
    try {
      // Llama al endpoint para eliminar la cita
      await axios.delete(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas/${row.id_cita}`);
      // Puedes agregar lógica adicional después de una eliminación exitosa si es necesario
      // Cierra el menú de opciones de fila
      handleRowOptionsClose();
    } catch (error) {
      console.error('Error al eliminar:', error);
      // Puedes manejar errores aquí si es necesario
    }
  };

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push(`/apps/user/view/${userId}?id_cita=${row.id_cita}`);
    handleRowOptionsClose();
  };  

  const handleEditClick = () => {
    setOpenEditDialog(true);
    handleRowOptionsClose();
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component='a'
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleClick}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          Ver Paciente
        </MenuItem>
        <MenuItem onClick={handleEditClick} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Editar Cita
        </MenuItem>
             {/* Diálogo de edición */}
      {openEditDialog && (
        <AppointmentForm
        idCita={row.id_cita}
        doctor={row.doctor}
        tipoConsulta={row.tipo_consulta}
        onClose={handleClose}
      />
      )}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Quita Cita de Espera
        </MenuItem>

        <MenuItem onClick={handleDeleteCita} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Eliminar Cita
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    maxWidth: 350,
    field: 'Nombre',
    headerName: 'Nombre',
    renderCell: ({ row }: CellType) => {
      const { Nombre } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href={`/apps/user/view/${row.ID_Paciente}?id_cita=${row.id_cita}`} sx={{ fontSize: '17px' }}>{Nombre}</StyledLink>
            <Typography sx={{ fontSize: '12px' }} noWrap variant='caption'>
              
              {row.Domicilio}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 100,
    maxWidth: 100,
    field: 'Edad',
    headerName: 'Edad',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.Edad}
        </Typography>
      )
    }
  },/*
  {
    flex: 0.15,
    field: 'Sexo',
    minWidth: 140,
    maxWidth: 160,
    headerName: 'Sexo',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: userRoleObj[row.Sexo].color } }}>
          <Icon icon={userRoleObj[row.Sexo].icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.Sexo}
          </Typography>
        </Box>
      )
    }
  },*/
  {
    flex: 0.15,
    minWidth: 100,
    maxWidth: 120,
    headerName: 'Carnet',
    field: 'Carnet',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.Carnet}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    maxWidth: 180,
    field: 'Doctor',
    headerName: 'Doctor',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.doctor}
      </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    maxWidth: 150,
    field: 'Tipo Consulta',
    headerName: 'Tipo Consulta',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography 
          variant='subtitle1' 
          noWrap 
          sx={{ 
            textTransform: 'uppercase',
            color: getColor(row.tipo_consulta)
          }}
        >
          {row.tipo_consulta}
        </Typography>
      )
    }
  },  
  {
    flex: 0.1,
    minWidth: 200,
    maxWidth: 200,
    field: 'Hora de Llegada',
    headerName: 'Hora de Llegada',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography>
          {row.fecha_cita}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    maxWidth: 90,
    sortable: false,
    field: 'Opciones',
    headerName: 'Opciones',
    renderCell: ({ row }: CellType) => <RowOptions id={row.ID_Paciente} row={row}  />
  }
]


const fetchPacientesEnEspera = async () => {
  const response = await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/citas`);
  if (!response.ok) {
    throw new Error(`Error al obtener pacientes en espera: ${response.statusText}`);
  }
  return response.json();
  //console.log(response.json())
}

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State

  const [value, setValue] = useState<string>('')

  const [pageSize, setPageSize] = useState<number>(50)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  const queryClient = useQueryClient();

  const { data: pacientesEnEspera, isError, isLoading } = useQuery('pacientesEnEspera', fetchPacientesEnEspera);

  useEffect(() => {
    const socket = io(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}`, { transports: ['websocket'] });
  
    socket.on('connect', () => {
      console.log('Conexión establecida con el servidor de sockets');
    });
  
    socket.on('Socket emitido', () => {
      // Realiza una nueva llamada al endpoint para obtener los datos actualizados
      queryClient.invalidateQueries('pacientesEnEspera');
    });
  
    // Cierra la conexión cuando el componente se desmonte
    return () => {
      socket.disconnect();
      console.log('Conexión cerrada');
    };
  }, [queryClient]);
  

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError || !pacientesEnEspera) {
    return <div>Error al cargar datos</div>;
  }
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <>
    <Grid item md={12} xs={12}>
    <Card>
      <CardHeader title='Bienvenido Administrador!!' />
      <CardContent>
        <Typography sx={{ mb: 4 }}>Aqui puede ver a todos los pacientes que estan en espera de ser atendidos por orden de llegada.</Typography>
      </CardContent>
    </Card>
  </Grid>
  
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: CardStatsHorizontalProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Pacientes en Fila' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Divider />
          <Grid item xs={12}>
            <TableHeader value={value} handleFilter={setValue} toggle={toggleAddUserDrawer} />
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              getRowId={(row) => row.id_cita}
              autoHeight
              rows={pacientesEnEspera}
              columns={columns}
              checkboxSelection
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            />
          </Grid>
        </Card>
      </Grid>
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid></>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const res = await axios.get('/cards/statistics')
  //const apiData: CardStatsType = res.data

  return {
    props: {
      //apiData
    }
  }
}

export default UserList
