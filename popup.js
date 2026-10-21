(() => {
  const status = document.querySelector('#status');
  const controls = document.querySelector('#controls');
  const mode = document.querySelector('#larp-mode');
  const balance = document.querySelector('#balance');
  const appearance = document.querySelector('#appearance');
  const avatarSettings = document.querySelector('#avatar-settings');
  const avatarView = document.querySelector('#avatar-view');
  const previewStatus = document.querySelector('#preview-status');
  const retryPreview = document.querySelector('#retry-preview');
  const countsStatus = document.querySelector('#counts-status');
  const gameStatus = document.querySelector('#game-status');
  const saveButton = document.querySelector('#balance-form button');
  let tabId;

  function showError(error) {
    status.textContent = error;
    status.dataset.error = 'true';
  }

  function render(state) {
    mode.checked = state.mode;
    balance.value = String(state.balance);
    appearance.value = state.appearance;
    avatarSettings.hidden = !(state.avatarPage && state.mode);
    avatarView.value = state.avatarView || 'larp';
    previewStatus.textContent = state.previewStatus || '';
    retryPreview.hidden = !state.previewStatus;
    document.querySelector('#followers').value = state.socialCounts ? String(state.socialCounts.followers) : '';
    document.querySelector('#following').value = state.socialCounts ? String(state.socialCounts.following) : '';
    document.querySelector('#username').value = state.username || '';
    gameStatus.textContent = state.gameStatus || '';
    balance.disabled = !state.mode;
    saveButton.disabled = !state.mode;
    for (const input of document.querySelectorAll('#counts-form input, #counts-form button, #username-form input, #username-form button')) input.disabled = !state.mode;
    status.textContent = state.message || '';
    delete status.dataset.error;
    controls.hidden = false;
  }

  async function send(message) {
    const response = await chrome.tabs.sendMessage(tabId, message);
    if (!response?.ok) throw new Error(response?.error || 'Could not update Larpblox. Reload Roblox and try again.');
    return response;
  }

  async function initialize() {
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    if (!tab?.id || !/^https:\/\/www\.roblox\.com\//i.test(tab.url || '')) {
      showError('Open a signed-in Roblox tab to manage your Larp settings.');
      return;
    }
    tabId = tab.id;
    try { render(await send({type:'larpblox-popup-get-state'})); }
    catch { showError('Open or reload a signed-in Roblox tab, then try again.'); }
  }

  mode.addEventListener('change', async () => {
    mode.disabled = true;
    try { render(await send({type:'larpblox-popup-update', mode:mode.checked})); }
    catch (error) { mode.checked = !mode.checked; showError(error.message); }
    finally { mode.disabled = false; }
  });

  document.querySelector('#balance-form').addEventListener('submit', async event => {
    event.preventDefault();
    saveButton.disabled = true;
    try { render(await send({type:'larpblox-popup-update', balance:balance.value})); }
    catch (error) { showError(error.message); }
    finally { saveButton.disabled = !mode.checked; }
  });

  appearance.addEventListener('change', async () => {
    appearance.disabled = true;
    status.textContent = 'Applying appearance…';
    try { render(await send({type:'larpblox-popup-update', appearance:appearance.value})); }
    catch (error) { showError(error.message); }
    finally { appearance.disabled = false; }
  });

  avatarView.addEventListener('change', async () => {
    avatarView.disabled = true;
    try { render(await send({type:'larpblox-popup-avatar-view', view:avatarView.value})); }
    catch (error) { showError(error.message); }
    finally { avatarView.disabled = false; }
  });

  document.querySelector('#retry-preview').addEventListener('click', async () => {
    retryPreview.disabled = true;
    try { render(await send({type:'larpblox-popup-avatar-retry'})); }
    catch (error) { showError(error.message); }
    finally { retryPreview.disabled = false; }
  });

  document.querySelector('#counts-form').addEventListener('submit', async event => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('[type="submit"]');
    button.disabled = true;
    countsStatus.textContent = '';
    try {
      render(await send({type:'larpblox-popup-profile-counts', socialCounts:{followers:document.querySelector('#followers').value,following:document.querySelector('#following').value}}));
      countsStatus.textContent = 'Profile counts saved.';
    } catch (error) { countsStatus.textContent = error.message; }
    finally { button.disabled = !mode.checked; }
  });

  document.querySelector('#reset-counts').addEventListener('click', async () => {
    countsStatus.textContent = '';
    try {
      render(await send({type:'larpblox-popup-profile-counts', socialCounts:null}));
      countsStatus.textContent = 'Roblox counts restored.';
    } catch (error) { countsStatus.textContent = error.message; }
  });

  document.querySelector('#username-form').addEventListener('submit', async event => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const response = await send({type:'larpblox-popup-username', username:document.querySelector('#username').value});
      render(response);
      status.textContent = response.message;
    } catch (error) { showError(error.message); }
    finally { button.disabled = !mode.checked; }
  });

  for (const action of ['connect','disconnect']) document.querySelector(`#${action}-game`).addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try { render(await send({type:'larpblox-popup-game', action})); }
    catch (error) { gameStatus.textContent = error.message; }
    finally { button.disabled = false; }
  });

  initialize().catch(error => showError(error.message));
})();
