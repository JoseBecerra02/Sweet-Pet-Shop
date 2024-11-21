import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

export default function GestionSolicitudes() {
  // Colores personalizados
  const colors = {
    primary: "#CA6DF2",
    secondary: "#B86AD9",
    textDark: "#2D2D2D",
    textLight: "#FFFFFF",
  };

  // Simulación de datos de quejas
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      userId: 103,
      orderId: 45,
      subject: "Producto dañado",
      status: "Pendiente",
      description: "El producto llegó roto y no sirve.",
      date: "2024-11-01",
      response: "",
    },
    {
      id: 2,
      userId: 104,
      orderId: 46,
      subject: "Entrega tardía",
      status: "Respondida",
      description: "El pedido llegó con 5 días de retraso.",
      date: "2024-11-02",
      response: "Hemos ajustado los tiempos de entrega. Lamentamos el inconveniente.",
    },
  ]);

  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [responseText, setResponseText] = useState("");

  // Manejar el despliegue de detalles de quejas
  const handleToggleExpand = (complaintId) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  // Manejar el cambio en el campo de respuesta
  const handleResponseChange = (e) => {
    setResponseText(e.target.value);
  };

  // Enviar respuesta a una queja
  const handleSendResponse = (complaintId) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, response: responseText, status: "Respondida" }
          : complaint
      )
    );
    setResponseText("");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Toolbar>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ marginTop: "50px", color: colors.textDark, fontWeight: "bold" }}
        >
          Gestión de Solicitudes
        </Typography>
      </Toolbar>
      <Divider sx={{ marginY: 3 }} />
      <List>
        {complaints.map((complaint) => (
          <React.Fragment key={complaint.id}>
            <ListItem button onClick={() => handleToggleExpand(complaint.id)}>
              <ListItemText
                primary={`Queja #${complaint.id} - Asunto: ${complaint.subject}`}
                secondary={`Pedido: #${complaint.orderId} | Fecha: ${complaint.date} | Estado: ${complaint.status}`}
              />
              <IconButton>
                {expandedComplaint === complaint.id ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>
            <Collapse in={expandedComplaint === complaint.id} timeout="auto" unmountOnExit>
              <Box sx={{ marginLeft: 4, marginBottom: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Descripción:
                </Typography>
                <Typography variant="body2">{complaint.description}</Typography>
                <Divider sx={{ marginY: 2 }} />
                {complaint.response ? (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Respuesta del Administrador:
                    </Typography>
                    <Typography variant="body2">{complaint.response}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Responder:
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      value={responseText}
                      onChange={handleResponseChange}
                      fullWidth
                      margin="normal"
                      placeholder="Escribe la respuesta aquí..."
                      sx={{ backgroundColor: colors.secondary, color: colors.textLight }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleSendResponse(complaint.id)}
                      sx={{ marginTop: 2, backgroundColor: colors.primary, color: colors.textLight }}
                    >
                      Enviar Respuesta
                    </Button>
                  </>
                )}
              </Box>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
