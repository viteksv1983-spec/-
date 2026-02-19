import React from 'react';

function GalleryVideo() {
    return (
        <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Відеогалерея
            </h1>
            <div className="bg-white p-20 rounded-2xl shadow-xl flex flex-col items-center justify-center">
                <div className="text-6xl mb-6">🎬</div>
                <p className="text-xl text-gray-500 italic">Відео процесу створення солодких магій будуть тут...</p>
            </div>
        </div>
    );
}

export default GalleryVideo;
