export interface HATEOASLink {
    href: string;
    method: string;
    rel: string;
}

export interface HATEOASResponse {
    [key: string]: any;
    _links: {
        [key: string]: HATEOASLink;
    };
}

export const addHATEOAS = (data: any, resourceType: string, resourceId: number, apiVersion: string = 'v1'): HATEOASResponse => {
    const baseUrl = `/api/${apiVersion}`;

    const links: { [key: string]: HATEOASLink } = {
        self: {
            href: `${baseUrl}/${resourceType}s/${resourceId}`,
            method: 'GET',
            rel: 'self',
        },
        update: {
            href: `${baseUrl}/${resourceType}s/${resourceId}`,
            method: 'PATCH',
            rel: 'update',
        },
        delete: {
            href: `${baseUrl}/${resourceType}s/${resourceId}`,
            method: 'DELETE',
            rel: 'delete',
        },
        collection: {
            href: `${baseUrl}/${resourceType}s`,
            method: 'GET',
            rel: 'collection',
        },
    };

    return {
        ...data,
        _links: links,
    };
};

export const generateHATEOASLinks = (gameId: number): object => {
    return {
        self: {
            href: `/api/v1/games/${gameId}`,
            method: 'GET'
        },
        update: {
            href: `/api/v1/games/${gameId}`,
            method: 'PATCH'
        },
        delete: {
            href: `/api/v1/games/${gameId}`,
            method: 'DELETE'
        },
        collection: {
            href: `/api/v1/games`,
            method: 'GET'
        }
    };
};

export const generateHATEOASLinksV2 = (gameId: number): object => {
    return {
        self: {
            href: `/api/v2/games/${gameId}`,
            method: 'GET'
        },
        update: {
            href: `/api/v2/games/${gameId}`,
            method: 'PATCH'
        },
        delete: {
            href: `/api/v2/games/${gameId}`,
            method: 'DELETE'
        },
        collection: {
            href: `/api/v2/games`,
            method: 'GET'
        },
        related: {
            href: `/api/v2/games/${gameId}/related`,
            method: 'GET'
        }
    };
};