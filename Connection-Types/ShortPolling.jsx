import React, { useEffect, useState } from 'react';

const ShortPollingComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('https://example.com/api/messages')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Server error');
          }
          return response.json();
        })
        .then((json) => {
          setData(json);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        });
    };

    // Fetch immediately and then start polling
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Short Polling Example</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShortPollingComponent;
