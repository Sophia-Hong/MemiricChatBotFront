jQuery(document).ready(function($) {
    class MemoiricChatbot {
        constructor() {
            this.chatWidget = $('#memoiric-chatbot-widget');
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
            this.loadState();
            
            // Set initial focus to input
            setTimeout(() => this.chatInput.focus(), 500);
        }

        initializeEventListeners() {
            this.minimizeBtn.on('click', () => this.toggleMinimize());
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

        toggleMinimize() {
            this.chatWidget.toggleClass('minimized');
            this.minimizeBtn.text(this.chatWidget.hasClass('minimized') ? '□' : '─');
            if (!this.chatWidget.hasClass('minimized')) {
                this.adjustMessageContainer();
                this.scrollToBottom();
            }
            this.saveState();
        }

        closeChat() {
            this.chatWidget.hide();
            this.saveState();
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
            if (!memoiricChatbotSettings.webhookUrl) {
                throw new Error('Webhook URL not configured');
            }

            const response = await $.ajax({
                url: memoiricChatbotSettings.webhookUrl,
                method: 'POST',
                data: JSON.stringify({ message: message }),
                contentType: 'application/json',
                headers: {
                    'X-WP-Nonce': memoiricChatbotSettings.nonce
                }
            });

            return response;
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
                    $('<div>').addClass('message-content').text(message),
                    $('<div>').addClass('message-timestamp').text(timestamp)
                );
            
            this.chatMessages.append(messageDiv);
            this.adjustMessageContainer();
            this.scrollToBottom();
            this.saveChatHistory();
        }

        showError(message) {
            const errorDiv = $('<div>')
                .addClass('message')
                .addClass('error')
                .text(message);
            
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
                        content: $message.find('.message-content').text(),
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
                            $('<div>').addClass('message-content').text(msg.content),
                            $('<div>').addClass('message-timestamp').text(msg.timestamp)
                        );
                    this.chatMessages.append(messageDiv);
                });
                this.adjustMessageContainer();
                this.scrollToBottom();
            }
        }

        saveState() {
            localStorage.setItem('memoiricChatState', JSON.stringify({
                minimized: this.chatWidget.hasClass('minimized'),
                hidden: this.chatWidget.is(':hidden')
            }));
        }

        loadState() {
            const state = localStorage.getItem('memoiricChatState');
            if (state) {
                const savedState = JSON.parse(state);
                if (savedState.minimized) {
                    this.chatWidget.addClass('minimized');
                    this.minimizeBtn.text('□');
                }
                if (savedState.hidden) {
                    this.chatWidget.hide();
                }
            }
        }
    }

    // Initialize chatbot
    new MemoiricChatbot();
});
