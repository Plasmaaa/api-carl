import { Request, Response, NextFunction } from 'express';
import YAML from 'yaml';

declare global {
    namespace Express {
        interface Response {
            format?: string;
        }
    }
}

export const contentNegotiation = (req: Request, res: Response, next: NextFunction) => {
    const acceptHeader = req.headers['accept'] || 'application/json';
    const acceptedFormats = acceptHeader.split(',').map(format => format.split(';')[0].trim());

    // Store the preferred format
    if (acceptedFormats.includes('application/xml')) {
        (res as any).format = 'xml';
    } else if (acceptedFormats.includes('application/yaml') || acceptedFormats.includes('text/yaml')) {
        (res as any).format = 'yaml';
    } else {
        (res as any).format = 'json'; // Default
    }

    // Override res.json to support multiple formats
    const originalJson = res.json.bind(res);
    (res.json as any) = function(data: any) {
        if ((res as any).format === 'xml') {
            res.set('Content-Type', 'application/xml');
            // Simple XML conversion
            const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>' + JSON.stringify(data) + '</root>';
            return res.send(xml);
        } else if ((res as any).format === 'yaml') {
            res.set('Content-Type', 'application/yaml');
            return res.send(YAML.stringify(data));
        }
        return originalJson(data);
    };

    next();
};

export default contentNegotiation;