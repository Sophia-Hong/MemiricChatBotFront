<?php
if (!defined('ABSPATH')) exit;
?>
<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <form action="options.php" method="post">
        <?php
        settings_fields('memoiric_chatbot_settings');
        do_settings_sections('memoiric-chatbot');
        submit_button('Save Settings');
        ?>
    </form>

    <div class="memoiric-chatbot-help">
        <h2>Help & Documentation</h2>
        <p>To configure the chatbot:</p>
        <ol>
            <li>Enter your n8n webhook URL in the field above</li>
            <li>The webhook should accept POST requests with a JSON body containing a 'message' field</li>
            <li>The webhook should return a JSON response with a 'message' field containing the bot's response</li>
        </ol>
        <p>For more information and support, please visit our <a href="https://docs.example.com/memoiric-chatbot" target="_blank">documentation</a>.</p>
    </div>
</div>

<style>
.memoiric-chatbot-help {
    margin-top: 2em;
    padding: 1.5em;
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
}

.memoiric-chatbot-help h2 {
    margin-top: 0;
}

.memoiric-chatbot-help ol {
    margin-left: 1.5em;
}
</style>
