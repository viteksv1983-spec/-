export const CATEGORIES = [
    { slug: 'bento', name: 'Бенто тортики' },
    { slug: 'biscuit', name: 'Бісквітні торти' },
    { slug: 'mousse', name: 'Мусові торти' },
    { slug: 'wedding', name: 'Весільні торти' },
    { slug: 'cupcakes', name: 'Капкейки' },
    { slug: 'gingerbread', name: 'Імбирні пряники' },
    // Holiday Categories
    { slug: 'birthday', name: 'На День народження' },
    { slug: 'anniversary', name: 'На ювілей' },
    { slug: 'kids', name: 'Дитячі торти' },
    { slug: 'boy', name: 'Для хлопчиків' },
    { slug: 'girl', name: 'Для дівчаток' },
    { slug: 'for-women', name: 'Для жінок' },
    { slug: 'for-men', name: 'Для чоловіків' },
    { slug: 'patriotic', name: 'Патріотичні' },
    { slug: 'professional', name: 'Професійне свято' },
    { slug: 'gender-reveal', name: 'Gender Reveal' },
    { slug: 'hobby', name: 'За хобі' },
    { slug: 'corporate', name: 'Корпоративні' },
    { slug: 'christening', name: 'На Хрестини' },
    { slug: 'seasonal', name: 'Сезонні' },
    { slug: 'photo-cakes', name: 'Фото-торти' },
];

export const HOLIDAY_SUB_CATEGORIES = [
    CATEGORIES[3], // Весільні торти
    ...CATEGORIES.slice(6) // Birthday onwards
];

export const ALL_CATEGORIES = CATEGORIES;

export const GET_CATEGORY_NAME = (slug) => {
    const cat = CATEGORIES.find(c => c.slug === slug);
    return cat ? cat.name : slug;
};
