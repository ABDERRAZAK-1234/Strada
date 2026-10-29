const SEED_ACCOUNTS = {
  admin: { email: 'admin@strada.test', password: 'Passw0rd!' },
  agent: { email: 'agent@strada.test', password: 'Passw0rd!' },
  passenger1: { email: 'passenger1@strada.test', password: 'Passw0rd!' },
  passenger2: { email: 'passenger2@strada.test', password: 'Passw0rd!' },
};

async function loginAs(api, role) {
  const response = await api.post('/api/v1/auth/login').send(SEED_ACCOUNTS[role]);

  if (response.status !== 200) {
    throw new Error(
      'Login as ' + role + ' failed with status ' + response.status + ': ' + JSON.stringify(response.body)
    );
  }

  return response.body.data.accessToken;
}

async function loginAll(api) {
  const tokens = {};
  const roles = Object.keys(SEED_ACCOUNTS);

  for (const role of roles) {
    tokens[role] = await loginAs(api, role);
  }

  return tokens;
}

function authHeader(token) {
  return { Authorization: 'Bearer ' + token };
}
export   { SEED_ACCOUNTS, loginAs, loginAll, authHeader };
