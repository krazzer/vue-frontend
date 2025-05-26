# Component Testing Guide

This document provides instructions on how to run and modify the tests for various components in the KikCMS2 project.

## Table of Contents
- [Running the Tests](#running-the-tests)
- [Understanding the Test Structure](#understanding-the-test-structure)
- [Component-Specific Test Cases](#component-specific-test-cases)
  - [Login Component](#login-component)
  - [Home Component](#home-component)
  - [DataTable Component](#datatable-component)
  - [Form Component](#form-component)
- [Modifying the Tests](#modifying-the-tests)
- [Testing Best Practices](#testing-best-practices)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Running the Tests

### Running All Unit Tests

To run all unit tests in the project:

```bash
npm run test:unit
```

### Running Component-Specific Tests

To run tests for specific components:

```bash
# Login component
npm run test:unit -- -t "Login"

# Home component
npm run test:unit:home

# DataTable component
npm run test:unit -- -t "DataTable"

# Form component
npm run test:unit -- -t "Form"
```

### Other Test Commands

```bash
# Run tests in watch mode (will not exit automatically)
npm run test:unit:watch

# Run tests with coverage reporting
npm run test:unit:coverage
```

## Understanding the Test Structure

All component test files follow a similar structure:

1. **Imports and Setup**: Imports necessary testing libraries and sets up the test environment.
2. **Mock Configuration**: Sets up mocks for API responses and Vue components.
3. **Test Cases**: Individual test cases for different aspects of the component.

Test files are located in the `/src/__tests__/` directory, organized by component:
- Login: `/src/__tests__/login/Index.spec.ts`
- Home: `/src/__tests__/home/Home.spec.ts`
- DataTable: `/src/__tests__/datatable/DataTable.spec.ts`
- Form: `/src/__tests__/form/Form.spec.ts`

## Component-Specific Test Cases

### Login Component

The Login component tests (`/src/__tests__/login/Index.spec.ts`) include:

1. **Renders properly**: Verifies that the component renders correctly with all expected elements.
2. **Validates form inputs**: Tests the form validation logic.
3. **Logins properly**: Tests successful login functionality.
4. **Handles remember me checkbox**: Tests the remember me checkbox functionality.
5. **Errors properly with wrong password**: Tests error handling for incorrect credentials.
6. **Errors properly**: Tests various error scenarios (503 error, network error, timeout).
7. **Navigates to password lost page**: Tests the password lost link.
8. **Does not attempt login when form is invalid**: Tests that login is not attempted when the form is invalid.

#### Mocking Login API Responses

The login component tests use a mock defined in `/src/components/login/classes/mock.ts`. To add a new error case:

```typescript
if (params.password === 'your-error-case') {
    return [your-error-code];
}
```

### Home Component

The Home component tests (`/src/__tests__/home/Home.spec.ts`) include:

1. **Renders properly**: Verifies that the component renders correctly with all expected elements.
2. **Errors properly**: Tests error handling when loading a module that returns an error.
3. **Logs out properly**: Tests successful logout functionality.
4. **Logs out errors properly**: Tests error handling during logout.
5. **Loading home errors properly**: Tests error handling when loading the home page.
6. **Toggle and closes menu properly**: Tests the menu toggle and close functionality.
7. **Test all mocked pages**: Tests loading different modules.

#### Mocking Home API Responses

The Home component tests use a mock defined in `/src/components/home/classes/mock.ts`. To add a new module:

```typescript
let paramsFor: any = {
    'new-module': {dataTable: newModuleData},
    // existing modules...
};
```

### DataTable Component

The DataTable component tests (`/src/__tests__/datatable/DataTable.spec.ts`) include:

1. **Renders properly**: Verifies that the component renders correctly with all expected elements.
2. **Initializes properly**: Tests the initialization of the component with default settings.
3. **Errors properly**: Tests error handling when loading data fails.

#### Mocking DataTable API Responses

The DataTable component tests use a mock defined in `/src/components/datatable/classes/mock.ts`. Modify the `mock` method to handle new test cases or modify existing ones.

### Form Component

The Form component tests (`/src/__tests__/form/Form.spec.ts`) include:

1. **formatDate formats dates correctly**: Tests the date formatting functionality.
2. **fieldHasError detects validation errors**: Tests the validation error detection.
3. **hasDarkModeField detects dark mode fields**: Tests the detection of dark mode fields.
4. **showLabel identifies fields that should show labels**: Tests the label visibility logic.
5. **getFieldProperties returns correct properties for different field types**: Tests the field properties generation for various field types.
6. **initTinyMCE returns correct configuration**: Tests the TinyMCE editor configuration.

#### Testing Approach for Form Component

The Form component tests use a different approach compared to other components. Instead of rendering the component and testing its behavior through the DOM, the tests directly test the component's methods. This approach is more reliable and less prone to issues with Vue's reactivity system and Vuetify dependencies.

To test a method directly:

```typescript
// First, extract methods from the component
const methods = (Form as any).methods || {};

it("methodName does something", () => {
    // Create a mock instance with just the method you want to test
    const formComponent = {
        methodName: methods.methodName,
        // Add any dependencies the method needs
        dependency: mockDependency
    };

    // Call the method and test the result
    const result = formComponent.methodName(args);
    expect(result).toBe(expectedValue);
});
```

#### Mocking Form API Responses

The Form component tests use a mock defined in `/src/components/form/classes/mock.ts`. The mock is quite simple, only handling the form save endpoint:

```
mock(mocker: MockAdapter) {
    mocker.onPost("/api/form/save").reply(() => {
        return [200];
    });
}
```

## Modifying the Tests

### Adding New Test Cases

To add a new test case, add a new `it` block to the test file:

```typescript
it("Your test description", async () => {
    // Your test code here
    // ...
    expect(/* your assertion */).toBe(/* expected value */);
});
```

### Modifying Existing Test Cases

To modify an existing test case, locate the relevant `it` block in the test file and update the code as needed.

## Testing Best Practices

1. **Isolate Tests**: Each test should test one specific aspect of the component.
2. **Use Descriptive Names**: Test names should clearly describe what is being tested.
3. **Test Edge Cases**: Include tests for error conditions and edge cases.
4. **Keep Tests Simple**: Tests should be simple and easy to understand.
5. **Use Mocks**: Use mocks to isolate the component from external dependencies.

## Troubleshooting

If you encounter issues with the tests:

1. **Check the Console**: Look for error messages in the console.
2. **Check the Mock Configuration**: Ensure that the mock is configured correctly.
3. **Check the Component**: Ensure that the component is implemented correctly.
4. **Check the Test Environment**: Ensure that the test environment is set up correctly.
5. **Check for Circular Dependencies**: Ensure there are no circular dependencies between files.

### Common Issues and Solutions

#### Vue Compiler Issues

If you see errors like "Codegen node is missing for element/if/for node. Apply appropriate transforms first", check the Vue compiler configuration in `vite.config.ts`. Make sure that Vuetify components are not being treated as custom elements during tests.

```javascript
// Correct configuration
isCustomElement: (tag) => tag.includes('kikcms-')

// Problematic configuration
isCustomElement: (tag) => tag.includes('kikcms-') || (process.env.VITEST ? tag.includes('v-') : false)
```

#### Missing Mocks

If you see errors about properties being accessed during render but not defined on the instance, make sure you've properly mocked all the global properties used by the component:

- All components need: `$translator`, `$appUtil`
- Some components also need: `$router` (for navigation tests)

#### Testing Vuetify Components

When testing Vuetify components, remember that they are rendered as standard HTML elements. Instead of looking for Vuetify component tags like `v-btn`, look for the corresponding HTML elements:

```javascript
// Instead of this
expect(wrapper.find('v-btn').exists()).toBe(true);

// Use this
expect(wrapper.find('button').exists()).toBe(true);
```

#### Circular Dependencies

If you see errors like "Cannot access '__vite_ssr_export_default__' before initialization", it's likely due to circular dependencies between files. This happens when two or more files import each other, directly or indirectly.

To fix circular dependencies:

1. Identify the circular dependency chain by examining the import statements in the files mentioned in the error stack trace.
2. Break the circular dependency by:
   - Using interfaces instead of direct imports for types
   - Restructuring your code to avoid the circular dependency
   - Using dependency injection instead of direct imports

Example of replacing a direct import with an interface:

```typescript
// Instead of this
import { SomeClass } from './some-file';
class MyClass {
    dependency: SomeClass;
}

// Use this
interface SomeInterface {
    // Define the methods and properties you need
    someMethod(): void;
}
class MyClass {
    dependency: SomeInterface;
}
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Vuetify Testing Guide](https://vuetifyjs.com/en/getting-started/unit-testing/)
