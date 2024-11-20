"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomElement = exports.getCurrentTimeStr = exports.generateUUID = void 0;
function generateUUID(uuidLength) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let uuid = '';
    for (let i = 0; i < uuidLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uuid += characters[randomIndex];
    }
    return uuid;
}
exports.generateUUID = generateUUID;
function getCurrentTimeStr() {
    const jetzt = new Date();
    const tag = jetzt.getDate().toString().padStart(2, '0');
    const monat = (jetzt.getMonth() + 1).toString().padStart(2, '0');
    const jahr = jetzt.getFullYear();
    const stunde = jetzt.getHours().toString().padStart(2, '0');
    const minute = jetzt.getMinutes().toString().padStart(2, '0');
    return `${tag}.${monat}.${jahr} ${stunde}:${minute}`;
}
exports.getCurrentTimeStr = getCurrentTimeStr;
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
exports.getRandomElement = getRandomElement;
