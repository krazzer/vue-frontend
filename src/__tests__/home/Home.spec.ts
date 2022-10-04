import {describe, it, expect} from "vitest";
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

        expect(wrapper.find('.main').text()).toContain("pages");
        expect(wrapper.find('.sidebar__menu li.selected a').text()).toContain("Pages");

        // change route
        wrapper.vm.$route = {params: {module: 'media'}}
        wrapper.vm.$options.watch.$route.call(wrapper.vm);

        await flushPromises();

        expect(wrapper.find('.main').text()).toContain("media");
    });
});
