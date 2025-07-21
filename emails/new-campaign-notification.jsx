import * as React from 'react';

export const NewCampaignNotification = ({ title, description, goalAmount }) => (
  <div>
    <h1>New Fundraising Campaign from ZHHF!</h1>
    <h2>{title}</h2>
    <p>{description}</p>
    <h3>
      Our Goal: ${goalAmount.toLocaleString()}
    </h3>
    <p>
      Your support can make a huge difference. Please consider donating on our
      website.
    </p>
    <br />
    <p>Best,</p>
    <p>The Zion Helping Hand Foundation Team</p>
  </div>
);