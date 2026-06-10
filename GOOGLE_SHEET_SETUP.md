# Google Sheet message inbox — setup

Messages typed into the site's `message` command POST to a Google Apps Script
web app, which appends them to a Google Sheet.

## 1. Create the Sheet

1. Go to [sheets.new](https://sheets.new), name it `Frank Site Messages`.
2. Row 1 headers: `Timestamp` | `Name` | `Email` | `Message`.

## 2. Add the Apps Script

1. In the Sheet: **Extensions → Apps Script**.
2. Replace the default code with:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  let data = {};
  try {
    data = JSON.parse(e.postData.contents) || {};
  } catch (err) {
    data = { message: e.postData.contents || "" };
  }

  // basic guardrails: trim + cap lengths
  const clean = (value, max) => String(value || "").trim().slice(0, max);
  const name = clean(data.name, 200);
  const email = clean(data.email, 320);
  const message = clean(data.message, 2000);

  if (!message) {
    return ContentService.createTextOutput("empty");
  }

  sheet.appendRow([new Date(), name, email, message]);
  return ContentService.createTextOutput("ok");
}
```

3. Save (name it `message-inbox`).

## 3. Deploy as web app

1. **Deploy → New deployment → type: Web app**.
2. Description: `frank site messages`.
3. **Execute as:** Me.
4. **Who has access:** Anyone. (Required — visitors aren't signed in.)
5. Deploy → authorize → copy the **Web app URL** (ends in `/exec`).

## 4. Wire the site

Paste the URL into `js/commands.js`:

```javascript
const MESSAGE_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
```

## Notes

- The site sends `mode: "no-cors"` — Apps Script doesn't return CORS headers,
  so the response is opaque. Success is assumed when the request doesn't throw.
- Redeploying the script (New deployment) generates a NEW URL — update
  `commands.js` each time, or use **Manage deployments → edit → new version**
  to keep the same URL.
- "Anyone" access means anyone with the URL can append rows. The script caps
  messages at 2000 chars; spam can be cleaned up in the Sheet directly.
