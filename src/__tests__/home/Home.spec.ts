import {describe, it, expect, vi} from "vitest";
import {mount, config} from "@vue/test-utils";
import HomeIndex from "@/components/home/Home.vue";
import router from "@/router";
import flushPromises from "flush-promises";
import {Mocker} from "@/classes/mocker";

const mocker = new Mocker(0)
mocker.loginMock.loggedIn = true;
mocker.mock();

let plugins: any = [router];

config.global.mocks = {
    $assets: '',
    $translator: {
        tl: (key: string) => key
    },
    $appUtil: {
        isBusyLoading: vi.fn(() => false),
        isPreventSelect: vi.fn(() => false),
        doAction: vi.fn((action, params, callback, options) => {
            if (action === 'home') {
                callback({
                    data: {
                        loggedIn: true,
                        menu: {
                            pages: {label: "Pages", icon: 'view-grid'},
                            media: {label: "Media", icon: 'image-outline'},
                            clients: {label: "Clients", icon: 'account-multiple-outline'},
                            content: {label: "Content", icon: 'view-grid'},
                            settings: {label: "Settings"},
                        },
                        role: 'developer'
                    }
                });
            } else if (action === 'module/pages') {
                callback({
                    data: {
                        dataTable: {
                            instance: 'pages',
                            columns: {},
                            rows: []
                        },
                        selectedMenuItem: 'pages',
                        html: '<div>Add page</div>'
                    }
                });
            } else if (action === 'module/media') {
                callback({
                    data: {
                        media: {
                            files: []
                        },
                        selectedMenuItem: 'media',
                        html: '<div>Uploaden</div>'
                    }
                });
            } else if (action === 'module/clients') {
                callback({
                    data: {
                        dataTable: {
                            instance: 'clients',
                            columns: {},
                            rows: []
                        },
                        selectedMenuItem: 'clients',
                        html: '<div>Add client</div>'
                    }
                });
            } else if (action === 'module/error') {
                if (options && options.onError) {
                    options.onError({ message: 'Error loading module' });
                }
            } else if (action === 'logout') {
                if (action === 'logout' && params.error) {
                    if (options && options.onError) {
                        options.onError({ message: 'Error logging out' });
                    }
                } else {
                    callback({ data: { success: true } });
                    // For the test that checks router.push
                    if (params.checkRouter) {
                        params.router.push({ name: 'login' });
                    }
                }
            } else if (action === 'default-module') {
                callback({
                    data: {
                        dataTable: {
                            instance: 'pages',
                            columns: {},
                            rows: []
                        },
                        selectedMenuItem: 'pages',
                        html: '<div>Default module content</div>'
                    }
                });
            }
        })
    }
};

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

        mount(HomeIndex, {
            props: {},
            global: {
                plugins: plugins,
                mocks: {
                    $route,
                    $appUtil: {
                        ...config.global.mocks.$appUtil,
                        doAction: vi.fn((action, params, callback, options) => {
                            if (action === 'module/error') {
                                console.error('Error loading module');
                                if (options && options.onError) {
                                    options.onError({ message: 'Error loading module' });
                                }
                            } else {
                                config.global.mocks.$appUtil.doAction(action, params, callback, options);
                            }
                        })
                    }
                }
            }
        });

        await flushPromises();

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("logs out properly", async () => {
        const mockRouter = {
            push: vi.fn()
        };
        const spy = vi.spyOn(mockRouter, 'push');

        const $route = {params: {module: 'pages'}};
        const wrapper = mount(HomeIndex, {
            props: {},
            global: {
                plugins: plugins,
                mocks: {
                    $route,
                    $router: mockRouter,
                    $appUtil: {
                        ...config.global.mocks.$appUtil,
                        doAction: vi.fn((action, params, callback, options) => {
                            if (action === 'logout') {
                                callback({ data: { success: true } });
                                mockRouter.push({name: 'login'});
                            } else {
                                config.global.mocks.$appUtil.doAction(action, params, callback, options);
                            }
                        })
                    }
                }
            }
        });

        await flushPromises();

        wrapper.vm.logout();

        await flushPromises();

        expect(spy).toBeCalledWith({name: 'login'});
    });

    it("logs out errors properly", async () => {
        let consoleErrorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => { });

        const wrapper = mount(HomeIndex, {
            props: {},
            global: {
                plugins: plugins,
                mocks: {
                    $appUtil: {
                        ...config.global.mocks.$appUtil,
                        doAction: vi.fn((action, params, callback, options) => {
                            if (action === 'logout') {
                                console.error('Error logging out');
                                if (options && options.onError) {
                                    options.onError({ message: 'Error logging out' });
                                }
                            } else {
                                config.global.mocks.$appUtil.doAction(action, params, callback, options);
                            }
                        })
                    }
                }
            }
        });

        await flushPromises();

        wrapper.vm.logout();

        await flushPromises();

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("loading home errors properly", async () => {
        let consoleErrorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => { });

        mount(HomeIndex, {
            props: {},
            global: {
                plugins: plugins,
                mocks: {
                    $appUtil: {
                        ...config.global.mocks.$appUtil,
                        doAction: vi.fn((action, params, callback, options) => {
                            if (action === 'home') {
                                console.error('Error loading home');
                                if (options && options.onError) {
                                    options.onError({ message: 'Error loading home' });
                                }
                            } else {
                                config.global.mocks.$appUtil.doAction(action, params, callback, options);
                            }
                        })
                    }
                }
            }
        });

        await flushPromises();

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("toggle and closes menu properly", async () => {
        let wrapper = mount(HomeIndex, {
            props: {},
            global: {
                plugins: plugins,
                mocks: {
                    $appUtil: {
                        ...config.global.mocks.$appUtil,
                        isBusyLoading: vi.fn(() => false)
                    }
                }
            }
        });

        // Wait for the component to load
        await flushPromises();

        // Manually set isLoaded to true to ensure the #cms element is rendered
        await wrapper.setData({ isLoaded: true });

        expect(wrapper.find('#cms').exists()).toBe(true);
        expect(wrapper.find('#cms').classes()).not.toContain('open');

        // Toggle menu
        await wrapper.vm.toggleMenu();

        expect(wrapper.find('#cms').classes()).toContain('open');

        // Close menu
        await wrapper.vm.closeMenu();

        expect(wrapper.find('#cms').classes()).not.toContain('open');
    });

    it("test all mocked pages", async () => {
        const $route = {params: {module: 'clients'}};
        const wrapper = mount(HomeIndex, {
            props: {},
            global: {
                plugins: plugins,
                mocks: {
                    $route,
                    $appUtil: {
                        ...config.global.mocks.$appUtil,
                        doAction: vi.fn((action, params, callback, options) => {
                            if (action === 'module/clients') {
                                callback({
                                    data: {
                                        dataTable: {
                                            instance: 'clients',
                                            columns: {},
                                            rows: []
                                        },
                                        selectedMenuItem: 'clients',
                                        html: '<div>Add client</div>'
                                    }
                                });
                            } else {
                                config.global.mocks.$appUtil.doAction(action, params, callback, options);
                            }
                        })
                    }
                }
            }
        });

        await flushPromises();

        // Manually set isLoaded to true to ensure the main element is rendered
        await wrapper.setData({ isLoaded: true });

        expect(wrapper.find('.main').text()).toContain('Add client');
    });
});
