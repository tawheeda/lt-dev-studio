<?php
/**
 * LT Dev Studio — contact form handler
 * Drop into the same public_html as index.html.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ---- Config ----
$TO_ADDRESS   = 'info@ltdevstudio.co.za';
$SITE_NAME    = 'LT Dev Studio';
// Some hosts require From: on the same domain as the site.
$FROM_ADDRESS = 'no-reply@ltdevstudio.co.za';
// ----------------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// Honeypot
if (!empty($_POST['company'] ?? '')) {
  echo json_encode(['ok' => true]);
  exit;
}

$name    = trim((string)($_POST['name']    ?? ''));
$email   = trim((string)($_POST['email']   ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$errors = [];
if ($name === '' || mb_strlen($name) > 100)                                          $errors[] = 'Please enter your name (max 100 chars).';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) $errors[] = 'Please enter a valid email address.';
if ($message === '' || mb_strlen($message) > 4000)                                    $errors[] = 'Please include a short message (max 4000 chars).';

if ($errors) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'errors' => $errors]);
  exit;
}

$safeName  = preg_replace("/[\r\n]+/", ' ', $name);
$safeEmail = preg_replace("/[\r\n]+/", '', $email);

$subject = "New enquiry from {$safeName} — {$SITE_NAME}";
$body = implode("\r\n", [
  "New enquiry from the {$SITE_NAME} website",
  str_repeat('-', 50),
  "Name:    {$safeName}",
  "Email:   {$safeEmail}",
  "IP:      " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
  "Time:    " . date('Y-m-d H:i:s'),
  '',
  'Message:',
  $message,
]);

$headers = implode("\r\n", [
  "From: {$SITE_NAME} <{$FROM_ADDRESS}>",
  "Reply-To: {$safeName} <{$safeEmail}>",
  'X-Mailer: PHP/' . phpversion(),
  'Content-Type: text/plain; charset=utf-8',
]);

$sent = @mail($TO_ADDRESS, $subject, $body, $headers, "-f{$FROM_ADDRESS}");

if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail server rejected the message. Please email us directly.']);
  exit;
}

echo json_encode(['ok' => true]);
