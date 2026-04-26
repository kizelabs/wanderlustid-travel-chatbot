const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const submitButton = form.querySelector('button[type="submit"]');
const chatBox = document.getElementById('chat-box');
const chips = Array.from(document.querySelectorAll('.chip'));

const STARTER_MESSAGE =
  'Hai, Petualang! Ceritain destinasi impianmu, nanti aku bantu rencanain trip-nya.';

appendMessage('bot', STARTER_MESSAGE);

function scrollChatToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderMarkdown(text) {
  if (window.marked && window.DOMPurify) {
    const unsafeHtml = window.marked.parse(text, {
      breaks: true,
      gfm: true,
    });
    return window.DOMPurify.sanitize(unsafeHtml);
  }

  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br>');
}

function setMessageContent(message, text, useMarkdown = false) {
  if (useMarkdown) {
    message.classList.add('markdown');
    message.innerHTML = renderMarkdown(text);
    return;
  }

  message.classList.remove('markdown');
  message.textContent = text;
}

function appendMessage(sender, text, useMarkdown = false) {
  const message = document.createElement('article');
  message.className = `message ${sender}`;
  setMessageContent(message, text, useMarkdown);
  chatBox.appendChild(message);
  scrollChatToBottom();
  return message;
}

function appendUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'user-message-row';

  const bubble = document.createElement('article');
  bubble.className = 'message user';
  setMessageContent(bubble, text);

  row.appendChild(bubble);
  chatBox.appendChild(row);
  scrollChatToBottom();

  return { row };
}

function setPending(isPending) {
  input.disabled = isPending;
  submitButton.disabled = isPending;
  submitButton.classList.toggle('is-loading', isPending);
  chips.forEach((chip) => {
    chip.disabled = isPending;
  });
  document.querySelectorAll('.retry-refresh-icon').forEach((button) => {
    button.disabled = isPending;
  });
}

async function sendMessage(prompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'Gagal menghubungi server');
    error.status = response.status;
    throw error;
  }

  return data.text || '(Belum ada jawaban)';
}

function renderRetryButton(targetRow, prompt) {
  const oldButton = targetRow.querySelector('.retry-refresh-icon');
  if (oldButton) {
    oldButton.remove();
  }

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.className = 'retry-refresh-icon';
  retryButton.setAttribute('aria-label', 'Refresh ulang pesan ini');
  retryButton.innerHTML =
    '<svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true"><path d="M12 5a7 7 0 0 1 6.24 3.83l.42-1.7a1 1 0 1 1 1.94.48l-.98 3.94a1 1 0 0 1-1.22.72l-3.94-.98a1 1 0 0 1 .48-1.94l1.46.37A5 5 0 1 0 17 14a1 1 0 1 1 2 0 7 7 0 1 1-7-9Z" fill="currentColor"/></svg>';
  retryButton.addEventListener('click', async () => {
    await handlePrompt(prompt, { echoUser: false, retryTargetRow: targetRow });
  });

  targetRow.prepend(retryButton);
}

async function handlePrompt(prompt, options = {}) {
  const normalizedPrompt = prompt?.trim();
  if (!normalizedPrompt) return;
  const { echoUser = true, retryTargetRow = null } = options;
  let userRow = retryTargetRow;

  if (echoUser) {
    userRow = appendUserMessage(normalizedPrompt).row;
  } else if (userRow) {
    const oldButton = userRow.querySelector('.retry-refresh-icon');
    if (oldButton) {
      oldButton.remove();
    }
  }
  input.value = '';
  setPending(true);

  const typingBubble = appendMessage('bot', 'Menyiapkan rekomendasi perjalanan...');

  try {
    const reply = await sendMessage(normalizedPrompt);
    setMessageContent(typingBubble, reply, true);
  } catch (error) {
    setMessageContent(typingBubble, `Ups, ${error.message}. Coba lagi ya.`);
    if (error.status === 500 && userRow) {
      renderRetryButton(userRow, prompt);
    }
  } finally {
    setPending(false);
    input.focus();
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await handlePrompt(input.value.trim());
});

chips.forEach((chip) => {
  chip.addEventListener('click', async () => {
    const prompt = chip.dataset.prompt?.trim() || '';
    input.value = prompt;
    await handlePrompt(prompt);
  });
});
