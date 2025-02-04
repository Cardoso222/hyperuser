import React, { useState, useEffect } from 'react';
import { connectSocket, disconnectSocket, subscribeToEvent, unsubscribeFromEvent } from '../services/socket';
import { Paper, Typography, Box, Alert, Chip } from '@mui/material';

const EventsDisplay = () => {
  const [events, setEvents] = useState([]);

  const getEndpointInfo = (eventType, data) => {
    switch (eventType) {
      case 'user.created':
        return {
          method: 'POST',
          endpoint: '/api/users',
          payload: {
            name: data.name,
            email: data.email,
            role: data.role
          }
        };
      case 'user.updated':
        return {
          method: 'PUT',
          endpoint: `/api/users/${data._id}`,
          payload: {
            name: data.name,
            email: data.email,
            role: data.role
          }
        };
      case 'user.deleted':
        return {
          method: 'DELETE',
          endpoint: `/api/users/${data.id}`,
          payload: null
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    connectSocket();

    const handleUserCreated = (data) => {
      setEvents(prev => [...prev, {
        type: 'user.created',
        data,
        timestamp: new Date(),
        endpoint: getEndpointInfo('user.created', data)
      }]);
    };

    const handleUserUpdated = (data) => {
      setEvents(prev => [...prev, {
        type: 'user.updated',
        data,
        timestamp: new Date(),
        endpoint: getEndpointInfo('user.updated', data)
      }]);
    };

    const handleUserDeleted = (data) => {
      setEvents(prev => [...prev, {
        type: 'user.deleted',
        data,
        timestamp: new Date(),
        endpoint: getEndpointInfo('user.deleted', data)
      }]);
    };

    subscribeToEvent('user.created', handleUserCreated);
    subscribeToEvent('user.updated', handleUserUpdated);
    subscribeToEvent('user.deleted', handleUserDeleted);

    return () => {
      unsubscribeFromEvent('user.created', handleUserCreated);
      unsubscribeFromEvent('user.updated', handleUserUpdated);
      unsubscribeFromEvent('user.deleted', handleUserDeleted);
      disconnectSocket();
    };
  }, []);

  const getEventSeverity = (eventType) => {
    switch (eventType) {
      case 'user.created':
        return 'success';
      case 'user.updated':
        return 'warning';
      case 'user.deleted':
        return 'error';
      default:
        return 'info';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'POST':
        return 'success';
      case 'PUT':
        return 'warning';
      case 'DELETE':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Real-time Events
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {events.map((event, index) => (
          <Alert
            key={index}
            severity={getEventSeverity(event.type)}
            sx={{
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {event.type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
                {event.endpoint && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={event.endpoint.method}
                        size="small"
                        color={getMethodColor(event.endpoint.method)}
                      />
                      <Typography variant="body2" component="code" sx={{ bgcolor: 'grey.100', p: 0.5, borderRadius: 1 }}>
                        {event.endpoint.endpoint}
                      </Typography>
                    </Box>
                    {event.endpoint.payload && (
                      <Box
                        component="pre"
                        sx={{
                          mt: 1,
                          p: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          overflow: 'auto'
                        }}
                      >
                        {JSON.stringify(event.endpoint.payload, null, 2)}
                      </Box>
                    )}
                  </Box>
                )}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Response:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}
                >
                  {JSON.stringify(event.data, null, 2)}
                </Box>
              </Box>
            </Box>
          </Alert>
        ))}
        {events.length === 0 && (
          <Alert severity="info">
            No events yet. Create, update, or delete users to see events appear here.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default EventsDisplay; 