'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, AppBar, Toolbar, Container, Paper, IconButton, ThemeProvider, createTheme } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const q = query(collection(firestore, 'inventory'));
    const docs = await getDocs(q);
    const inventoryList = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    updateInventory();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="background.default">
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Inventory
            </Typography>
            <Button color="inherit" onClick={handleOpen}>
              Add Item
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box p={3} bgcolor="primary.main" color="primary.contrastText">
              <Typography variant="h5" fontWeight="medium">Inventory Items</Typography>
            </Box>
            <Stack spacing={2} p={3} maxHeight="60vh" overflow="auto">
              {inventory.map(({ id, quantity }) => (
                <Paper key={id} elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" mr={2}>
                      Quantity: {quantity}
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => addItem(id)}>
                      <Add />
                    </IconButton>
                    <IconButton size="small" color="secondary" onClick={() => removeItem(id)}>
                      <Remove />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Container>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
              Add New Item
            </Typography>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName.trim());
                  setItemName('');
                  handleClose();
                }
              }}
            >
              Add
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}
