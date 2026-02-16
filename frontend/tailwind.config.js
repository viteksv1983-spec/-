/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                serif: ['Montserrat', 'sans-serif'], // Accessing Vatsak usually uses sans-serif even for headers
            },
            colors: {
                vatsak: {
                    red: '#7b002c', // Deep Maroon/Red
                    gold: '#c5a059', // Gold/Beige
                    light: '#fdfbf7', // Off-white background
                    accent: '#ffd700', // Bright Gold
                }
            }
        },
    },
    plugins: [],
}
