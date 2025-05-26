import {describe, it, expect, vi} from "vitest";
import Form from "@/components/form/Form.vue";
import {Mocker} from "@/classes/mocker";

// Extract methods from Form component for direct testing
// For Vue 3 components defined with defineComponent
const methods = (Form as any).methods || {};

// Initialize the mocker
const mocker = new Mocker(0);
mocker.mock();

describe("Form Component", () => {
    // Test the Form component's methods directly

    it("formatDate formats dates correctly", () => {
        // Create a mock instance of the Form component
        const formComponent = {
            formatDate: methods.formatDate
        };

        // Test with various date formats
        expect(formComponent.formatDate('2023-01-01')).toBe('01/01/2023');
        expect(formComponent.formatDate('2023-12-31')).toBe('12/31/2023');
        expect(formComponent.formatDate(null)).toBe('');
        expect(formComponent.formatDate(undefined)).toBe('');
    });

    it("fieldHasError detects validation errors", async () => {
        // Create a mock field with validation
        const field = {
            validate: vi.fn().mockResolvedValue(['Error message'])
        };

        // Create a mock instance of the Form component
        const formComponent = {
            fieldHasError: methods.fieldHasError
        };

        // Test with a field that has an error
        expect(await formComponent.fieldHasError(field)).toBe(true);

        // Test with a field that has no errors
        field.validate.mockResolvedValue([]);
        expect(await formComponent.fieldHasError(field)).toBe(false);
    });

    it("hasDarkModeField detects dark mode fields", () => {
        // Create a mock instance of the Form component
        const formComponent = {
            fields: {
                darkmode: {
                    special: 'darkModeSelect'
                }
            },
            hasDarkModeField: methods.hasDarkModeField
        };

        // Test with a form that has a dark mode field
        expect(formComponent.hasDarkModeField()).toBe(true);

        // Test with a form that doesn't have a dark mode field
        formComponent.fields = <any> {
            name: {
                type: 'text'
            }
        };
        expect(formComponent.hasDarkModeField()).toBe(false);

        // Test with no fields
        formComponent.fields = <any> null;
        expect(formComponent.hasDarkModeField()).toBe(false);
    });

    it("showLabel identifies fields that should show labels", () => {
        // Create a mock instance of the Form component
        const formComponent = {
            showLabel: methods.showLabel
        };

        // Test with fields that should show labels
        expect(formComponent.showLabel({ type: 'richtext' })).toBe(true);
        expect(formComponent.showLabel({ type: 'filepicker' })).toBe(true);
        expect(formComponent.showLabel({ type: 'label' })).toBe(true);

        // Test with fields that shouldn't show labels
        expect(formComponent.showLabel({ type: 'text' })).toBe(false);
        expect(formComponent.showLabel({ type: 'textarea' })).toBe(false);
        expect(formComponent.showLabel({ type: 'select' })).toBe(false);
    });

    it("getFieldProperties returns correct properties for different field types", () => {
        // Create a mock instance of the Form component
        const formComponent = {
            getFieldProperties: methods.getFieldProperties,
            initTinyMCE: vi.fn(() => ({ plugins: 'test' })),
            tinyMCEApiKey: vi.fn(() => 'test-key'),
            helperData: { field1: { data: 'helper data' } },
            $validator: {
                get: vi.fn(() => ['validation rule'])
            }
        };

        // Test with a text field
        const textField = {
            type: 'text',
            label: 'Text Field',
            key: 'field1',
            hint: 'This is a hint',
            validator: { name: 'presence', parameters: {} }
        };

        const textProps = formComponent.getFieldProperties(textField);
        expect(textProps.label).toBe('Text Field');
        expect(textProps.hint).toBe('This is a hint');
        expect(textProps.helperData).toEqual({ data: 'helper data' });
        expect(textProps.validateOn).toBe('blur lazy');
        expect(textProps.rules).toEqual(['validation rule']);
        expect(textProps.hideDetails).toBe('auto');

        // Test with a password field
        const passwordField = {
            type: 'password',
            label: 'Password',
            key: 'password'
        };

        const passwordProps = formComponent.getFieldProperties(passwordField);
        expect(passwordProps.autocomplete).toBe('new-password');

        // Test with a richtext field
        const richtextField = {
            type: 'richtext',
            label: 'Rich Text',
            key: 'content'
        };

        const richtextProps = formComponent.getFieldProperties(richtextField);
        expect(richtextProps.init).toEqual({ plugins: 'test' });
        expect(richtextProps.apiKey).toBe('test-key');

        // Test with a select field with object items
        const selectField = {
            type: 'select',
            label: 'Select',
            key: 'select',
            items: { '1': 'Option 1', '2': 'Option 2' }
        };

        const selectProps = formComponent.getFieldProperties(selectField);
        expect(selectProps.items).toEqual([
            { key: '1', value: 'Option 1' },
            { key: '2', value: 'Option 2' }
        ]);
        expect(selectProps.itemValue).toBe('key');
        expect(selectProps.itemTitle).toBe('value');

        // Test with an autocomplete field with array items and multiple selection
        const autocompleteField = {
            type: 'autocomplete',
            label: 'Autocomplete',
            key: 'tags',
            multiple: true,
            items: [
                { key: '1', value: 'Tag 1' },
                { key: '2', value: 'Tag 2' }
            ]
        };

        const autocompleteProps = formComponent.getFieldProperties(autocompleteField);
        expect(autocompleteProps.multiple).toBe(true);
        expect(autocompleteProps.items).toEqual([
            { key: '1', value: 'Tag 1' },
            { key: '2', value: 'Tag 2' }
        ]);
    });

    it("initTinyMCE returns correct configuration", () => {
        // Create a mock instance of the Form component
        const formComponent = {
            initTinyMCE: methods.initTinyMCE,
            darkMode: false,
            $emit: vi.fn()
        };

        // Test with dark mode off
        const config = formComponent.initTinyMCE();
        expect(config.plugins).toBe('lists link image table code help wordcount');
        expect(config.skin_url).toBe(null);
        expect(config.content_css).toBe(null);

        // Test with dark mode on
        formComponent.darkMode = true;
        const darkConfig = formComponent.initTinyMCE();
        expect(darkConfig.skin_url).toBe('/cms/tinymceskin');
        expect(darkConfig.content_css).toBe('/cms/tinymceskin/editor.min.css');

        // Test the setup function
        const editor = {
            on: vi.fn((event, callback) => {
                if (event === 'keydown') {
                    // Simulate Ctrl+S keydown
                    callback({ metaKey: true, key: 's', preventDefault: vi.fn() });
                }
            })
        };

        darkConfig.setup(editor);
        expect(formComponent.$emit).toHaveBeenCalledWith('doSubmit', true);
    });
});
