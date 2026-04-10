export type AlertChannel = 'slack' | 'teams' | 'email';

export interface AlertConfig {
  id: string;
  orgId: string;
  channel: AlertChannel;
  destination: string;
  name: string;
  enabled: boolean;
  events: AlertEvent[];
}

export type AlertEvent = 
  | 'dashboard_created'
  | 'dashboard_updated'
  | 'chart_created'
  | 'data_imported'
  | 'payment_received'
  | 'anomaly_detected'
  | 'threshold_exceeded';

export interface AlertPayload {
  event: AlertEvent;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface SlackMessage {
  channel?: string;
  text: string;
  blocks?: SlackBlock[];
}

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  elements?: Array<{ type: string; text?: { type: string; text: string } }>;
}

export async function sendSlackAlert(config: AlertConfig, payload: AlertPayload): Promise<{ success: boolean; error?: string }> {
  if (config.channel !== 'slack') {
    return { success: false, error: 'Invalid channel' };
  }

  const message: SlackMessage = {
    text: `${payload.title}: ${payload.message}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: payload.title },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: payload.message },
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: { type: 'mrkdwn', text: `*Event:* ${payload.event}` } },
          { type: 'mrkdwn', text: { type: 'mrkdwn', text: `*Time:* ${payload.timestamp}` } },
        ],
      },
    ],
  };

  try {
    const response = await fetch(config.destination, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return { success: response.ok };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function sendTeamsAlert(config: AlertConfig, payload: AlertPayload): Promise<{ success: boolean; error?: string }> {
  if (config.channel !== 'teams') {
    return { success: false, error: 'Invalid channel' };
  }

  const teamsPayload = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    summary: payload.title,
    themeColor: '0076D7',
    title: payload.title,
    text: payload.message,
    sections: [
      {
        facts: [
          { name: 'Event', value: payload.event },
          { name: 'Time', value: payload.timestamp },
        ],
      },
    ],
  };

  try {
    const response = await fetch(config.destination, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamsPayload),
    });

    return { success: response.ok };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function sendAlert(config: AlertConfig, payload: AlertPayload): Promise<{ success: boolean; error?: string }> {
  if (!config.enabled) {
    return { success: false, error: 'Alert disabled' };
  }

  if (!config.events.includes(payload.event)) {
    return { success: false, error: 'Event not subscribed' };
  }

  switch (config.channel) {
    case 'slack':
      return sendSlackAlert(config, payload);
    case 'teams':
      return sendTeamsAlert(config, payload);
    default:
      return { success: false, error: 'Unsupported channel' };
  }
}

export function createAlertConfig(
  orgId: string,
  channel: AlertChannel,
  destination: string,
  name: string,
  events: AlertEvent[]
): AlertConfig {
  return {
    id: crypto.randomUUID(),
    orgId,
    channel,
    destination,
    name,
    enabled: true,
    events,
  };
}

export function validateAlertConfig(config: Partial<AlertConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.channel) {
    errors.push('Channel is required');
  }

  if (!config.destination) {
    errors.push('Destination URL is required');
  }

  if (!config.events || config.events.length === 0) {
    errors.push('At least one event is required');
  }

  return { valid: errors.length === 0, errors };
}

export function getEventLabel(event: AlertEvent): string {
  const labels: Record<AlertEvent, string> = {
    dashboard_created: 'Dashboard Created',
    dashboard_updated: 'Dashboard Updated',
    chart_created: 'Chart Created',
    data_imported: 'Data Imported',
    payment_received: 'Payment Received',
    anomaly_detected: 'Anomaly Detected',
    threshold_exceeded: 'Threshold Exceeded',
  };
  return labels[event];
}
