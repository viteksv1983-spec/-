/**
 * SEO URL Architecture — Strict Whitelist Configuration
 *
 * Group A: Occasion-based (nested under /torty-na-zamovlennya/)
 * Group B: Type-based (standalone at root /)
 *
 * IMPORTANT: Generic catch-all routes are FORBIDDEN.
 * All category slugs must be validated against these explicit arrays.
 */

// ─── Group A: Nested under /torty-na-zamovlennya/ ───
export const GROUP_A_CATEGORIES = {
    'vesilni': { dbCategory: 'wedding', label: 'Весільні торти' },
    'na-den-narodzhennya': { dbCategory: 'birthday', label: 'Торти на день народження' },
    'na-yuviley': { dbCategory: 'anniversary', label: 'Торти на ювілей' },
    'dytyachi': { dbCategory: 'kids', label: 'Дитячі торти' },
    'dlya-hlopchykiv': { dbCategory: 'boy', label: 'Торти для хлопчиків' },
    'dlya-divchat': { dbCategory: 'girl', label: 'Торти для дівчаток' },
    'dlya-zhinok': { dbCategory: 'for-women', label: 'Торти для жінок' },
    'dlya-cholovikiv': { dbCategory: 'for-men', label: 'Торти для чоловіків' },
    'gender-reveal': { dbCategory: 'gender-reveal', label: 'Торти Gender Reveal' },
    'korporatyvni': { dbCategory: 'corporate', label: 'Корпоративні торти' },
    'sezonni': { dbCategory: 'seasonal', label: 'Сезонні торти' },
    'foto-torty': { dbCategory: 'photo-cakes', label: 'Фото-торти' },
    'profesiine-svyato': { dbCategory: 'professional', label: 'Професійне свято' },
    'patriotychni': { dbCategory: 'patriotic', label: 'Патріотичні торти' },
    'na-khrestyny': { dbCategory: 'christening', label: 'Торти на хрестини' },
    'za-hobi': { dbCategory: 'hobby', label: 'Торти за хобі' },
};

// ─── Group B: Standalone at root level ───
export const GROUP_B_CATEGORIES = {
    'bento-torty': { dbCategory: 'bento', label: 'Бенто торти' },
    'biskvitni-torty': { dbCategory: 'biscuit', label: 'Бісквітні торти' },
    'musovi-torty': { dbCategory: 'mousse', label: 'Мусові торти' },
    'kapkeyky': { dbCategory: 'cupcakes', label: 'Капкейки' },
    'imbirni-pryanyky': { dbCategory: 'gingerbread', label: 'Імбирні пряники' },
    'nachynky': { dbCategory: 'fillings', label: 'Начинки' },
};

export const GROUP_A_SLUGS = Object.keys(GROUP_A_CATEGORIES);
export const GROUP_B_SLUGS = Object.keys(GROUP_B_CATEGORIES);

/**
 * Check if a slug belongs to Group A
 */
export function isGroupA(slug) {
    return slug in GROUP_A_CATEGORIES;
}

/**
 * Check if a slug belongs to Group B
 */
export function isGroupB(slug) {
    return slug in GROUP_B_CATEGORIES;
}

/**
 * Get the DB category key for a given URL slug (from either group)
 */
export function getDbCategory(slug) {
    if (GROUP_A_CATEGORIES[slug]) return GROUP_A_CATEGORIES[slug].dbCategory;
    if (GROUP_B_CATEGORIES[slug]) return GROUP_B_CATEGORIES[slug].dbCategory;
    return null;
}

/**
 * Get the canonical URL for a category
 * Group A: /torty-na-zamovlennya/{slug}/
 * Group B: /{slug}/
 */
export function getCategoryCanonicalUrl(slug) {
    if (isGroupA(slug)) return `/torty-na-zamovlennya/${slug}/`;
    if (isGroupB(slug)) return `/${slug}/`;
    return null;
}

/**
 * Get the product URL given its category slug and product slug
 * Group A: /torty-na-zamovlennya/{categorySlug}/{productSlug}
 * Group B: /{categorySlug}/{productSlug}
 */
export function getProductUrl(categorySlug, productSlug) {
    if (isGroupA(categorySlug)) return `/torty-na-zamovlennya/${categorySlug}/${productSlug}`;
    if (isGroupB(categorySlug)) return `/${categorySlug}/${productSlug}`;
    return `/cakes/${productSlug}`; // fallback
}

/**
 * Legacy DB category -> URL slug reverse map (for internal linking)
 */
export function dbCategoryToSlug(dbCategory) {
    for (const [slug, meta] of Object.entries(GROUP_A_CATEGORIES)) {
        if (meta.dbCategory === dbCategory) return slug;
    }
    for (const [slug, meta] of Object.entries(GROUP_B_CATEGORIES)) {
        if (meta.dbCategory === dbCategory) return slug;
    }
    return null;
}

/**
 * Get the URL path for a DB category (used in internal links)
 */
export function getCategoryUrlByDbKey(dbCategory) {
    const slug = dbCategoryToSlug(dbCategory);
    if (!slug) return null;
    return getCategoryCanonicalUrl(slug);
}
