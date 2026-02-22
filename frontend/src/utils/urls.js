import {
    GROUP_A_CATEGORIES,
    GROUP_B_CATEGORIES,
    isGroupA,
    isGroupB,
    getCategoryCanonicalUrl,
    dbCategoryToSlug
} from '../constants/seoRoutes';

/**
 * Get the category URL path for any DB category key (e.g. 'bento', 'wedding').
 * Returns the correct Group A or Group B canonical URL.
 */
export const getCategoryUrl = (dbCategory) => {
    const slug = dbCategoryToSlug(dbCategory);
    if (!slug) return `/cakes?category=${dbCategory}`;
    return getCategoryCanonicalUrl(slug);
};

/**
 * Get the product detail URL for a given cake object.
 * Uses the cake's `slug` (SEO slug) and `category` (DB key).
 */
export const getProductUrl = (cake) => {
    if (!cake || !cake.slug) return `/cakes/${cake?.id || ''}`;

    const categoryUrlSlug = dbCategoryToSlug(cake.category);
    if (!categoryUrlSlug) return `/cakes/${cake.slug}`;

    if (isGroupA(categoryUrlSlug)) {
        return `/torty-na-zamovlennya/${categoryUrlSlug}/${cake.slug}`;
    }
    if (isGroupB(categoryUrlSlug)) {
        return `/${categoryUrlSlug}/${cake.slug}`;
    }
    return `/cakes/${cake.slug}`;
};
