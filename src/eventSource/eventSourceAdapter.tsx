import React, { useContext, useEffect } from 'react';
import { eventSourceSpecs } from 'src/config';
import infoLogger from 'src/utilities/logger';
import { actions, AppState } from 'src/app/Store';

let eventSource: EventSource | null = null;

const EventSourceAdapter: React.FC = ({ children }) => {
  const { state, dispatch } = useContext<ContextProvider>(AppState);
  const { selectedMoa, totalPositionsExpected, positionsList } = state;

  const connect = () => {
    // Disconnect if stream is already open
    if (eventSource !== null && eventSource.readyState === 1) {
      disconnectFromEventSource(true);
      dispatch({
        type: actions.RESET_ALL,
      });
    }

    // Initiate connection to eventSource stream
    const streamUrl = `${eventSourceSpecs.connectEndpoint}${selectedMoa}`;
    try {
      infoLogger(
        `Establishing connection to EventSource endpoint ${streamUrl}`
      );
      dispatch({
        type: actions.RESET_ALL,
      });
      eventSource = new EventSource(streamUrl);
    } catch (error) {
      infoLogger('Connection failed, ', error);
      disconnectFromEventSource(false);
    }
  };

  useEffect(() => {
    connect();

    // Listen for eventSource stream events and handle accordingly
    if (eventSource) {
      eventSource.addEventListener('open', () => {
        infoLogger('EventSource connection established');
      });

      eventSource.addEventListener('message', (event: MessageEvent) =>
        handleIncomingMessage(event)
      );

      eventSource.addEventListener('userPosition', (event: Event) => {
        handleIncomingPosition(event);
      });

      eventSource.addEventListener('error', (event: Event) => {
        disconnectFromEventSource(false);
      });
    }
  }, [selectedMoa]);

  const handleIncomingMessage = (message: any) => {
    const parsedMessageData = JSON.parse(message.data);
    infoLogger('Received message', parsedMessageData);
    if (parsedMessageData.key === 'positionsScanComplete') {
      dispatch({
        type: actions.SET_TOTAL_POSITIONS_EXPECTED,
        payload: parsedMessageData.totalPositions,
      });
    }
  };

  const handleIncomingPosition = (message: any) => {
    const parsedMessageData = JSON.parse(message.data);
    if (Object.keys(parsedMessageData.LP).length !== 0) {
      infoLogger('Received userPosition', parsedMessageData);
      dispatch({
        type: actions.SAVE_POSITION_TO_STREAM_LIST,
        payload: parsedMessageData.LP,
      });
    }
  };

  const disconnectFromEventSource = (disconnectIntentionally?: boolean) => {
    if (disconnectIntentionally) {
      infoLogger(
        'Positions streaming completed, disconnected from eventSource intentionally'
      );
      eventSource && eventSource.close();
      eventSource = null;
    } else {
      eventSource && eventSource.close();
      eventSource = null;
      infoLogger(
        'Connection timed out or closed, disconnected from eventSource unexpectedly'
      );
      setTimeout(() => {
        infoLogger('Attempting to reconnect');
        connect();
      }, eventSourceSpecs.reconnectInterval);
    }
  };

  // Check if all expected positions have finished streaming and disconnect intentionally
  if (
    totalPositionsExpected !== 0 &&
    positionsList.length === totalPositionsExpected
  ) {
    disconnectFromEventSource(true);
  }

  return <>{children}</>;
};

export default EventSourceAdapter;
