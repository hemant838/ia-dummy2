export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch((err) => false);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    }
  }
}

export function getNestedValue(obj: any, path: string): any {
  return path
    .split('.')
    .reduce(
      (acc, key) => (acc && acc[key] != null ? acc[key] : undefined),
      obj
    );
}

export function getInitials(name: string = ''): string {
  if (!name) return '';

  const parts = name?.trim()?.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // Take first letter of first and last words
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}
