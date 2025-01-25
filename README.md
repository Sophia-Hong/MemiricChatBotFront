# Memoiric Chatbot Plugin

A WordPress plugin that implements an interactive chatbot for Memoiric's website. The chatbot assists customers with photo sharing instructions, pricing information, and general inquiries.

## Features

- 🤖 Interactive AI-powered chatbot
- 💬 Real-time conversation with typing indicators
- 🔄 Session persistence for continuous conversations
- 📱 Responsive design for all devices
- 🖱️ Draggable chat widget
- 🔗 Smart link handling (WhatsApp, Email, Instagram)
- 💾 Local storage for chat history
- ⚡ Integration with n8n for advanced workflow automation

## Installation

1. Download the plugin files
2. Upload to your WordPress plugins directory (`wp-content/plugins/`)
3. Activate the plugin through the WordPress admin interface

## Configuration

1. Navigate to WordPress admin panel
2. Go to Settings > Memoiric Chatbot
3. Configure the following settings:
   - n8n Webhook URL
   - Initial greeting message
   - Predefined quick replies
   - Chat widget appearance

## Usage

The chatbot will automatically appear on your website with the following features:

- **Quick Replies**: Pre-defined buttons for common questions
- **Photo Sharing Instructions**: Detailed steps for sharing photos via:
  - WhatsApp
  - Email
  - Google Drive/iCloud
  - Instagram
- **Draggable Widget**: Users can move the chat widget around the screen
- **Session Persistence**: Conversations are saved between page reloads

## Development

### File Structure
```
my-chatbot-plugin/
├── css/
│   └── chatbot.css
├── js/
│   └── chatbot.js
├── templates/
│   ├── admin-settings.php
│   └── chatbot-widget.php
├── my-chatbot-plugin.php
└── readme.txt
```

### Key Components

- **Frontend**: Built with jQuery for DOM manipulation and AJAX requests
- **Backend**: WordPress plugin architecture with n8n integration
- **Storage**: Uses localStorage for session management
- **Styling**: Custom CSS with responsive design

### Integration Points

1. **n8n Webhook**:
   - Handles chat message processing
   - Maintains conversation context
   - Integrates with external services

2. **WordPress**:
   - Admin settings management
   - Plugin activation/deactivation hooks
   - Frontend widget integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software owned by Memoiric. All rights reserved.

## Support

For support inquiries, please contact info@memoiric.com
