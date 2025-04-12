const express = require('express');
const cors = require('cors');
const productosRoutes = require('./app/routes/productos'); // Ruta corregida

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});