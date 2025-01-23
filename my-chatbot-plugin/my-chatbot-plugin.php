<?php
/**
 * Plugin Name: My Chatbot Plugin
 * Plugin URI: 
 * Description: A modern, floating chatbot widget that integrates with n8n webhooks
 * Version: 1.0.0
 * Author: 
 * Text Domain: my-chatbot-plugin
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MY_CHATBOT_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('MY_CHATBOT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('MY_CHATBOT_VERSION', '1.0.0');

class MemoiricChatbot {
    private static $instance = null;
    private $webhook_url;
    private $settings;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
        $this->settings = get_option('memoiric_chatbot_settings', [
            'webhook_url' => '',
            'bot_name' => 'Moir',
            'welcome_message' => 'Hi, I\'m Moir! 👋',
            'status_message' => 'Online & Ready to Chat'
        ]);
    }

    private function init_hooks() {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('wp_footer', [$this, 'render_chatbot']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function enqueue_scripts() {
        wp_enqueue_style(
            'memoiric-chatbot-style',
            MY_CHATBOT_PLUGIN_URL . 'css/chatbot.css',
            array(),
            MY_CHATBOT_VERSION
        );

        wp_enqueue_script(
            'memoiric-chatbot-script',
            MY_CHATBOT_PLUGIN_URL . 'js/chatbot.js',
            array('jquery'),
            MY_CHATBOT_VERSION,
            true
        );

        wp_localize_script(
            'memoiric-chatbot-script',
            'memoiricChatbotSettings',
            array(
                'webhookUrl' => esc_url($this->settings['webhook_url']),
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('memoiric-chatbot-nonce'),
                'botName' => sanitize_text_field($this->settings['bot_name']),
                'welcomeMessage' => sanitize_text_field($this->settings['welcome_message']),
                'statusMessage' => sanitize_text_field($this->settings['status_message'])
            )
        );
    }

    public function render_chatbot() {
        include MY_CHATBOT_PLUGIN_PATH . 'templates/chatbot-widget.php';
    }

    public function add_admin_menu() {
        add_options_page(
            'Memoiric Chatbot Settings',
            'Memoiric Chatbot',
            'manage_options',
            'memoiric-chatbot',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings() {
        register_setting('memoiric_chatbot_settings', 'memoiric_chatbot_settings');
        
        add_settings_section(
            'memoiric_chatbot_main',
            'Main Settings',
            null,
            'memoiric-chatbot'
        );

        add_settings_field(
            'webhook_url',
            'Webhook URL',
            [$this, 'render_webhook_url_field'],
            'memoiric-chatbot',
            'memoiric_chatbot_main'
        );
    }

    public function render_settings_page() {
        include MY_CHATBOT_PLUGIN_PATH . 'templates/admin-settings.php';
    }

    public function render_webhook_url_field() {
        $webhook_url = isset($this->settings['webhook_url']) ? $this->settings['webhook_url'] : '';
        echo '<input type="url" name="memoiric_chatbot_settings[webhook_url]" value="' . esc_attr($webhook_url) . '" class="regular-text">';
    }
}

// Initialize the plugin
add_action('plugins_loaded', function() {
    MemoiricChatbot::get_instance();
});
