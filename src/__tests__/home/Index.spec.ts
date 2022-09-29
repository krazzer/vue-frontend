import {describe, it, expect} from "vitest";
import {shallowMount} from "@vue/test-utils";
import HomeIndex from "@/components/home/Index.vue";

describe("HomeIndex", () => {
    it("renders properly", () => {
        const wrapper = shallowMount(HomeIndex, {props: {}});
        expect(wrapper.text()).toContain("");
    });
});
