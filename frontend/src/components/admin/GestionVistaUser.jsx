import React, { useState,useEffect } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function VistaUser() {

  // Colores personalizados
  const colors = {
    primary: "#CA6DF2",
    secondary: "#B86AD9",
    textDark: "#2D2D2D",
    textLight: "#FFFFFF",
  };

  const [banners, setBanners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (banner = null) => {
    setCurrentBanner(banner);
    setIsEditing(Boolean(banner));
    setOpenDialog(true);
  };
  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/banner');
      const data = await response.json();
      setBanners(data);
      console.log('Banners:', data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCloseDialog = () => {
    setCurrentBanner(null);
    setOpenDialog(false);
  };

  const handleSaveBanner = async (banner) => {
    
    if (isEditing) {
      try {
        const response = await fetch(`http://localhost:3000/api/banner/${currentBanner.id_banner}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentBanner),
        });
        if (response.ok) {
          fetchBanners(); // Actualizar la lista de banners
        }
      } catch (error) {
        console.error('Error updating banner:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:3000/api/banner', {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentBanner),
        });
        const newBanner = await response.json();
        setBanners((prevBanners) => [...prevBanners, newBanner]);
      } catch (error) {
        console.error('Error saving banner:', error);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteBanner = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/banner/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBanners((prevBanners) => prevBanners.filter((banner) => banner.id_banner !== id));
      } else {
        console.error('Error deleting banner:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <Box sx={{ padding: 4 , paddingTop: 10}}>
      <Toolbar>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2, color: colors.primary }}>
          Gestión de Banners
        </Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ marginLeft: "auto", backgroundColor: colors.primary, color: colors.textLight }}
        >
          Agregar Banner
        </Button>
      </Toolbar>
      <Divider sx={{ marginY: 3 }} />
      <List>
        {banners.map((banner) => (
          <ListItem key={banner.id_banner}>
            <ListItemText
              primary={banner.titulo}
              secondary={banner.descripcion}
            />
            <IconButton onClick={() => handleOpenDialog(banner)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteBanner(banner.id_banner)} color="error">
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Banner" : "Agregar Banner"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            fullWidth
            margin="dense"
            value={currentBanner?.titulo || ""}
            onChange={(e) =>
              setCurrentBanner({ ...currentBanner, titulo: e.target.value })
            }
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={currentBanner?.descripcion || ""}
            onChange={(e) =>
              setCurrentBanner({ ...currentBanner, descripcion: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveBanner} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
