import {describe, it, expect} from "vitest";
import { mount } from "@vue/test-utils";
import Login from "@/components/login/Index.vue";
import { plugin, defaultConfig } from '@formkit/vue'

describe("Login", () => {
  it("renders properly", () => {
    const wrapper = mount(Login, {global: { plugins: [[plugin, defaultConfig]] }});
    expect(wrapper.html()).toContain("<form");
  });
});
