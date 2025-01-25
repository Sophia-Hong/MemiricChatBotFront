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
        // Set default settings
        $default_settings = array(
            'bot_name' => 'Moir',
            'welcome_message' => 'Hi, I\'m Moir! 👋',
            'status_message' => 'Ready to chat'
        );
        
        // Get existing settings or use defaults
        $this->settings = get_option('memoiric_chatbot_settings', $default_settings);
        
        // Ensure all default keys exist
        $this->settings = wp_parse_args($this->settings, $default_settings);
        
        $this->init_hooks();
    }

    private function init_hooks() {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('wp_footer', [$this, 'render_chatbot']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function enqueue_scripts() {
        wp_enqueue_style(
            'my-chatbot-style',
            plugins_url('css/chatbot.css', __FILE__),
            array(),
            '1.0'
        );

        wp_enqueue_script(
            'my-chatbot-script',
            plugins_url('js/chatbot.js', __FILE__),
            array('jquery'),
            '1.0',
            true
        );

        wp_localize_script(
            'my-chatbot-script',
            'memoiricChatbotSettings',
            array(
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
        register_setting('memoiric_chatbot_settings', 'memoiric_chatbot_settings', [$this, 'validate_settings']);
        
        add_settings_section(
            'memoiric_chatbot_main',
            'Main Settings',
            null,
            'memoiric-chatbot'
        );

        add_settings_field(
            'bot_name',
            'Bot Name',
            [$this, 'render_bot_name_field'],
            'memoiric-chatbot',
            'memoiric_chatbot_main'
        );

        add_settings_field(
            'welcome_message',
            'Welcome Message',
            [$this, 'render_welcome_message_field'],
            'memoiric-chatbot',
            'memoiric_chatbot_main'
        );

        add_settings_field(
            'status_message',
            'Status Message',
            [$this, 'render_status_message_field'],
            'memoiric-chatbot',
            'memoiric_chatbot_main'
        );
    }

    public function render_settings_page() {
        include MY_CHATBOT_PLUGIN_PATH . 'templates/admin-settings.php';
    }

    public function render_bot_name_field() {
        $bot_name = isset($this->settings['bot_name']) ? $this->settings['bot_name'] : 'Moir';
        echo '<input type="text" name="memoiric_chatbot_settings[bot_name]" value="' . esc_attr($bot_name) . '" class="regular-text">';
    }

    public function render_welcome_message_field() {
        $welcome_message = isset($this->settings['welcome_message']) ? $this->settings['welcome_message'] : 'Hi, I\'m Moir! 👋';
        echo '<input type="text" name="memoiric_chatbot_settings[welcome_message]" value="' . esc_attr($welcome_message) . '" class="regular-text">';
    }

    public function render_status_message_field() {
        $status_message = isset($this->settings['status_message']) ? $this->settings['status_message'] : 'Ready to chat';
        echo '<input type="text" name="memoiric_chatbot_settings[status_message]" value="' . esc_attr($status_message) . '" class="regular-text">';
    }

    public function validate_settings($input) {
        $new_input = array();
        
        // Validate bot name
        $new_input['bot_name'] = isset($input['bot_name']) 
            ? sanitize_text_field($input['bot_name'])
            : 'Moir';
            
        // Validate welcome message
        $new_input['welcome_message'] = isset($input['welcome_message'])
            ? sanitize_text_field($input['welcome_message'])
            : 'Hi, I\'m Moir! 👋';
            
        // Validate status message
        $new_input['status_message'] = isset($input['status_message'])
            ? sanitize_text_field($input['status_message'])
            : 'Ready to chat';
        
        return $new_input;
    }
}

// Initialize the plugin
add_action('plugins_loaded', function() {
    MemoiricChatbot::get_instance();
});
