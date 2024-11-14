import React from 'react';
import { Box, Typography } from '@mui/material';

export default function BannersCliente({ banners, colors }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginY: 3 }}>
      {banners.map((banner, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: colors.primary,
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            color: colors.textLight,
            minWidth: 200,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {banner.title}
          </Typography>
          <Typography variant="body2">{banner.content}</Typography>
        </Box>
      ))}
    </Box>
  );
}
