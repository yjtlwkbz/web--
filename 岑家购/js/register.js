const registerForm = document.querySelector('form');
registerForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');

  // 检查密码是否匹配
  if (passwordInput.value !== confirmPasswordInput.value) {
    alert('请输入相同密码');
    return;
  }

  // 检查账号是否存在
  const username = usernameInput.value.trim();
  if (checkAccountExists(username)) {
    alert('该账号已存在，请输入其他账号');
    return;
  }

  // 保存账号和密码
  const accountData = { username, password: passwordInput.value };
  saveAccount(accountData);
});

function checkAccountExists(username) {
  const accountsJSON = localStorage.getItem('accounts');
  if (!accountsJSON) {
    return false;
  }
  const accounts = JSON.parse(accountsJSON);
  return accounts.hasOwnProperty(username);
}

function saveAccount(accountData) {
  const accountsJSON = localStorage.getItem('accounts');
  let accounts = {};
  if (accountsJSON) {
    accounts = JSON.parse(accountsJSON);
  }
  accounts[accountData.username] = accountData.password;
  localStorage.setItem('accounts', JSON.stringify(accounts));
  alert('账号注册成功！');
}
