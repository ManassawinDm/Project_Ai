import React from 'react';
import { Dialog, DialogContent, Box, IconButton, Slide, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon from MUI icons

// Transition animation for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Imageviewr({ imageUrl, isOpen, handleClose }) {
  const theme = useTheme(); // Use theme for styling based on the current theme

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Use black with opacity for a darker theme
          overflow: 'visible', // Allow elements like the close button to be outside the dialog content
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker backdrop for better focus on the dialog
        }
      }}
    >
      <DialogContent sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        padding: 0, // Remove padding to allow the image to extend to the edges
        borderRadius: '16px', // Rounded corners for the image box
        }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: '#00df9a', // Use the accent color for the icon
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background for the button for contrast
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            borderRadius: '50%',
            zIndex: 10, // Ensure the button is above the image
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)', // Soft shadow for the button
          }}
        >
          <CloseIcon /> {/* Using MUI's CloseIcon for a more standardized look */}
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh', // Minimum height to ensure larger images are displayed nicely
            padding: '20px',
            borderRadius: '16px', // Rounded corners for the image
          }}
        >
          <img
            src={imageUrl}
            alt="Displayed"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '90vh', 
              objectFit: 'contain',
              borderRadius: '12px', // Softly rounded corners for the image itself
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Imageviewr;
