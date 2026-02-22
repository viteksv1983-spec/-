import React from 'react';
import SEOHead from './SEOHead';

function GalleryPhoto() {
    return (
        <div className="container mx-auto px-6 py-20 text-center">
            <SEOHead
                title="Фотогалерея тортів | Фото наших робіт | Antreme"
                description="Перегляньте нашу фотогалерею неймовірних тортів ручної роботи: весільні, дитячі, бенто-торти та інші десерти від Antreme."
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-8 uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Фотогалерея
            </h1>
            <div className="bg-white p-20 rounded-2xl shadow-xl flex flex-col items-center justify-center">
                <div className="text-6xl mb-6">📸</div>
                <p className="text-xl text-gray-500 italic">Наші чудові роботи з'являться тут незабаром...</p>
            </div>
        </div>
    );
}

export default GalleryPhoto;
