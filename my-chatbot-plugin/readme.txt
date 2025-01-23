=== My Chatbot Plugin ===
Contributors: 
Tags: chatbot, n8n, customer support, chat widget
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A modern, floating chatbot widget that integrates with n8n webhooks for automated customer support.

== Description ==

This plugin adds a sleek, Apple-like chatbot widget to your WordPress site. The chatbot integrates with n8n webhooks to provide automated responses to user queries.

Features:
* Modern, gradient-based design
* Fully responsive
* Draggable chat window
* Position memory
* Minimize/maximize functionality
* Pre-defined prompt suggestions
* Loading indicators
* Smooth animations
* n8n webhook integration

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/my-chatbot-plugin` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Configure your n8n webhook URL in the main plugin file

== Configuration ==

To configure the n8n webhook URL:
1. Edit my-chatbot-plugin.php
2. Locate the wp_localize_script function
3. Replace the empty webhookUrl value with your n8n webhook endpoint

== Changelog ==

= 1.0.0 =
* Initial release
