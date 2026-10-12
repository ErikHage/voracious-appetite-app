import { mountWithPlugins } from '../../../helpers/mount';
import TimeAndYield from '@/components/recipes/TimeAndYield.vue';

describe('TimeAndYield', () => {
    it('shows prep, cook and yield', () => {
        const wrapper = mountWithPlugins(TimeAndYield, {
            props: {
                prep: { value: 20, kind: 'minutes' },
                cook: { value: 2, kind: 'hours' },
                yield: { value: 6, kind: 'servings' },
            },
        });

        const rows = wrapper.findAll('tbody tr').map(row => row.text());
        expect(rows).toEqual(['Prep Time20 minutes', 'Cook Time2 hours', 'Yield6 servings']);
    });

    it('omits rows whose prop is missing', () => {
        const wrapper = mountWithPlugins(TimeAndYield, {
            props: { cook: { value: 45, kind: 'minutes' } },
        });

        const rows = wrapper.findAll('tbody tr').map(row => row.text());
        expect(rows).toEqual(['Cook Time45 minutes']);
    });
});
