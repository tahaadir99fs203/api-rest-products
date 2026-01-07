/**
 * Routes pour la vérification de l'état de l'API
 */

const express = require('express');
const router = express.Router();

// GET /api/health - Vérifier l'état de l'API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST fonctionnelle',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});

module.exports = router;
