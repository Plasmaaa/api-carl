/**
 * Content formatting utilities
 * Supports JSON, XML, YAML, and CSV output formats
 */

import { Response } from 'express';
import YAML from 'yaml';

export const convertToCSV = (data: any): string => {
    if (!Array.isArray(data)) {
        data = [data];
    }

    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map((obj: any) =>
        headers
            .map(header => {
                const value = obj[header];
                const stringValue = String(value ?? '');
                if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            .join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
};

const escapeXml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const toXml = (value: any, nodeName: string): string => {
    if (Array.isArray(value)) {
        return `<${nodeName}>${value.map((item) => toXml(item, 'item')).join('')}</${nodeName}>`;
    }

    if (value && typeof value === 'object') {
        const children = Object.entries(value)
            .map(([key, val]) => toXml(val, key))
            .join('');
        return `<${nodeName}>${children}</${nodeName}>`;
    }

    return `<${nodeName}>${escapeXml(String(value ?? ''))}</${nodeName}>`;
};

export const sendFormatted = (res: Response, data: any, format?: string, rootName = 'response') => {
    format = format || 'json';

    if (format === 'csv') {
        const csvData = data.data || data;
        res.set('Content-Type', 'text/csv; charset=utf-8');
        res.set('Content-Disposition', 'attachment; filename="data.csv"');
        return res.send(convertToCSV(csvData));
    }

    if (format === 'xml') {
        res.set('Content-Type', 'application/xml');
        const xmlBody = toXml(data, rootName);
        return res.send(`<?xml version="1.0" encoding="UTF-8"?>${xmlBody}`);
    }

    if (format === 'yaml') {
        res.set('Content-Type', 'application/yaml');
        return res.send(YAML.stringify(data));
    }

    res.set('Content-Type', 'application/json');
    return res.json(data);
};
