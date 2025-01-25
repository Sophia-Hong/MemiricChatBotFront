jQuery(document).ready(function($) {
    class MemoiricChatbot {
        constructor() {
            this.chatWidget = $('#memoiric-chatbot-widget');
            this.chatTrigger = $('#memoiric-chat-trigger');
            this.chatMessages = $('.chat-messages');
            this.chatInput = $('.chat-input input');
            this.sendButton = $('.send-btn');
            this.minimizeBtn = $('.minimize-btn');
            this.closeBtn = $('.close-btn');
            this.loadingIndicator = $('.loading-indicator');
            this.charCounter = $('.char-counter');
            
            this.messageQueue = [];
            this.isProcessing = false;
            this.rateLimitDelay = 1000; // 1 second between messages
            
            this.initializeEventListeners();
            this.loadChatHistory();
            
            // Set initial focus to input when chat opens
            setTimeout(() => {
                if (!this.chatWidget.hasClass('hidden')) {
                    this.chatInput.focus();
                }
            }, 500);
        }

        initializeEventListeners() {
            this.chatTrigger.on('click', () => this.openChat());
            this.minimizeBtn.on('click', () => this.closeChat());
            this.closeBtn.on('click', () => this.closeChat());
            this.sendButton.on('click', () => this.handleSendMessage());
            this.chatInput.on('keypress', (e) => this.handleKeyPress(e));
            this.chatInput.on('input', () => this.updateCharCounter());
            $('.predefined-prompt').on('click', (e) => this.handlePredefinedPrompt(e));

            // Save chat state on page unload
            $(window).on('beforeunload', () => this.saveChatHistory());

            // Adjust message container on window resize
            $(window).on('resize', () => this.adjustMessageContainer());
        }

        openChat() {
            this.chatWidget.removeClass('hidden');
            this.chatTrigger.addClass('hidden');
            this.chatInput.focus();
            this.scrollToBottom();
        }

        closeChat() {
            this.chatWidget.addClass('hidden');
            this.chatTrigger.removeClass('hidden');
        }

        adjustMessageContainer() {
            const messages = this.chatMessages.find('.message');
            messages.each((i, msg) => {
                const $msg = $(msg);
                const content = $msg.find('.message-content');
                content.css('max-width', '');
                
                const maxWidth = Math.min(
                    this.chatMessages.width() * 0.85,
                    400
                );
                
                content.css('max-width', maxWidth + 'px');
            });
        }

        updateCharCounter() {
            const currentLength = this.chatInput.val().length;
            this.charCounter.text(`${currentLength}/500`);
            
            if (currentLength >= 500) {
                this.charCounter.addClass('limit-reached');
            } else {
                this.charCounter.removeClass('limit-reached');
            }

            // Enable/disable send button
            this.sendButton.prop('disabled', currentLength === 0);
            this.sendButton.toggleClass('disabled', currentLength === 0);
        }

        handleKeyPress(e) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        }

        handlePredefinedPrompt(e) {
            const message = $(e.target).text();
            this.chatInput.val(message);
            this.handleSendMessage();
        }

        handleSendMessage() {
            const message = this.chatInput.val().trim();
            if (!message) return;
            
            if (message.length > 500) {
                this.showError('Message is too long. Please limit to 500 characters.');
                return;
            }

            this.messageQueue.push(message);
            this.chatInput.val('');
            this.updateCharCounter();
            
            if (!this.isProcessing) {
                this.processMessageQueue();
            }
        }

        async processMessageQueue() {
            if (this.messageQueue.length === 0) {
                this.isProcessing = false;
                return;
            }

            this.isProcessing = true;
            const message = this.messageQueue.shift();
            
            // Add user message to chat
            this.appendMessage('user', message);
            
            try {
                // Show loading indicator
                this.loadingIndicator.show();
                
                const response = await this.sendToWebhook(message);
                this.loadingIndicator.hide();
                
                if (response && response.message) {
                    this.appendMessage('bot', response.message);
                }
            } catch (error) {
                this.loadingIndicator.hide();
                this.showError('Sorry, I encountered an error. Please try again later.');
                console.error('Chatbot error:', error);
            }

            // Rate limiting
            setTimeout(() => this.processMessageQueue(), this.rateLimitDelay);
        }

        async sendToWebhook(message) {
            try {
                const sessionId = this.getSessionId();
                const response = await $.ajax({
                    url: 'https://n8n.peopleshine.online/webhook/e985d15f-b2f6-456d-be15-97e0b1544a40/chat',
                    method: 'POST',
                    data: JSON.stringify({
                        chatInput: message,
                        sessionId: sessionId
                    }),
                    contentType: 'application/json',
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: false
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                console.log('Webhook response:', response);

                if (response && typeof response === 'string') {
                    return { message: response };
                } else if (response && response.text) {
                    return { message: response.text };
                } else if (response && response.output) {
                    return { message: response.output };
                } else {
                    console.log('Unexpected response format:', response);
                    return { message: 'I received your message but encountered an unexpected response format.' };
                }
            } catch (error) {
                console.error('Webhook error:', error);
                console.error('Error response:', error.responseText);
                if (error.responseJSON && error.responseJSON.message) {
                    throw new Error(error.responseJSON.message);
                } else {
                    throw new Error('Sorry, I encountered an error. Please try again later.');
                }
            }
        }

        getSessionId() {
            let sessionId = localStorage.getItem('memoiric_session_id');
            if (!sessionId) {
                // Format: timestamp_randomstring
                sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
                localStorage.setItem('memoiric_session_id', sessionId);
            }
            return sessionId;
        }

        appendMessage(sender, message) {
            const timestamp = new Date().toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit'
            });
            
            const messageDiv = $('<div>')
                .addClass('message')
                .addClass(sender)
                .append(
                    $('<div>').addClass('message-content').html(this.formatMessage(message)),
                    $('<div>').addClass('message-timestamp').text(timestamp)
                );
            
            this.chatMessages.append(messageDiv);
            this.adjustMessageContainer();
            this.scrollToBottom();
            this.saveChatHistory();
        }

        formatMessage(message) {
            if (typeof message !== 'string') return message;

            // Replace markdown-style formatting
            let formatted = message
                // Bold
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                // Handle numbered lists with proper spacing
                .replace(/(\d+)\. /g, '<br>$1. ')
                // Make WhatsApp numbers clickable
                .replace(/\+(\d+\s*\d*\s*\d*)/g, '<a href="https://wa.me/$1" target="_blank">+$1</a>')
                // Make email addresses clickable
                .replace(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, '<a href="mailto:$1">$1</a>')
                // Make Instagram handle clickable (without @ in the URL)
                .replace(/@memoir_ic/g, '<a href="https://instagram.com/memoir_ic" target="_blank">@memoir_ic</a>')
                // Preserve line breaks
                .replace(/\n/g, '<br>')
                // Clean up multiple line breaks
                .replace(/(<br\s*\/?>\s*){3,}/g, '<br><br>')
                // Add proper spacing for list items
                .replace(/<br>(\d+)\./g, '<br><br>$1.')
                // Remove leading/trailing spaces
                .trim();

            return formatted;
        }

        showError(message) {
            const errorDiv = $('<div>')
                .addClass('message')
                .addClass('error')
                .html(this.formatMessage(message));
            
            this.chatMessages.append(errorDiv);
            this.scrollToBottom();
            
            setTimeout(() => errorDiv.fadeOut(() => errorDiv.remove()), 5000);
        }

        scrollToBottom() {
            const scrollHeight = this.chatMessages[0].scrollHeight;
            this.chatMessages.stop().animate({
                scrollTop: scrollHeight
            }, 300);
        }

        saveChatHistory() {
            const messages = [];
            $('.message').each(function() {
                const $message = $(this);
                if (!$message.hasClass('error')) {
                    messages.push({
                        sender: $message.hasClass('user') ? 'user' : 'bot',
                        content: $message.find('.message-content').html(),
                        timestamp: $message.find('.message-timestamp').text()
                    });
                }
            });

            if (messages.length > 0) {
                localStorage.setItem('memoiricChatHistory', JSON.stringify(messages));
            }
        }

        loadChatHistory() {
            const history = localStorage.getItem('memoiricChatHistory');
            if (history) {
                const messages = JSON.parse(history);
                messages.forEach(msg => {
                    const messageDiv = $('<div>')
                        .addClass('message')
                        .addClass(msg.sender)
                        .append(
                            $('<div>').addClass('message-content').html(msg.content),
                            $('<div>').addClass('message-timestamp').text(msg.timestamp)
                        );
                    this.chatMessages.append(messageDiv);
                });
                this.adjustMessageContainer();
                this.scrollToBottom();
            }
        }
    }

    // Initialize chatbot
    new MemoiricChatbot();
});
