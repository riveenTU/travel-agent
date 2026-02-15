const express = require('express');
const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
const tourRoutes = require('./routes/tours');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tours', tourRoutes);

// Swagger definition
// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'My React App API',
//             version: '1.0.0',
//             description: 'API documentation for the backend',
//         },
//         servers: [
//             {
//                 url: 'http://localhost:4000',
//                 description: 'Development server',
//             },
//         ],
//     },
//     apis: ['./app.js'], // files containing annotations as above
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /**
//  * @swagger
//  * /:
//  *   get:
//  *     summary: Welcome message
//  *     description: Returns a simple message confirming the server is running
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           text/plain:
//  *             schema:
//  *               type: string
//  *               example: Server is running
//  */
// Sample route
app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;