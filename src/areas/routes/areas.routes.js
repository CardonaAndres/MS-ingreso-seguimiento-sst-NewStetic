import express from "express";
import { AreasController } from "../controllers/areas.controller.js";

const router = express.Router();

router.get('/', AreasController.getAreasPaginate);
router.get('/without-paginate', AreasController.getAreas);
router.post('/', AreasController.create);
router.patch('/:areaID', AreasController.update);

export default router;