import {describe, it, expect, vi} from "vitest";
import {config, mount} from "@vue/test-utils";
import Login from "@/components/login/Index.vue";
import {plugin, defaultConfig} from '@formkit/vue'
import {Mocker} from "@/classes/mocker";
import router from "@/router";

const mocker = new Mocker(0)
mocker.mock();

config.global.mocks = {$assets: ''};

let plugins = [[plugin, defaultConfig], router];

describe("Login", () => {
    it("Renders properly", () => {
        const wrapper = mount(Login, {global: {plugins: plugins}});
        expect(wrapper.html()).toContain("<form");
    });

    it("Logins properly", async () => {
        const mockRouter = ['push'];
        const spy        = vi.spyOn(mockRouter, 'push')

        const wrapper = mount(Login, {global: {plugins: plugins, mocks: {$router: mockRouter}}});

        await wrapper.vm.login({email: 'test@test.com', password: 'test'})
        expect(spy).toBeCalledWith({name: 'home'});
    });

    it("Errors properly with wrong password", async () => {
        const wrapper = mount(Login, {global: {plugins: plugins}});

        await wrapper.vm.login({email: 'test@test.com', password: 'testx'})

        expect(wrapper.find('form .formkit-message').text()).toEqual('Wrong e-mail or password')
    });

    it("Errors properly", async () => {
        const wrapper = mount(Login, {global: {plugins: plugins}});

        await wrapper.vm.login({email: 'test@test.com', password: 'error'})
        expect(wrapper.find('form .formkit-message').text()).toEqual('Request failed with status code 503')

        await wrapper.vm.login({email: 'test@test.com', password: 'networkerror'})
        expect(wrapper.find('form .formkit-message').text()).toEqual('Network Error')

        await wrapper.vm.login({email: 'test@test.com', password: 'timeout'})
        expect(wrapper.find('form .formkit-message').text()).toEqual('timeout of 0ms exceeded')
    });
});
