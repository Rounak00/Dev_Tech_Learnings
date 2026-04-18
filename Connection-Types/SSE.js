//Backend
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET'],
  credentials: false,
}));

app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders(); //  sends the HTTP response headers immediately to the client, without ending the response.

  let counter = 0;
  const intervalId = setInterval(() => {
    counter++;
    res.write(`data: ${JSON.stringify({ message: `Event ${counter}` })}\n\n`);
  }, 2000);

  req.on('close', () => {
    console.log('Client closed connection');
    clearInterval(intervalId);
  });
});

app.listen(PORT, () => {
  console.log(`SSE server running on http://localhost:${PORT}`);
});




//Frontend 
import React, { useEffect, useState } from 'react';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/events');

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setEvents((prev) => [...prev, parsedData.message]);
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Server-Sent Events</h2>
      <ul>
        {events.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
