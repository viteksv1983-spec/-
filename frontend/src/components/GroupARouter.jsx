import React from 'react';
import { useParams } from 'react-router-dom';
import CakeList from './CakeList';
import CakeDetail from './CakeDetail';
import NotFound from './NotFound';
import { GROUP_A_CATEGORIES, isGroupA } from '../constants/seoRoutes';

/**
 * Router for Group A (Nested under /torty-na-zamovlennya/)
 * Handles both category listing and product detail pages.
 *
 * Routes:
 *   /torty-na-zamovlennya/:categorySlug       → CakeList
 *   /torty-na-zamovlennya/:categorySlug/:productSlug → CakeDetail
 */
export function GroupACategoryPage() {
    const { categorySlug } = useParams();

    if (!isGroupA(categorySlug)) {
        return <NotFound />;
    }

    const { dbCategory } = GROUP_A_CATEGORIES[categorySlug];
    return <CakeList predefinedCategory={dbCategory} predefinedSlug={categorySlug} groupType="A" />;
}

export function GroupAProductPage() {
    const { categorySlug, productSlug } = useParams();

    if (!isGroupA(categorySlug)) {
        return <NotFound />;
    }

    const { dbCategory } = GROUP_A_CATEGORIES[categorySlug];
    return <CakeDetail predefinedSlug={productSlug} expectedCategory={dbCategory} groupType="A" categorySlug={categorySlug} />;
}
