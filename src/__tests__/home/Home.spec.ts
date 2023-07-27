import {describe, it, expect, vi} from "vitest";
import {mount, config} from "@vue/test-utils";
import HomeIndex from "@/components/home/Home.vue";
import {defaultConfig, plugin} from "@formkit/vue";
import router from "@/router";
import flushPromises from "flush-promises";
import {Mocker} from "@/classes/mocker";

const mocker = new Mocker(0)
mocker.loginMock.loggedIn = true;
mocker.mock();

let plugins: any = [[plugin, defaultConfig], router];

config.global.mocks = {$assets: ''};

describe("HomeIndex", () => {
    it("renders properly", async () => {
        const $route  = {params: {module: 'pages'}};
        const wrapper: any = mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {$route}}});

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
        let consoleErrorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => { });

        const $route = {params: {module: 'error'}};

        mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {$route}}});

        await flushPromises();

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("logs out properly", async () => {
        const mockRouter = ['push'];
        const spy        = vi.spyOn(mockRouter, 'push' as any)

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

        let consoleErrorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => { });

        const wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {}}});

        await flushPromises();

        wrapper.vm.logout();

        await flushPromises();

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("loading home errors properly", async () => {
        mocker.mocker.onGet("/api/home").reply(() => {
            return [400];
        });

        let consoleErrorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => { });

        mount(HomeIndex, {props: {}, global: {plugins: plugins}});

        await flushPromises();

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();

        // reset mocker
        mocker.homeMock.mockHomeReply(mocker.mocker);
    });

    it("toggle and closes menu properly", async () => {
        let wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins}});

        expect(wrapper.find('#cms').classes()).toEqual([])

        await wrapper.find('.sidebar-close-button').trigger('click');

        expect(wrapper.find('#cms').classes()[0]).equals('open');

        await wrapper.vm.closeMenu();

        expect(wrapper.find('#cms').classes()[0]).equals(undefined);
    });

    it("test all mocked pages", async () => {
        const $route  = {params: {module: 'clients'}};
        const wrapper = mount(HomeIndex, {props: {}, global: {plugins: plugins, mocks: {$route}}});

        await flushPromises();

        expect(wrapper.find('.main').text()).contain('Add client');
    });
});
