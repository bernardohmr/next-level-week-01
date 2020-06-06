import { Router } from "express";
import { celebrate, Joi } from "celebrate";

import multer from "multer";
import multerConfig from "./config/multer";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const routes = Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items",itemsController.list);
routes.get("/points/:id", pointsController.read);
routes.get("/points", pointsController.list);

routes.post(
    "/points",
    upload.single("image"),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        }),
    }, {
        abortEarly: false,
    }),
    pointsController.create
);

export default routes;
