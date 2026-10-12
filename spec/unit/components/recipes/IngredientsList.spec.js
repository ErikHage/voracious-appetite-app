import { mountWithPlugins } from '../../../helpers/mount';
import IngredientsList from '@/components/recipes/IngredientsList.vue';

describe('IngredientsList', () => {
    it('shows each ingredient with its quantity, display unit and notes', () => {
        const wrapper = mountWithPlugins(IngredientsList, {
            props: {
                ingredients: [
                    { name: 'flour', quantity: { value: 2, kind: 'cup' } },
                    { name: 'salt', quantity: { value: 1, kind: 'TEASPOON' }, notes: 'kosher' },
                    { name: 'eggs', quantity: { value: 3, kind: null } },
                ],
            },
        });

        const rows = wrapper.findAll('tbody tr');
        expect(rows).toHaveLength(3);

        expect(rows[0].find('.quantity-col').text()).toBe('2 cups');
        expect(rows[0].find('.name-col').text()).toBe('flour');
        expect(rows[0].find('.ingredient-notes').exists()).toBe(false);

        expect(rows[1].find('.quantity-col').text()).toBe('1 tsp');
        expect(rows[1].find('.ingredient-notes').text()).toBe('kosher');

        expect(rows[2].find('.quantity-col').text()).toBe('3');
    });

    it('renders no rows by default', () => {
        const wrapper = mountWithPlugins(IngredientsList);

        expect(wrapper.findAll('tbody tr')).toHaveLength(0);
    });
});
