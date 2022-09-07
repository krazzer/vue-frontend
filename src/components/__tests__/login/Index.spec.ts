import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import LoginPage from "@/components/login/Index.vue";

describe("Login", () => {
  it("renders properly", () => {
    const wrapper = mount(LoginPage, { props: {} });
    expect(wrapper.text()).toContain("");
  });
});
