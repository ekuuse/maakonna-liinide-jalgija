import models from "../models";
import { Request, Response } from "express";

const LookForTimes = async (req: Request, res: Response) => {
    try {
        const stopName = req.params.stop;
        const bustime = await models.BusTime.findOne({
            where: { stop_name: stopName },
        });
        if (!bustime) {
            return res.status(404).json({ message: "Bus stop not found" });
        }
        return res.status(200).json({ bustime });
    } catch (error: any) {
        console.error("Error fetching bus times:", error);
        return res.status(500).send(error.message);
    }
};

export default {
    LookForTimes,
};