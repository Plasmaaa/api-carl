/**
 * Content Negotiation Middleware
 * Detects client's preferred format from Accept header
 * Supports: JSON, XML, YAML, CSV
 */

import { Request, Response, NextFunction } from 'express';

export const contentNegotiation = (req: Request, res: Response, next: NextFunction) => {
    const acceptHeader = req.headers['accept'] || 'application/json';
    const acceptedFormats = acceptHeader.split(',').map(format => format.split(';')[0].trim());

    // Determine format from Accept header
    let format = 'json'; // default
    if (acceptedFormats.includes('text/csv')) {
        format = 'csv';
    } else if (acceptedFormats.includes('application/xml')) {
        format = 'xml';
    } else if (acceptedFormats.includes('application/yaml') || acceptedFormats.includes('text/yaml')) {
        format = 'yaml';
    }

    // Store format in query for controller to use
    if (!req.query.format) {
        req.query.format = format;
    }

    next();
};

export default contentNegotiation;
