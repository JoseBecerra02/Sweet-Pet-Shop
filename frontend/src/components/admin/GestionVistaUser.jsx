import React, { useState } from "react";
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

  const [banners, setBanners] = useState([
    { id: 1, title: "Banner 1", description: "Descripción del Banner 1" },
    { id: 2, title: "Banner 2", description: "Descripción del Banner 2" },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (banner = null) => {
    setCurrentBanner(banner);
    setIsEditing(Boolean(banner));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentBanner(null);
    setOpenDialog(false);
  };

  const handleSaveBanner = () => {
    if (isEditing) {
      setBanners((prevBanners) =>
        prevBanners.map((b) =>
          b.id === currentBanner.id ? currentBanner : b
        )
      );
    } else {
      setBanners((prevBanners) => [
        ...prevBanners,
        { ...currentBanner, id: Date.now() },
      ]);
    }
    handleCloseDialog();
  };

  const handleDeleteBanner = (id) => {
    setBanners((prevBanners) => prevBanners.filter((b) => b.id !== id));
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
          <ListItem key={banner.id}>
            <ListItemText
              primary={banner.title}
              secondary={banner.description}
            />
            <IconButton onClick={() => handleOpenDialog(banner)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteBanner(banner.id)} color="error">
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
            value={currentBanner?.title || ""}
            onChange={(e) =>
              setCurrentBanner({ ...currentBanner, title: e.target.value })
            }
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={currentBanner?.description || ""}
            onChange={(e) =>
              setCurrentBanner({ ...currentBanner, description: e.target.value })
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
