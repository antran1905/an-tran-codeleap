import axios from 'axios';

interface QueryErrorMessageOptions {
  error: unknown;
  fallbackMessage: string;
}

interface QueryErrorMessage {
  message: string;
  details: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toCleanString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  return trimmed;
}

function getApiMessage(data: unknown): string | null {
  const dataString = toCleanString(data);

  if (dataString) {
    return dataString;
  }

  if (!isRecord(data)) {
    return null;
  }

  const messageValue = toCleanString(data.message);

  if (messageValue) {
    return messageValue;
  }

  const errorValue = toCleanString(data.error);

  if (errorValue) {
    return errorValue;
  }

  if (!Array.isArray(data.errors)) {
    return null;
  }

  for (const errorItem of data.errors) {
    const errorText = toCleanString(errorItem);

    if (errorText) {
      return errorText;
    }
  }

  return null;
}

export function toQueryErrorMessage(options: QueryErrorMessageOptions): QueryErrorMessage {
  const fallbackDetails = 'Please try again in a moment.';

  if (axios.isAxiosError(options.error)) {
    const statusCode = options.error.response?.status;
    const apiMessage = getApiMessage(options.error.response?.data);

    if (statusCode === 401 || statusCode === 403) {
      return {
        message: options.fallbackMessage,
        details: 'Access to this data is unavailable right now. Please try again later.',
      };
    }

    if (statusCode === 404) {
      return {
        message: options.fallbackMessage,
        details: 'The requested data could not be found.',
      };
    }

    if (statusCode === 408 || statusCode === 504) {
      return {
        message: options.fallbackMessage,
        details: 'The request took too long. Please check your connection and retry.',
      };
    }

    if (statusCode === 429) {
      return {
        message: options.fallbackMessage,
        details: 'You are going too fast. Please wait a moment before retrying.',
      };
    }

    if (typeof statusCode === 'number' && statusCode >= 500) {
      return {
        message: options.fallbackMessage,
        details: 'The dog service is having trouble right now. Please try again shortly.',
      };
    }

    if (apiMessage) {
      return {
        message: options.fallbackMessage,
        details: apiMessage,
      };
    }

    if (!options.error.response) {
      return {
        message: options.fallbackMessage,
        details: 'Unable to reach the dog service. Please check your connection and retry.',
      };
    }

    return {
      message: options.fallbackMessage,
      details: fallbackDetails,
    };
  }

  if (options.error instanceof Error) {
    const rawMessage = toCleanString(options.error.message);

    if (rawMessage && rawMessage.length <= 140) {
      return {
        message: options.fallbackMessage,
        details: rawMessage,
      };
    }
  }

  return {
    message: options.fallbackMessage,
    details: fallbackDetails,
  };
}
