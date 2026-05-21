const aiResponse =
  response.choices[0]
  .message.content;

/* PASTE YOUR NEW BLOCK HERE */

let cleaned =
  aiResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

/* SAFE JSON EXTRACTION */

const firstBrace =
  cleaned.indexOf("{");

const lastBrace =
  cleaned.lastIndexOf("}");

if (
  firstBrace === -1 ||
  lastBrace === -1
) {
  throw new Error(
    "Invalid AI JSON response"
  );
}

cleaned =
  cleaned.slice(
    firstBrace,
    lastBrace + 1
  );

/* PARSE JSON */
let parsed =
  JSON.parse(cleaned);