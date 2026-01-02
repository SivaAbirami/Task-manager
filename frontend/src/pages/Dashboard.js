import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Avatar,
  Fade,
  Grow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as TodoIcon,
  Autorenew as InProgressIcon,
  Done as DoneIcon,
  Undo as UndoIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DashboardChart from '../components/DashboardChart';
import TaskForm from '../components/TaskForm';
import {
  fetchTasks,
  fetchTaskStats,
  createTask,
  updateTask,
  deleteTask
} from '../store/taskSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, stats, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTaskStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateTask = (taskData) => {
    dispatch(createTask(taskData))
      .unwrap()
      .then(() => {
        setOpenForm(false);
        dispatch(fetchTaskStats());
      })
      .catch(console.error);
  };

  const handleUpdateTask = (taskData) => {
    dispatch(updateTask({ id: editingTask.id, ...taskData }))
      .unwrap()
      .then(() => {
        setEditingTask(null);
        dispatch(fetchTaskStats());
      })
      .catch(console.error);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id))
        .unwrap()
        .then(() => {
          dispatch(fetchTaskStats());
        })
        .catch(console.error);
    }
  };

  const handleStatusChange = (task, newStatus) => {
    dispatch(updateTask({ id: task.id, status: newStatus }))
      .unwrap()
      .then(() => {
        dispatch(fetchTaskStats());
      })
      .catch(console.error);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Todo':
        return <TodoIcon color="error" />;
      case 'In Progress':
        return <InProgressIcon color="info" />;
      case 'Completed':
        return <CheckCircleIcon color="success" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo':
        return 'error';
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const totalTasks = (stats.Todo || 0) + (stats['In Progress'] || 0) + (stats.Completed || 0);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: { xs: 2, md: 4 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Row 1: Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, md: 2 },
              background: 'rgba(255, 255, 255, 0.95)',
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              width: '100%'
            }}>
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}>
                <PersonIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Welcome back, {user?.name}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{
                  mt: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                }}>
                  Manage your tasks efficiently and stay productive
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Fade>

        {error && (
          <Fade in timeout={500}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Row 2: Two Stat Cards */}
        <Box sx={{ mb: { xs: 2, md: 3 }, width: '100%' }}>
          <Box sx={{
            display: { xs: 'block', md: 'flex' },
            gap: { xs: 2, md: 3 },
            width: '100%',
            alignItems: 'stretch'
          }}>
            {/* Card 1: Task Statistics Chart - 50% of header width */}
            <Box sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              flex: { md: '0 0 calc(50% - 12px)' }
            }}>
              <Grow in timeout={1000}>
                <Box sx={{ height: '100%', display: 'flex', width: '100%' }}>
                  <DashboardChart stats={stats} />
                </Box>
              </Grow>
            </Box>

            {/* Card 2: Quick Stats - 50% of header width */}
            <Box sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              flex: { md: '0 0 calc(50% - 12px)' },
              mt: { xs: '15px', md: 0 }
            }}>
              <Grow in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-4px)' },
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Quick Stats
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1.5, sm: 1.5 },
                      width: '100%',
                      height: '100%',
                      minHeight: { xs: 'auto', sm: 160 }
                    }}>
                      <Paper
                        sx={{
                          flex: 1,
                          p: { xs: 2, sm: 2.5, md: 3 },
                          textAlign: 'center',
                          height: { xs: 'auto', sm: '100%' },
                          minHeight: { xs: 120, sm: 160 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                          color: 'white',
                          borderRadius: 2,
                          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: { xs: 'none', sm: 'scale(1.05)' }
                          }
                        }}
                      >
                        <TodoIcon sx={{ fontSize: { xs: 28, md: 36 }, mb: { xs: 1, md: 1.5 } }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                          {stats.Todo || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          Todo
                        </Typography>
                      </Paper>
                      <Paper
                        sx={{
                          flex: 1,
                          p: { xs: 2, sm: 2.5, md: 3 },
                          textAlign: 'center',
                          height: { xs: 'auto', sm: '100%' },
                          minHeight: { xs: 120, sm: 160 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                          color: 'white',
                          borderRadius: 2,
                          boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: { xs: 'none', sm: 'scale(1.05)' }
                          }
                        }}
                      >
                        <InProgressIcon sx={{ fontSize: { xs: 28, md: 36 }, mb: { xs: 1, md: 1.5 } }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                          {stats['In Progress'] || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          In Progress
                        </Typography>
                      </Paper>
                      <Paper
                        sx={{
                          flex: 1,
                          p: { xs: 2, sm: 2.5, md: 3 },
                          textAlign: 'center',
                          height: { xs: 'auto', sm: '100%' },
                          minHeight: { xs: 120, sm: 160 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'linear-gradient(135deg, #95e1d3 0%, #6bcf7f 100%)',
                          color: 'white',
                          borderRadius: 2,
                          boxShadow: '0 4px 15px rgba(107, 207, 127, 0.3)',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: { xs: 'none', sm: 'scale(1.05)' }
                          }
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: { xs: 28, md: 36 }, mb: { xs: 1, md: 1.5 } }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                          {stats.Completed || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          Completed
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Total Tasks: <strong>{totalTasks}</strong>
                    </Typography>
                  </Box>
                </Paper>
              </Grow>
            </Box>
          </Box>
        </Box>

        {/* Row 3: Task List Panel */}
        <Box sx={{ width: '100%' }}>
          <Grow in timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                width: '100%'
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 0 },
                mb: { xs: 3, md: 4 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                  <AssignmentIcon sx={{ color: 'primary.main', fontSize: { xs: 24, md: 32 } }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                    Your Tasks
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenForm(true)}
                  fullWidth={false}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.5 },
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                    }
                  }}
                >
                  Add Task
                </Button>
              </Box>

              {tasks.length === 0 ? (
                <Box sx={{
                  textAlign: 'center',
                  py: 8,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: 3
                }}>
                  <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first task to get started!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
                  {tasks.map((task, index) => (
                    <Box key={task.id} sx={{ width: '100%' }}>
                      <Grow in timeout={800 + index * 100}>
                        <Card
                          sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease-in-out',
                            border: `2px solid ${task.status === 'Todo' ? 'rgba(255, 107, 107, 0.2)' :
                              task.status === 'In Progress' ? 'rgba(78, 205, 196, 0.2)' :
                                'rgba(107, 207, 127, 0.2)'
                              }`,
                            '&:hover': {
                              transform: { xs: 'none', md: 'translateY(-4px)' },
                              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                              border: `2px solid ${task.status === 'Todo' ? 'rgba(255, 107, 107, 0.5)' :
                                task.status === 'In Progress' ? 'rgba(78, 205, 196, 0.5)' :
                                  'rgba(107, 207, 127, 0.5)'
                                }`
                            }
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, md: 2 } }}>
                              <Box sx={{
                                p: { xs: 0.75, md: 1 },
                                borderRadius: 2,
                                bgcolor: task.status === 'Todo' ? 'rgba(255, 107, 107, 0.1)' :
                                  task.status === 'In Progress' ? 'rgba(78, 205, 196, 0.1)' :
                                    'rgba(107, 207, 127, 0.1)',
                                mr: { xs: 1, md: 1.5 }
                              }}>
                                {getStatusIcon(task.status)}
                              </Box>
                              <Chip
                                label={task.status}
                                color={getStatusColor(task.status)}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                                  height: { xs: 24, md: 28 }
                                }}
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                mb: { xs: 1.5, md: 2 },
                                fontWeight: 600,
                                color: 'text.primary',
                                lineHeight: 1.4,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                              }}
                            >
                              {task.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: { xs: '0.7rem', md: '0.75rem' }
                              }}
                            >
                              Created: {new Date(task.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{
                            p: { xs: 1, md: 2 },
                            pt: 0,
                            mt: 'auto',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            gap: { xs: 0.5, md: 0 }
                          }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {task.status === 'Todo' && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleStatusChange(task, 'In Progress')}
                                  title="Mark as In Progress"
                                  sx={{
                                    bgcolor: 'rgba(78, 205, 196, 0.1)',
                                    color: '#4ecdc4',
                                    '&:hover': {
                                      bgcolor: 'rgba(78, 205, 196, 0.2)',
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <InProgressIcon fontSize="small" />
                                </IconButton>
                              )}
                              {task.status === 'In Progress' && (
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleStatusChange(task, 'Todo')}
                                    title="Back to Todo"
                                    sx={{
                                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                                      '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                                        transform: 'scale(1.1)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <ArrowBackIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleStatusChange(task, 'Completed')}
                                    title="Mark as Complete"
                                    sx={{
                                      bgcolor: 'rgba(107, 207, 127, 0.1)',
                                      color: '#6bcf7f',
                                      '&:hover': {
                                        bgcolor: 'rgba(107, 207, 127, 0.2)',
                                        transform: 'scale(1.1)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <DoneIcon fontSize="small" />
                                  </IconButton>
                                </>
                              )}
                              {task.status === 'Completed' && (
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleStatusChange(task, 'In Progress')}
                                    title="Back to In Progress"
                                    sx={{
                                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                                      '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                                        transform: 'scale(1.1)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <ArrowBackIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleStatusChange(task, 'Todo')}
                                    title="Reopen to Todo"
                                    sx={{
                                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                                      '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                                        transform: 'scale(1.1)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <UndoIcon fontSize="small" />
                                  </IconButton>
                                </>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingTask(task)}
                                sx={{
                                  color: 'primary.main',
                                  '&:hover': {
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTask(task.id)}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    bgcolor: 'rgba(255, 107, 107, 0.1)',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardActions>
                        </Card>
                      </Grow>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grow>
        </Box>

        {/* Task Form Dialog */}
        <TaskForm
          open={openForm || !!editingTask}
          onClose={() => {
            setOpenForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialValues={editingTask}
          isEditing={!!editingTask}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;