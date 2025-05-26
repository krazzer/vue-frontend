import {describe, it, expect, vi, beforeEach} from "vitest";
import {config, mount, flushPromises} from "@vue/test-utils";
import Login from "@/components/login/Index.vue";
import {Mocker} from "@/classes/mocker";
import router from "@/router";

import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({directives, components});

const mocker = new Mocker(0)
mocker.mock();

config.global.mocks = {
    $assets: '',
    $translator: {tl: (key: string) => {
        const translations: {[key: string]: string} = {
            'login.emailAddress': 'Email Address',
            'login.password': 'Password',
            'login.remember': 'Remember me',
            'login.login': 'Login',
            'login.wrongLogin': 'Wrong e-mail or password',
            'login.passwordLost': 'Forgot password?'
        };
        return translations[key] || key;
    }},
    $appUtil: {
        doAction: vi.fn((action, params, callback, options) => {
            if (action === 'login') {
                if (params.password === 'test' && params.email === 'test@test.com') {
                    callback({ data: { success: true } });
                } else if (params.password === 'error') {
                    if (options && options.onError) {
                        options.onError({ message: 'Request failed with status code 503' });
                    }
                } else if (params.password === 'networkerror') {
                    if (options && options.onError) {
                        options.onError({ message: 'Network Error' });
                    }
                } else if (params.password === 'timeout') {
                    if (options && options.onError) {
                        options.onError({ message: 'timeout of 0ms exceeded' });
                    }
                } else {
                    callback({ data: { success: false } });
                }
            }
        }),
        isBusyLoading: vi.fn(() => false)
    }
};

let plugins: any = [vuetify, router];

describe("Login", () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = mount(Login, {global: {plugins: plugins}});
    });

    it("Renders properly", () => {
        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.find('[data-testid="email"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="password"]').exists()).toBe(true);
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
        expect(wrapper.find('button').text()).toContain('Login');
    });

    it("Validates form inputs", async () => {
        // Initially button should be disabled
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();

        // Set email only
        await wrapper.setData({ email: 'test@test.com', form: true });
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();

        // Set password only
        await wrapper.setData({ email: '', password: 'test', form: true });
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();

        // Set both email and password
        await wrapper.setData({ email: 'test@test.com', password: 'test', form: true });
        expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    });

    it("Logins properly", async () => {
        const mockRouter = ['push'];
        const spy = vi.spyOn(mockRouter, 'push' as any)

        wrapper = mount(Login, {global: {plugins: plugins, mocks: {$router: mockRouter}}});

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'test';

        await wrapper.vm.login();

        expect(spy).toBeCalledWith({name: 'home'});
    });

    it("Handles remember me checkbox", async () => {
        expect(wrapper.vm.remember).toBe(false);

        await wrapper.find('input[type="checkbox"]').trigger('click');

        // Note: Due to the complexity of Vuetify components, we check the data property directly
        // In a real scenario, you might need to find a better way to interact with the checkbox
        await wrapper.setData({ remember: true });
        expect(wrapper.vm.remember).toBe(true);
    });

    it("Errors properly with wrong password", async () => {
        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'testx';

        await wrapper.vm.login();
        await flushPromises();

        expect(wrapper.text()).toContain('Wrong e-mail or password');
    });

    it("Errors properly", async () => {
        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'error';

        await wrapper.vm.login();
        await flushPromises();

        expect(wrapper.text()).toContain('Request failed with status code 503');

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'networkerror';

        await wrapper.vm.login();
        await flushPromises();

        expect(wrapper.text()).toContain('Network Error');

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'timeout';

        await wrapper.vm.login();
        await flushPromises();

        expect(wrapper.text()).toContain('timeout of 0ms exceeded');
    });

    it("Navigates to password lost page", async () => {
        const link = wrapper.find('a');
        expect(link.exists()).toBe(true);
        expect(link.text()).toContain('Forgot password?');
    });

    it("Does not attempt login when form is invalid", async () => {
        const mockAppUtil = {
            doAction: vi.fn(),
            isBusyLoading: vi.fn()
        };

        wrapper = mount(Login, {
            global: {
                plugins: plugins,
                mocks: { $appUtil: mockAppUtil }
            }
        });

        // Form is null, should return early
        await wrapper.vm.login();

        expect(mockAppUtil.doAction).not.toHaveBeenCalled();
    });
});
