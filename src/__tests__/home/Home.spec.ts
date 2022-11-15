import {describe, it, expect, vi} from "vitest";
import {mount, config} from "@vue/test-utils";
import HomeIndex from "@/components/home/Home.vue";
import {defaultConfig, plugin} from "@formkit/vue";
import router from "@/router";

import flushPromises from "flush-promises";

let localStorageGetItem = global.Storage.prototype.getItem;

// set localstorage to return true, so user is logged in
global.Storage.prototype.getItem = () => {
    return true;
};

import {Mocker} from "@/classes/mocker";

const mocker = new Mocker(0)
mocker.mock();

// reset localstorage functionality
global.Storage.prototype.getItem = localStorageGetItem;

let plugins = [[plugin, defaultConfig], router];

config.global.mocks = {$assets: ''};

describe("HomeIndex", () => {
    it("renders properly", async () => {
        const $route  = {params: {module: 'pages'}};
        const wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {$route}}});

        await flushPromises();

        expect(wrapper.find('.main').text()).toContain("Add page");
        expect(wrapper.find('.sidebar__menu li.selected a').text()).toContain("Pages");

        // change route
        wrapper.vm.$route = {params: {module: 'media'}}
        wrapper.vm.$options.watch.$route.call(wrapper.vm);

        await flushPromises();

        expect(wrapper.find('.main').text()).toContain("Uploaden");
    });

    it("errors properly", async () => {
        console = {error: vi.fn()}
        vi.spyOn(console, 'error');

        const $route = {params: {module: 'error'}};

        mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {$route}}});

        await flushPromises();

        expect(console.error).toHaveBeenCalled();
    });

    it("logs out properly", async () => {
        const mockRouter = ['push'];
        const spy        = vi.spyOn(mockRouter, 'push')

        const $route  = {params: {module: 'pages'}};
        const wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {$route, $router: mockRouter}}});

        await flushPromises();

        wrapper.vm.logout();

        await flushPromises();

        expect(spy).toBeCalledWith({name: 'login'});
    });

    it("logs out errors properly", async () => {
        mocker.mocker.onGet("/api/logout").reply(() => {
            return [400]
        });

        mocker.mocker.onGet("/api/home").reply(() => {
            return [200, {loggedIn: true}];
        });

        console = {error: vi.fn()}
        vi.spyOn(console, 'error');

        const wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {}}});

        await flushPromises();

        wrapper.vm.logout();

        await flushPromises();

        expect(console.error).toHaveBeenCalled();
    });

    it("loading home errors properly", async () => {
        mocker.mocker.onGet("/api/home").reply(() => {
            return [400];
        });

        console = {error: vi.fn()}
        vi.spyOn(console, 'error');

        mount(HomeIndex, {props: {}, global: {plugins: plugins}});

        await flushPromises();

        expect(console.error).toHaveBeenCalled();
    });

    it("toggles menu properly", async () => {
        let wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins}});

        expect(wrapper.find('#cms').classes()).toEqual([])

        await wrapper.find('.sidebar-close-button').trigger('click');

        expect(wrapper.find('#cms').classes()[0]).equals('open');
    });
});
