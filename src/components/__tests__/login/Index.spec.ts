import {describe, it, expect} from "vitest";
import { mount } from "@vue/test-utils";
import Login from "@/components/login/Index.vue";
import { plugin, defaultConfig } from '@formkit/vue'

describe("Login", () => {
  it("Renders properly", () => {
    const wrapper = mount(Login, {global: { plugins: [[plugin, defaultConfig]] }});
    expect(wrapper.html()).toContain("<form");
  });

  it("Logins properly", async () => {
    const wrapper = mount(Login, {global: { plugins: [[plugin, defaultConfig]] }});

    let form = wrapper.find('form');

    await form.find('input[name="email"]').setValue('test@test.com');
    await form.find('input[name="password"]').setValue('test');

    await form.trigger('submit');

    expect(wrapper.find('.sidebar').exists()).toBeTruthy();
  });
});
