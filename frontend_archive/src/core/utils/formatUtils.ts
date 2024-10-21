export const getFormattedDateTime = (): string => {
  const date = new Date(); // Assuming UTC time

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long'
  };

  return `${formattedTime} GMT on ${date.getDate()} ${new Intl.DateTimeFormat('en-US', dateOptions).format(date)} ${date.getFullYear()}`;
};

export const removeDigitsUntilLastOccurrence: (str: string) => string = (str) => {
  // Find the index of the last occurrence of a digit
  const lastDigitIndex = str.search(/\d(?!.*\d)/);

  if (lastDigitIndex !== -1) {
    // Remove digits from the last occurrence onwards
    return removeDigitsUntilLastOccurrence(str.substring(0, lastDigitIndex));
  } else {
    // No digits found, return the original string
    return str;
  }
}