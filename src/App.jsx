import React from 'react';
import { useQuery } from 'react-query';
import './index.css';

const fetchContributionsData = async () => {
  const response = await fetch('https://dpg.gg/test/calendar.json');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

function App() {
  const { data, isLoading, isError } = useQuery(
    'contributions',
    fetchContributionsData,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }
}
export default App;
