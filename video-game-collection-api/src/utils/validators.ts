import { Request, Response, NextFunction } from 'express';

// Platform whitelist
export const VALID_PLATFORMS = ['PlayStation', 'Xbox', 'Nintendo Switch', 'PC', 'Mobile', 'Web'];

// Validate game creation payload
export const validateGameCreation = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push('Title is required and must be a non-empty string');
    }

    if (!data.genre || typeof data.genre !== 'string' || data.genre.trim().length === 0) {
        errors.push('Genre is required and must be a non-empty string');
    }

    if (!data.releaseDate || !isValidDate(data.releaseDate)) {
        errors.push('Release date is required and must be a valid ISO date');
    }

    if (!data.platform || !VALID_PLATFORMS.includes(data.platform)) {
        errors.push(`Platform is required and must be one of: ${VALID_PLATFORMS.join(', ')}`);
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Validate game update payload (partial)
export const validateGameUpdate = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (data.hasOwnProperty('title')) {
        if (typeof data.title !== 'string' || data.title.trim().length === 0) {
            errors.push('Title must be a non-empty string');
        }
    }

    if (data.hasOwnProperty('genre')) {
        if (typeof data.genre !== 'string' || data.genre.trim().length === 0) {
            errors.push('Genre must be a non-empty string');
        }
    }

    if (data.hasOwnProperty('releaseDate')) {
        if (!isValidDate(data.releaseDate)) {
            errors.push('Release date must be a valid ISO date');
        }
    }

    if (data.hasOwnProperty('platform')) {
        if (!VALID_PLATFORMS.includes(data.platform)) {
            errors.push(`Platform must be one of: ${VALID_PLATFORMS.join(', ')}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Helper function to validate ISO date
export const isValidDate = (dateString: string): boolean => {
    if (typeof dateString !== 'string') return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

// Express middleware for validation errors
export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
    next();
};