export interface Game {
    id?: number;
    title: string;
    genre: string;
    releaseDate: Date;
    platform: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HATEOASLink {
    href: string;
    method: string;
    rel: string;
}

export interface GameWithHATEOAS extends Game {
    _links: {
        [key: string]: HATEOASLink;
    };
}

export interface APIResponse<T> {
    data?: T;
    message?: string;
    error?: string | Record<string, any>;
    path?: string;
    method?: string;
    timestamp?: string;
}

export interface ApiError {
    status: number;
    code: string;
    message: string;
    timestamp: string;
}