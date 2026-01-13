import models from "../models";
import { Request, Response } from "express";
import { Op } from "sequelize";

const GetAllStops = async (req: Request, res: Response) => {
    try {
        const stops = await models.RouteStop.findAll({
            attributes: [[models.sequelize.fn('DISTINCT', models.sequelize.col('stop_name')), 'stop_name']],
            raw: true
        });
        const stopNames = stops.map((s: any) => s.stop_name);
        return res.status(200).json({ stops: stopNames });
    } catch (error: any) {
        console.error("Error fetching stops:", error);
        return res.status(500).send(error.message);
    }
};

const SearchRoutes = async (req: Request, res: Response) => {
    try {
        const { stop_from, stop_to } = req.query;
        
        if (!stop_from || !stop_to) {
            return res.status(400).json({ message: "Both stop_from and stop_to are required" });
        }

        // Find all routes that contain both stops
        const routesWithFrom = await models.RouteStop.findAll({
            where: { stop_name: stop_from },
            attributes: ['route_id'],
            raw: true
        });

        const routeIds = routesWithFrom.map((r: any) => r.route_id);

        if (routeIds.length === 0) {
            return res.status(200).json({ results: [] });
        }

        // Find routes that also have the destination stop
        const validRoutes = [];
        
        for (const routeId of routeIds) {
            const stops = await models.RouteStop.findAll({
                where: { route_id: routeId },
                order: [['stop_order', 'ASC']],
                include: [{
                    model: models.Route,
                    as: 'route',
                    include: [{
                        model: models.Bus,
                        as: 'bus'
                    }]
                }]
            });

            const fromIndex = stops.findIndex((s: any) => s.stop_name === stop_from);
            const toIndex = stops.findIndex((s: any) => s.stop_name === stop_to);

            // Only valid if destination comes after origin
            if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
                const fromStop = stops[fromIndex];
                const toStop = stops[toIndex];
                const stopsInBetween = stops.slice(fromIndex, toIndex + 1);

                validRoutes.push({
                    route_id: routeId,
                    bus: fromStop.route?.bus || {},
                    route_name: fromStop.route?.route_name || '',
                    direction: fromStop.route?.direction || '',
                    departure_time: fromStop.leaves,
                    arrival_time: toStop.arrives,
                    stops: stopsInBetween.map((s: any) => ({
                        stop_name: s.stop_name,
                        platform: s.platform,
                        arrives: s.arrives,
                        leaves: s.leaves,
                        stop_order: s.stop_order
                    }))
                });
            }
        }

        if (validRoutes.length === 0) {
            return res.status(200).json({ results: [] });
        }

        return res.status(200).json({ results: validRoutes });
    } catch (error: any) {
        console.error("Error searching routes:", error);
        return res.status(500).send(error.message);
    }
};

export default {
    GetAllStops,
    SearchRoutes,
};