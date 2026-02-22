import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

export default function SEOHead({ title, description, keywords, h1, canonical, ogImage, type = 'website', schema, robots }) {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);
    const domain = 'https://antreme.kiev.ua';

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
    const effectiveRobots = robots || data.meta_robots || 'index, follow';

    // Construct canonical
    const pathForCanonical = canonical || location.pathname;
    const effectiveCanonical = pathForCanonical.startsWith('http') ? pathForCanonical : `${domain}${pathForCanonical === '/' ? '' : pathForCanonical}`;

    const imagePath = ogImage || data.og_image || '/og-image.jpg';
    const effectiveOgImage = imagePath.startsWith('http') ? imagePath : `${domain}${imagePath}`;

    const effectiveSchema = schema || data.schema_json;

    return (
        <Helmet>
            <title>{effectiveTitle}</title>
            <meta name="description" content={effectiveDesc} />
            <meta name="keywords" content={effectiveKeywords} />
            <link rel="canonical" href={effectiveCanonical} />
            <meta name="robots" content={effectiveRobots} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={effectiveTitle} />
            <meta property="og:description" content={effectiveDesc} />
            <meta property="og:image" content={effectiveOgImage} />
            <meta property="og:url" content={effectiveCanonical} />
            <meta property="og:site_name" content="Antreme – Кондитерська майстерня" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={effectiveTitle} />
            <meta name="twitter:description" content={effectiveDesc} />
            <meta name="twitter:image" content={effectiveOgImage} />

            {/* Schema.org */}
            {effectiveSchema && (
                <script type="application/ld+json">
                    {typeof effectiveSchema === 'string' ? effectiveSchema : JSON.stringify(effectiveSchema)}
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
