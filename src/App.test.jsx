import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the List component to simplify testing App's data handling
// and avoid needing to mock its internal structure.
vi.mock('./components/list', () => ({
  default: ({ data }) => (
    <ul data-testid="list-component">
      {data.length > 0 ? (
        data.map((item, index) => (
          <li key={index}>
            {item.name} - {item.capital || 'N/A'}
          </li>
        ))
      ) : (
        <li>No data</li>
      )}
    </ul>
  ),
}));

// Mock the global fetch function
// We'll reset this mock before each test to ensure test isolation
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks and reset their implementation before each test
    mockFetch.mockClear();

    // Set a default mock response for the initial 'provinces' fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: 'Ontario', capital: 'Toronto' },
          { name: 'Quebec', capital: 'Quebec City' },
        ]),
    });
  });

  it('renders the main heading and flag', async () => {
    render(<App />);

    // Check for static elements that are present on initial render
    expect(screen.getByText('Hello Canada')).toBeInTheDocument();
    expect(screen.getByAltText("Canada's Flag")).toBeInTheDocument();
  });

  it('initially fetches and displays provinces', async () => {
    render(<App />);

    // Expect fetch to have been called for provinces
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/provinces'
    );

    // Use findByText to wait for the asynchronous data to appear in the mocked List component
    await screen.findByText('Ontario - Toronto');
    expect(screen.getByText('Quebec - Quebec City')).toBeInTheDocument();
  });

  it('switches to territories data when "Territories" is clicked', async () => {
    render(<App />);

    // Wait for initial provinces data to load first (optional, but good practice
    // to ensure the component is ready before interaction)
    await screen.findByText('Ontario - Toronto');

    // Mock the response for the territories fetch call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: 'Yukon', capital: 'Whitehorse' },
          { name: 'Northwest Territories', capital: 'Yellowknife' },
        ]),
    });

    // Click the "Territories" menu item
    fireEvent.click(screen.getByText('Territories'));

    // Expect fetch to have been called a second time for territories
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/territories'
    );

    // Wait for the new territories data to appear
    await screen.findByText('Yukon - Whitehorse');
    expect(screen.getByText('Northwest Territories - Yellowknife')).toBeInTheDocument();

    // Assert that the old provinces data is no longer present
    expect(screen.queryByText('Ontario - Toronto')).not.toBeInTheDocument();
  });

  it('switches back to provinces data when "Provinces" is clicked', async () => {
    render(<App />);

    // 1. Load provinces initially
    await screen.findByText('Ontario - Toronto');

    // 2. Switch to territories
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ name: 'Nunavut', capital: 'Iqaluit' }]),
    });
    fireEvent.click(screen.getByText('Territories'));
    await screen.findByText('Nunavut - Iqaluit');
    expect(screen.queryByText('Ontario - Toronto')).not.toBeInTheDocument();

    // 3. Switch back to provinces
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { name: 'Alberta', capital: 'Edmonton' },
        { name: 'British Columbia', capital: 'Victoria' }
      ]),
    });
    fireEvent.click(screen.getByText('Provinces'));

    // Expect fetch to have been called a third time for provinces
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/provinces'
    );

    // Wait for the new provinces data to appear
    await screen.findByText('Alberta - Edmonton');
    expect(screen.getByText('British Columbia - Victoria')).toBeInTheDocument();
    expect(screen.queryByText('Nunavut - Iqaluit')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully (optional, but good practice)', async () => {
    // Mock a failed fetch response
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<App />);

    // You might want to display an error message in your UI in a real app.
    // For this example, we'll just ensure fetch was called and no data appeared.
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://my-json-server.typicode.com/simonachkar/demo-canada-api-server/provinces'
    );

    // Check that no data items are rendered, and the mocked List component
    // shows its "No data" state.
    await screen.findByText('No data');
    expect(screen.queryByText('Ontario - Toronto')).not.toBeInTheDocument();
  });
});