// Background Video Unblocker - Popup Local Storage Logic
const enableSwitch = document.getElementById('enableSwitch');

// 读取本地存储，默认开启
chrome.storage.local.get(['bvUnblockEnable'], (res) => {
  const status = res.bvUnblockEnable ?? true;
  enableSwitch.checked = status;
});

// 切换开关，保存到本地存储
enableSwitch.addEventListener('change', () => {
  chrome.storage.local.set({ bvUnblockEnable: enableSwitch.checked });
});