import React from 'react';
import {cleanup, render} from 'react-testing-library';
import {GlobalError} from './global-error.component';

afterAll(cleanup);

describe('ErrorBoundary component', () => {
    test('renders without crashing and render messages', () => {
        const {container, getByTestId} = render(
            <GlobalError error="Error Message" info={{componentStack: 'Detail Error'}}/>
        );

        expect(container).toBeTruthy();

        const info = getByTestId('error-info');
        const title = getByTestId('error-title');

        expect(info).toBeTruthy();
        expect(title).toBeTruthy();
        expect(document.querySelector('.subheadline')).toBeTruthy();
    });
});
