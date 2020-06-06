import knex from "../database/connection";
import { Request, Response } from "express";

class ItemsController {
    public async list (req: Request, res: Response) {
        const items = await knex("items").select("*");
        // serialize items to get image_url
        items.map((item) => item.image_url = `${process.env.PUBLIC_URL}/uploads/${item.image}`)
        return res.json(items);

    }
}

export default ItemsController;
