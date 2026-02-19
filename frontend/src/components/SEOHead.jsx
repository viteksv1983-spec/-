import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

export default function SEOHead({ title, description, keywords, h1, canonical, ogImage, type = 'website' }) {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);

    // Fetch SEO data from backend if not provided via props (for static pages)
    useEffect(() => {
        if (title) return; // If props provided, use them (e.g. Product Detail)

        const fetchSEO = async () => {
            try {
                // Encode path safely
                const path = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
                const response = await api.get(`/api/seo${path}`);
                if (response.data) {
                    setSeoData(response.data);
                }
            } catch (error) {
                // Fail silently, fallback to defaults
                console.log("No specific SEO data for this route");
            }
        };

        fetchSEO();
    }, [location.pathname, title]);

    const data = seoData || {};

    // Effective values: Prop > Backend > Default
    const effectiveTitle = title || data.meta_title || 'Antreme - Торти на замовлення';
    const effectiveDesc = description || data.meta_description || 'Найсмачніші торти на замовлення у Києві. Лише натуральні інгредієнти.';
    const effectiveKeywords = keywords || data.meta_keywords || 'торти, київ, замовлення, десерти';
    const effectiveCanonical = canonical || data.canonical_url || window.location.href;
    const effectiveOgImage = ogImage || data.og_image || '/og-image.jpg'; // TODO: Add default OG image

    return (
        <Helmet>
            <title>{effectiveTitle}</title>
            <meta name="description" content={effectiveDesc} />
            <meta name="keywords" content={effectiveKeywords} />
            <link rel="canonical" href={effectiveCanonical} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={effectiveTitle} />
            <meta property="og:description" content={effectiveDesc} />
            <meta property="og:image" content={effectiveOgImage} />
            <meta property="og:url" content={window.location.href} />

            {/* Schema.org */}
            {data.schema_json && (
                <script type="application/ld+json">
                    {data.schema_json}
                </script>
            )}

            {/* H1 Handling - usually rendered in page, but can be passed back if needed. 
                Here we just handle HEAD tags. H1 should be handled by the page component using the hook or context if dynamic H1 is needed globally.
                For now, let's assume specific pages render their own H1, 
                BUT for static pages managed via Admin, we might want to render H1 in PublicLayout? 
                Or allow pages to fetch it.
            */}
        </Helmet>
    );
}
