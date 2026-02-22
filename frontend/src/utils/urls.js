export const getCategoryUrl = (slug) => {
    const seoMap = {
        'bento': '/bento-torty',
        'biscuit': '/biskvitni-torty',
        'mousse': '/musovi-torty',
        'wedding': '/vesilni-torty',
        'cupcakes': '/kapkeyki',
        'gingerbread': '/imbirni-pryaniki',
        'birthday': '/torty-na-den-narodzhennya',
        'anniversary': '/torty-na-yuviley',
        'kids': '/dytyachi-torty',
        'boy': '/torty-dlya-khlopchykiv',
        'girl': '/torty-dlya-divchatok',
        'for-women': '/torty-dlya-zhinok',
        'for-men': '/torty-dlya-cholovikiv',
        'patriotic': '/patriotychni-torty',
        'professional': '/torty-na-profesiyne-svyato',
        'gender-reveal': '/torty-gender-reveal-party',
        'hobby': '/torty-za-khobi',
        'corporate': '/korporatyvni-torty',
        'christening': '/torty-na-khrestyny',
        'seasonal': '/sezonni-torty',
        'photo-cakes': '/foto-torty'
    };
    return seoMap[slug] || `/cakes?category=${slug}`;
};
