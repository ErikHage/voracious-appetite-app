import { mountWithPlugins } from '../../../helpers/mount';
import NutritionInfo from '@/components/recipes/NutritionInfo.vue';

function rowValues(wrapper) {
    return Object.fromEntries(
        wrapper.findAll('tbody tr').map(row => [row.find('th').text(), row.find('td').text()]));
}

describe('NutritionInfo', () => {
    it('shows each nutrition value', () => {
        const wrapper = mountWithPlugins(NutritionInfo, {
            props: {
                nutrition: {
                    servingSize: { type: 'cup', value: 1 },
                    calories: 450, fats: 12, carbohydrates: 30, sugars: 5, protein: 40,
                },
            },
        });

        expect(rowValues(wrapper)).toEqual({
            'Serving Size': '1 cup',
            'Calories': '450',
            'Fats (g)': '12',
            'Carbs (g)': '30',
            'Sugars (g)': '5',
            'Protein (g)': '40',
        });
    });

    it('shows --- for missing values but keeps zeros', () => {
        const wrapper = mountWithPlugins(NutritionInfo, {
            props: { nutrition: { calories: 0, sugars: null } },
        });

        expect(rowValues(wrapper)).toEqual({
            'Serving Size': '---',
            'Calories': '0',
            'Fats (g)': '---',
            'Carbs (g)': '---',
            'Sugars (g)': '---',
            'Protein (g)': '---',
        });
    });

    it('shows --- for a serving size with no value, and the value alone when it has no type', () => {
        const noValue = mountWithPlugins(NutritionInfo, {
            props: { nutrition: { servingSize: { type: '', value: null } } },
        });
        const noType = mountWithPlugins(NutritionInfo, {
            props: { nutrition: { servingSize: { type: '', value: 2 } } },
        });

        expect(rowValues(noValue)['Serving Size']).toBe('---');
        expect(rowValues(noType)['Serving Size']).toBe('2');
    });

    it('throws when no nutrition prop is given', () => {
        // current behavior: the prop default `() => {}` returns undefined, not an empty object
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(() => mountWithPlugins(NutritionInfo)).toThrow(TypeError);

        vi.restoreAllMocks();
    });
});
