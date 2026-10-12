import { mountWithPlugins } from '../../../helpers/mount';
import PreparationStepsList from '@/components/recipes/PreparationStepsList.vue';

describe('PreparationStepsList', () => {
    it('shows the steps in order', () => {
        const wrapper = mountWithPlugins(PreparationStepsList, {
            props: { steps: [{ text: 'Chop.' }, { text: 'Simmer.' }] },
        });

        expect(wrapper.findAll('ol li').map(li => li.text())).toEqual(['Chop.', 'Simmer.']);
    });

    it('renders no steps by default', () => {
        const wrapper = mountWithPlugins(PreparationStepsList);

        expect(wrapper.findAll('ol li')).toHaveLength(0);
    });
});
