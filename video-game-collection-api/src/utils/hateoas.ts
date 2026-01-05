/**
 * HATEOAS (Hypermedia As The Engine Of Application State) utilities
 * Adds hypermedia links to API responses for better REST compliance
 */

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

/**
 * Adds HATEOAS links to a resource
 * @param data - The resource data
 * @param resourceType - Type of resource (e.g., 'game')
 * @param resourceId - ID of the resource
 * @param apiVersion - API version (v1, v2, etc.)
 * @returns Resource with HATEOAS links
 */
export const addHATEOAS = (
    data: any,
    resourceType: string,
    resourceId: number,
    apiVersion: string = 'v1'
): HATEOASResponse => {
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