/**
 * The side drawer's one section, and its links, in order, as FrAppShell
 * takes them. Each link's value is its route's name. The section has no
 * label: a heading would only add a way to collapse two links
 */
export const sections = [
    {
        items: [
            { value: 'dashboard', title: 'Home', icon: 'mdi-home', to: '/' },
            { value: 'recipes-list', title: 'Recipes', icon: 'mdi-silverware-fork-knife', to: '/recipes' },
        ],
    },
];

const links = sections.flatMap(section => section.items);

/**
 * The value of the link the path is at, or under: a recipe's page is under
 * Recipes. Home is only ever its own path, since every path is under '/'.
 * Empty for a path under none of them
 */
export function activeViewFor(path) {
    const link = links
        .filter(item => path === item.to || (item.to !== '/' && path.startsWith(`${item.to}/`)))
        .sort((a, b) => b.to.length - a.to.length)[0];
    return link?.value ?? '';
}
