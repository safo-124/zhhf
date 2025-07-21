import * as React from 'react';

export const NewEventNotification = ({ title, description }) => (
  <div>
    <h1>New Event Announcement from ZHHF!</h1>
    <h2>{title}</h2>
    <p>{description}</p>
    <p>Visit our website to learn more.</p>
    <br />
    <p>Best,</p>
    <p>The Zion Helping Hand Foundation Team</p>
  </div>
);