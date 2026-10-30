
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function getPagination({ page, limit } = {}) {
    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);

    const currentPage = Number.isNaN(parsedPage)
        ? DEFAULT_PAGE
        : Math.max(1, parsedPage);

    const pageSize = Number.isNaN(parsedLimit)
        ? DEFAULT_LIMIT
        : Math.min(MAX_LIMIT, Math.max(1, parsedLimit));

    return {
        page: currentPage,
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
    };
}

export function buildPaginationMetadata({ page, limit, totalItems }) {
    const safeTotalItems = Number.isFinite(totalItems)
        ? Math.max(0, totalItems)
        : 0;

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const totalPages = Math.ceil(safeTotalItems / safeLimit);

    return {
        currentPage: safePage,
        limit: safeLimit,
        totalItems: safeTotalItems,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
    };
}
