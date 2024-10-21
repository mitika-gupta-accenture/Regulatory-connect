
export default function isArray(value) {
    return typeof value == 'object' && value.constructor === Array;
  }

