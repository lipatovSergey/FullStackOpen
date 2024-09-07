sequenceDiagram
    participant user as User
    participant browser as Browser
    participant server as Server

    user->>browser: Inputs note and clicks "Save"
    browser->>server: POST /new_note with note data
    activate server
    server-->>browser: Confirmation (200 OK)
    deactivate server

    Note right of browser: Browser sends a request to get updated notes

    browser->>server: GET /data.json (updated notes)
    activate server
    server-->>browser: [{ "content": "new note", "date": "2024-09-07" }, ... ]
    deactivate server

    Note right of browser: Browser renders the updated notes list
