import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import NavBar from "../NavBar";

describe('NavBar Component', () => {
  it('should render correctly with all links', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(getByRole('link', { name: 'Weather' })).toBeInTheDocument();
  });
});
