import express from 'express';
import centerController from '../controller/center.controller.js';

const router = express.Router();

// Existing route
router.get('/getCenterAutoCompleteList', centerController.centerListAutoCompleteController);

// New center management routes
router.post('/create', centerController.createCenterController);
router.get('/:centerId', centerController.getCenterByIdController);
router.put('/:centerId', centerController.updateCenterController);
router.delete('/:centerId', centerController.deleteCenterController);
router.get('/', centerController.getAllCentersController);
router.get('/search', centerController.searchCentersController);
router.patch('/:centerId/status', centerController.updateCenterStatusController);

export default router;
