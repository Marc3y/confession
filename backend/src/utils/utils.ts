export function generateUUID(uuidLength:number): string {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let uuid = '';
    for (let i = 0; i < uuidLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uuid += characters[randomIndex];
    }
    return uuid;
}

export function getCurrentTimeStr(): string {
    const jetzt = new Date();
    const tag = jetzt.getDate().toString().padStart(2, '0');
    const monat = (jetzt.getMonth() + 1).toString().padStart(2, '0');
    const jahr = jetzt.getFullYear();
    const stunde = jetzt.getHours().toString().padStart(2, '0');
    const minute = jetzt.getMinutes().toString().padStart(2, '0');

    return `${tag}.${monat}.${jahr} ${stunde}:${minute}`;
}

export function getRandomElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}