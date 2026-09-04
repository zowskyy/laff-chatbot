export function generateCipher(input: {
  algorithm: "caesar" | "rot" | "atbash" | "reverse" | "base64" | "hex";
  text: string;
  shift?: number;
}): string {
  switch (input.algorithm) {
    case "reverse": return [...input.text].reverse().join("");
    case "base64": return Buffer.from(input.text, "utf8").toString("base64");
    case "hex": return Buffer.from(input.text, "utf8").toString("hex");
    case "atbash":
      return [...input.text].map(ch => {
        if (/[A-Z]/.test(ch)) return String.fromCharCode(90 - (ch.charCodeAt(0) - 65));
        if (/[a-z]/.test(ch)) return String.fromCharCode(122 - (ch.charCodeAt(0) - 97));
        return ch;
      }).join("");
    case "caesar":
    case "rot": {
      const shift = input.shift ?? 13;
      return [...input.text].map(ch => {
        const base = /[A-Z]/.test(ch) ? 65 : /[a-z]/.test(ch) ? 97 : -1;
        if (base < 0) return ch;
        return String.fromCharCode((ch.charCodeAt(0) - base + shift + 26 * 1000) % 26 + base);
      }).join("");
    }
  }
}
