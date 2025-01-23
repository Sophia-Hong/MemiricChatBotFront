<?php
if (!defined('ABSPATH')) exit;
?>
<div id="memoiric-chatbot-widget" class="my-chatbot-widget">
    <div class="chat-header">
        <div class="chat-title">
            <div class="avatar">
                <img src="<?php echo MY_CHATBOT_PLUGIN_URL; ?>assets/moir-avatar.png" alt="<?php echo esc_attr($this->settings['bot_name']); ?>">
                <div class="status-dot"></div>
            </div>
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
