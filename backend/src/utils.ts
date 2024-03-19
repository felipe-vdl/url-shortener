export const generateBase62Id = (length: number) => {
  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let id = "";

  for (let i = 0; i < length; i++) {
    id += base62Chars[Math.floor(Math.random() * base62Chars.length)];
  }

  return id;
};
