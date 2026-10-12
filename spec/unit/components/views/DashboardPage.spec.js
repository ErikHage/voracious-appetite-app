import { mountWithPlugins } from '../../../helpers/mount';
import DashboardPage from '@/components/views/DashboardPage.vue';

describe('DashboardPage', () => {
    it('shows the logo from the asset path', () => {
        const wrapper = mountWithPlugins(DashboardPage, { global: { mocks: { $router: { push: vi.fn() } } } });

        expect(wrapper.find('h1').text()).toBe('Voracious Appetite');
        expect(wrapper.vm.getAssetPath('ai-cardinal.jpg')).toBe('/assets-test/ai-cardinal.jpg');
    });

    it('navigates to the recipes list', async () => {
        const router = { push: vi.fn() };
        const wrapper = mountWithPlugins(DashboardPage, { global: { mocks: { $router: router } } });

        await wrapper.find('button').trigger('click');

        expect(router.push).toHaveBeenCalledWith('/recipes');
    });
});
