(() => {
  const status = document.querySelector('#status');
  const controls = document.querySelector('#controls');
  const mode = document.querySelector('#larp-mode');
  const balance = document.querySelector('#balance');
  const appearance = document.querySelector('#appearance');
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
    balance.disabled = !state.mode;
    saveButton.disabled = !state.mode;
    status.textContent = state.mode ? 'Larp mode is on.' : 'Larp mode is off.';
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

  initialize().catch(error => showError(error.message));
})();
