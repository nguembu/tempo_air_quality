const date = new Date('2025-10-05T10:00:00');

const options: Intl.DateTimeFormatOptions = {
  month: 'short',      // "Oct"
  day: 'numeric',      // "5"
  year: 'numeric',     // "2025"
  hour: 'numeric',     // "10"
  minute: '2-digit',   // "00"
  hour12: true,        // AM/PM
};

const formatted = new Intl.DateTimeFormat('en-US', options).format(date);

// Add the pipe separator manually
const [datePart, timePart] = formatted.split(', '); 
const final = `${datePart}, ${timePart.split(', ')[1]} | ${timePart.split(', ')[0]}`;

console.log(final); // Oct 5, 2025 | 10:00 AM
