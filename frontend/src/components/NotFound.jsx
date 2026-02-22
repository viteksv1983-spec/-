import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

export default function NotFound() {
    return (
        <>
            <SEOHead
                title="404 — Сторінку не знайдено | Antreme"
                robots="noindex, follow"
                is404={true}
            />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--color-primary, #b76e79)' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                    Сторінку не знайдено
                </h2>
                <p style={{ color: '#777', maxWidth: '480px', marginBottom: '2rem' }}>
                    На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
                    Перевірте правильність URL-адреси або поверніться на головну.
                </p>
                <Link to="/" style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    background: 'var(--color-primary, #b76e79)',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'opacity .2s'
                }}>
                    На головну
                </Link>
            </div>
        </>
    );
}
