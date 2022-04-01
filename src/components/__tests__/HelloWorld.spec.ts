import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import LoginPage from "../LoginPage.vue";

describe("Login", () => {
  it("renders properly", () => {
    const wrapper = mount(LoginPage, { props: { msg: "Hello Vitest" } });
    expect(wrapper.text()).toContain("Hello Vitest");
  });
});
