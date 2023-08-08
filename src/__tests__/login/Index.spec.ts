import {describe, it, expect, vi} from "vitest";
import {config, mount} from "@vue/test-utils";
import Login from "@/components/login/Index.vue";
import {Mocker} from "@/classes/mocker";
import router from "@/router";

import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({directives, components});

const mocker = new Mocker(0)
mocker.mock();

config.global.mocks = {$assets: ''};

let plugins: any = [vuetify, router];

describe("Login", () => {
    it("Renders properly", () => {
        const wrapper = mount(Login, {global: {plugins: plugins}});
        expect(wrapper.html()).toContain("<v-form");
    });

    it("Logins properly", async () => {
        const mockRouter = ['push'];
        const spy        = vi.spyOn(mockRouter, 'push' as any)

        const wrapper: any = mount(Login, {global: {plugins: plugins, mocks: {$router: mockRouter}}});

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'test';

        await wrapper.vm.login();

        expect(spy).toBeCalledWith({name: 'home'});
    });

    it("Errors properly with wrong password", async () => {
        const wrapper: any = mount(Login, {global: {plugins: plugins}});

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'testx';

        await wrapper.vm.login();

        expect(wrapper.find('v-alert').attributes('text')).toEqual('Wrong e-mail or password');
    });

    it("Errors properly", async () => {
        const wrapper: any = mount(Login, {global: {plugins: plugins}});

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'error';

        await wrapper.vm.login();

        expect(wrapper.find('v-alert').attributes('text')).toEqual('Request failed with status code 503')

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'networkerror';

        await wrapper.vm.login();

        expect(wrapper.find('v-alert').attributes('text')).toEqual('Network Error')

        wrapper.vm.form = true;
        wrapper.vm.email = 'test@test.com';
        wrapper.vm.password = 'timeout';

        await wrapper.vm.login();

        expect(wrapper.find('v-alert').attributes('text')).toEqual('timeout of 0ms exceeded')
    });
});
