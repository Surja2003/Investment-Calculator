import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography, 
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import CloseIcon from '@mui/icons-material/Close';

const devices = {
  'galaxy-s24-fe': {
    name: 'Samsung Galaxy S24 FE',
    width: 393,
    height: 851,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S721B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
  },
  'iphone-15': {
    name: 'iPhone 15',
    width: 393,
    height: 852,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  'iphone-15-plus': {
    name: 'iPhone 15 Plus',
    width: 430,
    height: 932,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  'pixel-7': {
    name: 'Google Pixel 7',
    width: 412,
    height: 915,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
  },
  'ipad': {
    name: 'iPad',
    width: 768,
    height: 1024,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  'desktop': {
    name: 'Desktop',
    width: 1200,
    height: 800,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  }
};

const DeviceSimulator = ({ children, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState('galaxy-s24-fe');
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(0.8);

  const device = devices[selectedDevice];
  const width = isLandscape ? device.height : device.width;
  const height = isLandscape ? device.width : device.height;

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
    setIsLandscape(false); // Reset to portrait when changing device
  };

  const toggleOrientation = () => {
    setIsLandscape(!isLandscape);
  };

  const getDeviceIcon = () => {
    if (selectedDevice === 'desktop') return <DesktopWindowsIcon />;
    if (selectedDevice === 'ipad') return <TabletIcon />;
    return <PhoneAndroidIcon />;
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      bgcolor: 'rgba(0,0,0,0.8)', 
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      {/* Controls */}
      <Paper sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        bgcolor: 'background.paper'
      }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select value={selectedDevice} onChange={handleDeviceChange}>
            {Object.entries(devices).map(([key, device]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {key === 'desktop' ? <DesktopWindowsIcon fontSize="small" /> : 
                   key === 'ipad' ? <TabletIcon fontSize="small" /> : 
                   <PhoneAndroidIcon fontSize="small" />}
                  {device.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {width} × {height}px
        </Typography>

        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select value={scale} onChange={(e) => setScale(e.target.value)}>
            <MenuItem value={0.5}>50%</MenuItem>
            <MenuItem value={0.6}>60%</MenuItem>
            <MenuItem value={0.7}>70%</MenuItem>
            <MenuItem value={0.8}>80%</MenuItem>
            <MenuItem value={0.9}>90%</MenuItem>
            <MenuItem value={1}>100%</MenuItem>
          </Select>
        </FormControl>

        {selectedDevice !== 'desktop' && (
          <Tooltip title="Rotate Device">
            <IconButton onClick={toggleOrientation} size="small">
              <RotateLeftIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Close Simulator">
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Device Frame */}
      <Paper 
        elevation={8}
        sx={{ 
          width: width * scale,
          height: height * scale,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: selectedDevice === 'desktop' ? 1 : 3,
          bgcolor: 'background.default',
          border: selectedDevice === 'desktop' ? 'none' : '8px solid #1a1a1a'
        }}
      >
        {/* Device Label */}
        <Box sx={{ 
          position: 'absolute',
          top: -40,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'white'
        }}>
          {getDeviceIcon()}
          <Typography variant="caption">
            {device.name} {isLandscape ? '(Landscape)' : '(Portrait)'}
          </Typography>
        </Box>

        {/* Simulated Content */}
        <Box sx={{ 
          width: width,
          height: height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'auto',
          '& *': {
            userSelect: 'auto !important'
          }
        }}>
          <Box sx={{ 
            width: '100%',
            height: '100%',
            overflow: 'auto'
          }}>
            {children}
          </Box>
        </Box>
      </Paper>

      {/* Device Info */}
      <Typography 
        variant="caption" 
        sx={{ 
          mt: 1, 
          color: 'rgba(255,255,255,0.7)', 
          textAlign: 'center',
          maxWidth: 600
        }}
      >
        Simulating {device.name} viewport. This helps test responsive design and mobile UX.
        {selectedDevice !== 'desktop' && ' Use rotate button to test landscape mode.'}
      </Typography>
    </Box>
  );
};

export default DeviceSimulator;