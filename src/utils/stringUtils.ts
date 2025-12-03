/**
 * Capitalizes the first letter of a string and lowercases the rest.
 * @param name The string to beautify
 * @returns The beautified string
 */
export function beautifyUsername(name: string): string {
    if (!name) return '';
    const lower = name.trim().toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}
