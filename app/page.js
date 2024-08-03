'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  AppBar,
  Toolbar,
  Container,
  Paper,
  IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const theme = {
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
};

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

const InventoryItem = ({ item, quantity, onAdd, onRemove }) => (
  <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}>
    <Typography variant="subtitle1" fontWeight="medium">
      {item.charAt(0).toUpperCase() + item.slice(1)}
    </Typography>
    <Box display="flex" alignItems="center">
      <Typography variant="body1" mr={2}>
        Quantity: {quantity}
      </Typography>
      <IconButton size="small" color="primary" onClick={() => onAdd(item)}>
        <Add />
      </IconButton>
      <IconButton size="small" color="secondary" onClick={() => onRemove(item)}>
        <Remove />
      </IconButton>
    </Box>
  </Paper>
);

const AddItemModal = ({ open, onClose, onAdd }) => {
  const [itemName, setItemName] = useState('');

  const handleAdd = () => {
    if (itemName.trim()) {
      onAdd(itemName.trim());
      setItemName('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
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
        <Button variant="contained" fullWidth onClick={handleAdd}>
          Add
        </Button>
      </Box>
    </Modal>
  );
};

const Inventory = () => {
  const [inventory, setInventory] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleAdd = (item) => {
    if (inventory[item]) {
      setInventory((prevInventory) => ({ ...prevInventory, [item]: prevInventory[item] + 1 }));
    } else {
      setInventory((prevInventory) => ({ ...prevInventory, [item]: 1 }));
    }
  };

  const handleRemove = (item) => {
    if (inventory[item] === 1) {
      setInventory((prevInventory) => {
        const newInventory = { ...prevInventory };
        delete newInventory[item];
        return newInventory;
      });
    } else {
      setInventory((prevInventory) => ({ ...prevInventory, [item]: prevInventory[item] - 1 }));
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="background.default">
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Inventory
          </Typography>
          <Button color="inherit" onClick={() => setOpen(true)}>
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
            {Object.keys(inventory).map((item) => (
              <InventoryItem
                key={item}
                item={item}
                quantity={inventory[item]}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))}
          </Stack>
        </Paper>
      </Container>

      <AddItemModal open={open} onClose={() => setOpen(false)} onAdd={handleAdd} />
    </Box>
  );
};

export default Inventory;
