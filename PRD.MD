# WordPress Chatbot Plugin PRD

## 1. Overview
### Objective:
Develop a custom WordPress plugin to integrate a chatbot frontend into the footer of a live, existing WordPress site. To avoid conflicts, carefully name the functions and modules.

The frontend will call **n8n Webhook endpoints** to execute backend logic, including handling user inputs, retrieving responses, and displaying them in a clean, user-friendly interface. The backend n8n logic has already been developed, so include placeholders for Webhook endpoints.

---

## 2. Functional Requirements

### **Frontend Chat UI**
- Fully mobile responsive.
- Sleek, Apple-like modern design with subtle gradient effects.
- User can move the chat window to any corner of the screen.
- User can toggle the chat window on and off. DO NOT close the window when user is not using it.
- **Positioning:** A floating chat widget at the bottom-right corner of the screen.
- **Key Features:**
  1. **Avatar (logo):** Represents the bot with a green dot to indicate online status.
  2. **Chat messages:** Display messages from both user and bot.
  3. **Input field:** For user text input.
  4. **Send button:** Triggers message submission.
  5. **Loading indicator:** Shows while waiting for a response.
  6. **Pre-defined prompts:** Users can click on predefined suggestions to initiate interactions.

### **Backend Integration**
- Use **n8n Webhook endpoints** for handling user inputs.
- Placeholder for Webhook URL to connect with the backend logic.
- The chatbot should send user messages to the backend and display the received responses seamlessly.

### **WordPress Integration**
- The plugin automatically adds the chatbot UI to the **WordPress footer**.
- Lightweight design to avoid performance issues on the site.

---
my-chatbot-plugin/
├── my-chatbot-plugin.php        # Main plugin file
├── js/
│   └── chatbot.js               # Chatbot frontend logic
├── css/
│   └── chatbot.css              # Chatbot styles
└── readme.txt                   # Plugin documentation
