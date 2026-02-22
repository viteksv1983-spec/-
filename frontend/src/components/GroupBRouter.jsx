import React from 'react';
import { useParams } from 'react-router-dom';
import CakeList from './CakeList';
import CakeDetail from './CakeDetail';
import NotFound from './NotFound';
import { GROUP_B_CATEGORIES, isGroupB } from '../constants/seoRoutes';

/**
 * Router for Group B (Standalone at root level)
 * Handles both category listing and product detail pages.
 *
 * Routes:
 *   /:categorySlug           → CakeList
 *   /:categorySlug/:productSlug → CakeDetail
 */
export function GroupBCategoryPage() {
    const { categorySlug } = useParams();

    if (!isGroupB(categorySlug)) {
        return <NotFound />;
    }

    const { dbCategory } = GROUP_B_CATEGORIES[categorySlug];
    return <CakeList predefinedCategory={dbCategory} predefinedSlug={categorySlug} groupType="B" />;
}

export function GroupBProductPage() {
    const { categorySlug, productSlug } = useParams();

    if (!isGroupB(categorySlug)) {
        return <NotFound />;
    }

    const { dbCategory } = GROUP_B_CATEGORIES[categorySlug];
    return <CakeDetail predefinedSlug={productSlug} expectedCategory={dbCategory} groupType="B" categorySlug={categorySlug} />;
}
