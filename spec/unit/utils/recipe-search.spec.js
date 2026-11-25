import { matchesRecipeSearch } from '@/utils/recipe-search';

// recipes-service joins a recipe's name and keywords with '.'
const beefStew = { recipeId: 'beef-stew', recipeName: 'Beef Stew', filterMatchString: 'beef.stew.comfort.winter' };

describe('matchesRecipeSearch', () => {
    it('matches a word of the match string, ignoring case', () => {
        expect(matchesRecipeSearch(beefStew, 'STEW')).toBe(true);
    });

    it('matches part of a word', () => {
        expect(matchesRecipeSearch(beefStew, 'ste')).toBe(true);
    });

    it('matches a keyword beyond the name', () => {
        expect(matchesRecipeSearch(beefStew, 'winter')).toBe(true);
    });

    it('matches the words in any order', () => {
        expect(matchesRecipeSearch(beefStew, 'stew beef')).toBe(true);
    });

    it('needs every word to match', () => {
        expect(matchesRecipeSearch(beefStew, 'beef soup')).toBe(false);
    });

    it('matches every recipe for a search of nothing or only spaces', () => {
        expect(matchesRecipeSearch(beefStew, '')).toBe(true);
        expect(matchesRecipeSearch(beefStew, '   ')).toBe(true);
    });
});
