- [ ] Inspect backend entry points and confirm how `server.js` is started
- [x] Edit `backend/server.js` to log `typeof Chat` at startup to confirm the correct file is executed
- [x] Edit `backend/server.js` to add `mongoose.connect` before using the `Chat` model
- [ ] Restart backend (single process) and retest `/api/chat`
- [ ] If error persists, re-check for multiple server.js copies / nodemon watchers


