import { mountWithPlugins } from '../../../helpers/mount';
import Nutrition from '@/components/recipes/Nutrition.vue';

function rowValues(wrapper) {
    return Object.fromEntries(
        wrapper.findAll('tbody tr').map(row => [row.find('th').text(), row.find('td').text()]));
}

describe('Nutrition', () => {
    it('shows each nutrition value', () => {
        const wrapper = mountWithPlugins(Nutrition, {
            props: {
                nutrition: { calories: 450, fats: 12, carbohydrates: 30, sugars: 5, protein: 40 },
            },
        });

        expect(rowValues(wrapper)).toEqual({
            'Calories': '450',
            'Fats (g)': '12',
            'Carbs (g)': '30',
            'Sugars (g)': '5',
            'Protein (g)': '40',
        });
    });

    it('shows --- for missing values but keeps zeros', () => {
        const wrapper = mountWithPlugins(Nutrition, {
            props: { nutrition: { calories: 0, sugars: null } },
        });

        expect(rowValues(wrapper)).toEqual({
            'Calories': '0',
            'Fats (g)': '---',
            'Carbs (g)': '---',
            'Sugars (g)': '---',
            'Protein (g)': '---',
        });
    });

    it('throws when no nutrition prop is given', () => {
        // current behavior: the prop default `() => {}` returns undefined, not an empty object
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(() => mountWithPlugins(Nutrition)).toThrow(TypeError);

        vi.restoreAllMocks();
    });
});
