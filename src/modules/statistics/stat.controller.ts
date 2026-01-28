import { Request, Response } from "express"
import { statService } from "./stat.service"

const getStat = async (req: Request, res: Response) => {
    try {
        const result = await statService.getStat();
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : 'get stats failed'
        })
    }
}

export const statsController = { getStat };