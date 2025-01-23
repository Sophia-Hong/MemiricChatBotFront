<?php
defined('ABSPATH') or die('Direct access not allowed');
?>
<div id="memoiric-chat-trigger" class="chat-trigger">
    <div class="trigger-content">
        <img src="https://www.memoiric.com/wp-content/uploads/2024/04/Logo-03.png" alt="Memoiric Chat" class="trigger-logo">
        <span>Chat with Moir</span>
    </div>
</div>

<div id="memoiric-chatbot-widget" class="my-chatbot-widget hidden">
    <div class="chat-header">
        <div class="header-content">
            <img src="https://www.memoiric.com/wp-content/uploads/2024/04/Logo-03.png" alt="Memoiric Logo" class="chat-logo">
            <div class="header-text">
                <h3><?php echo esc_html($this->settings['welcome_message']); ?></h3>
                <p><?php echo esc_html($this->settings['status_message']); ?></p>
            </div>
        </div>
        <div class="controls">
            <button class="minimize-btn" aria-label="Minimize chat">─</button>
            <button class="close-btn" aria-label="Close chat">×</button>
        </div>
    </div>
    
    <div class="chat-messages" aria-live="polite">
        <div class="message bot">
            <div class="message-content">
                Hi! I'm here to help you with your photography needs. How can I assist you today?
            </div>
            <div class="message-timestamp">Just now</div>
        </div>
    </div>
    
    <div class="loading-indicator">
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>

    <div class="predefined-prompts">
        <button class="predefined-prompt">How many photos needed?</button>
        <button class="predefined-prompt">Special Discount?</button>
    </div>

    <div class="chat-input-container">
        <div class="chat-input">
            <input type="text" 
                   placeholder="Message Moir..."
                   aria-label="Chat message"
                   maxlength="500">
            <button class="send-btn" aria-label="Send message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="char-counter">0/500</div>
    </div>
</div>
