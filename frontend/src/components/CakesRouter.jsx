import React from 'react';
import { useParams } from 'react-router-dom';
import CakeDetail from './CakeDetail';
import CakeList from './CakeList';

export default function CakesRouter() {
    const { categoryOrId } = useParams();

    // Check if the identifier is purely numeric
    if (/^\d+$/.test(categoryOrId)) {
        return <CakeDetail predefinedId={categoryOrId} />;
    }

    // Otherwise render CakeList for the category
    return <CakeList predefinedCategory={categoryOrId} />;
}
