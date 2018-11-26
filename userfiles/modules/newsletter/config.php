<?php
$config = array();
$config['name'] = 'Newsletter';
$config['author'] = 'Microweber';
$config['ui'] = true;
$config['ui_admin'] = true;
$config['categories'] = 'marketing';
$config['position'] = 55;
$config['version'] = 0.1;

$config['tables'] = array(
	
    'newsletter_subscribers' => array(
        'id' => 'integer',
        'name' => 'text',
        'email' => 'text',
        'created_at' => 'dateTime',
        'confirmation_code' => 'text',
        'is_subscribed' => 'integer'
    ),

    'newsletter_campaigns' => array(
        'id' => 'integer',
        'name' => 'text',
        'subject' => 'text',
        'from_name' => 'text',
        //'from_email' => 'text',
        'created_at' => 'dateTime',
        'list_id' => 'integer',
    	'sender_account_id' => 'integer',
        'is_done' => 'integer'
    ),

    'newsletter_campaigns_send_log' => array(
        'id' => 'integer',
        'campaign_id' => 'integer',
        'subscriber_id' => 'integer',
        'created_at' => 'dateTime',
        'is_done' => 'integer'
    ),
		
	'newsletter_sender_accounts' => array(
		'id' => 'integer',
		'name' => 'text',
		'from_name' => 'text',
		'from_email' => 'text',
		'reply_email' => 'text',
		'created_at' => 'dateTime',
		'account_type' => 'text',
		'account_login' => 'text',
		'account_pass' => 'text',
		'is_active' => 'integer'
	),
	
	'newsletter_lists' => array(
		'id' => 'integer',
		'name' => 'text',
		'success_email_template' => 'integer',
		'success_email_sender' => 'integer',
		'unsubscription_email_sender' => 'integer',
		'unsubscription_email_template' => 'integer',
		'confirmation_email_template' => 'integer',
		'confirmation_email_sender' => 'integer',
		'created_at' => 'dateTime'
	),
    
    'newsletter_subscribers_lists' => array(
        'id' => 'integer',
        'subscriber_id' => 'integer',
        'list_id' => 'integer',
        'created_at' => 'dateTime'
    ),
    'newsletter_templates' => array(
        'id' => 'integer',
        'title' => 'text',
        'text' => 'text',
        'created_at' => 'dateTime'
    )
);