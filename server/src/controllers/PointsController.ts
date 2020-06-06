import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
    public async create (req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        // knex transation: guaraantees a atomic concatenated insertion
        const trx = await knex.transaction();

        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };

        // saving new POINT to db
        const insertedIds = await trx("points").insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(",")
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                };
            });

        // saving related ITEMS to db
        await trx("point_items").insert(pointItems);

        // solving error knex timeout the pool is probably full...
        await trx.commit();

        return res.json({
            ...point,
            point_id,
        });

    }

    public async read(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex("points").where({ id }).first();

        if (!point) {
            return res.status(400).json({ message: "Point not found" });
        }

        const serializedPoint = {
            ...point,
            image_url: `${process.env.PUBLIC_URL}/uploads/${point.image}`,
        };

        const items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", id)
            .select("items.title");

        return res.json({
            point: serializedPoint,
            items
        });
    }

    public async list(req: Request, res: Response) {
        const { city, uf, items } = req.query;
        const parsedItems = String(items)
            .split(",")
            .map((item) => Number(item.trim()));

        const points = await knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", parsedItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select("points.*");

        const serializedPoints = points.map((point) => {
            return {
                ...point,
                image_url: `${process.env.PUBLIC_URL}/uploads/${point.image}`,
            }
        });

        return res.json(serializedPoints);
    }
}

export default PointsController;
