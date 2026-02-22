export const getCategoryUrl = (slug) => {
    const seoMap = {
        'bento': '/bento-torty',
        'biscuit': '/biskvitni-torty',
        'mousse': '/musovi-torty',
        'wedding': '/vesilni-torty',
        'cupcakes': '/kapkeyki',
        'gingerbread': '/imbirni-pryaniki'
    };
    return seoMap[slug] || `/cakes?category=${slug}`;
};
