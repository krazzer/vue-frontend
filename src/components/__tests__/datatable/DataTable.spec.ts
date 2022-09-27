import { describe, it, expect } from "vitest";
import {mount, shallowMount} from "@vue/test-utils";
import DataTableIndex from "@/components/datatable/DataTable.vue";
import {Mocker} from "@/classes/mocker";
import flushPromises from 'flush-promises'

const mocker = new Mocker(0)
mocker.mock();

describe("DataTable", () => {
  it("renders properly", async () => {
    let settings = {
      addButtonLabel: 'New client',
      headers: ['id', 'name', 'address'],
      data: [
        [1, 'Some name', 'Some street 17'],
        [2, 'Some other name', 'Some other street'],
      ],
      instance: 'test',
    };

    const wrapper = await shallowMount(DataTableIndex, { props: {instance: 'test', settings: settings }});

    expect(wrapper.html()).toContain("<div class=\"datatable\"");
    expect(wrapper.findAll('tbody tr').length).toEqual(2);
    expect(wrapper.find('tbody tr:last-child td:last-child').text()).toEqual('Some other street');
  });

  it("Initializes properly", async () => {
    const wrapper = mount(DataTableIndex, { props: {instance: 'test' }});

    await flushPromises();

    expect(wrapper.findAll('tbody tr').length).toEqual(5);
    expect(wrapper.find('tbody tr:last-child td:last-child').text()).toEqual('56789');
  });

  it("Errors properly", async () => {
    mocker.mocker.reset();
    mocker.mocker.onGet('/api/datatable').networkError();

    const wrapper = mount(DataTableIndex, { props: {instance: 'test' }});

    await flushPromises();

    expect(wrapper.find('.datatable__error').text()).toEqual('Error: Network Error');
  });
});
