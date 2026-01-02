import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart as BarChartIcon } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardChart = ({ stats }) => {
  const data = {
    labels: ['Todo', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [stats.Todo || 0, stats['In Progress'] || 0, stats.Completed || 0],
        backgroundColor: [
          'rgba(255, 107, 107, 0.8)',
          'rgba(78, 205, 196, 0.8)',
          'rgba(107, 207, 127, 0.8)',
        ],
        borderColor: [
          'rgba(255, 107, 107, 1)',
          'rgba(78, 205, 196, 1)',
          'rgba(107, 207, 127, 1)',
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 600
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 600
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} task${value !== 1 ? 's' : ''} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000
    }
  };

  const totalTasks = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, md: 3 }, 
        height: '100%',
        width: '100%',
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, md: 2 } }}>
        <BarChartIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Task Statistics
        </Typography>
      </Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
        Total Tasks: <strong>{totalTasks}</strong>
      </Typography>
      <Box sx={{ flexGrow: 1, height: { xs: 220, sm: 250, md: 280 }, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: { xs: 1.5, md: 2 } }}>
        {totalTasks > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body1" sx={{ mb: 1 }}>
              No tasks to display
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create tasks to see statistics
            </Typography>
          </Box>
        )}
      </Box>
      {totalTasks > 0 && (
        <Box sx={{ 
          mt: 2, 
          pt: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex', 
          justifyContent: 'space-around' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.25rem' },
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stats.Todo || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              Todo
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.25rem' },
              background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stats['In Progress'] || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              In Progress
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.25rem' },
              background: 'linear-gradient(135deg, #95e1d3 0%, #6bcf7f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stats.Completed || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              Completed
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default DashboardChart;