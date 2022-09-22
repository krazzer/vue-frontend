import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeIndex from "@/components/home/Index.vue";

describe("HomeIndex", () => {
  it("renders properly", () => {
    const wrapper = mount(HomeIndex, { props: {} });
    expect(wrapper.text()).toContain("");
  });
});
