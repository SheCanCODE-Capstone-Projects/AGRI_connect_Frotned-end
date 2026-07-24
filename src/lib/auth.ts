export type Account = {
  cooperativeName: string;
  email: string;
  password: string;
};

const ACCOUNTS_KEY = "agriconnect_accounts";
const SESSION_KEY = "agriconnect_session";

// Demo account — always available, no registration needed
const DEMO_ACCOUNT: Account = {
  cooperativeName: "Green Valley Cooperative",
  email: "demo@coop.rw",
  password: "demo1234",
};

const isBrowser = () => typeof window !== "undefined";

function getAccounts(): Account[] {
  if (!isBrowser()) return [DEMO_ACCOUNT];

  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as Account[];
    // Always include the demo account even if localStorage is empty/cleared
    const hasDemo = stored.some((a) => a.email === DEMO_ACCOUNT.email);
    return hasDemo ? stored : [DEMO_ACCOUNT, ...stored];
  } catch {
    return [DEMO_ACCOUNT];
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerAccount(account: Account): { ok: boolean; message?: string } {
  const accounts = getAccounts();
  const email = account.email.trim().toLowerCase();

  if (accounts.some((item) => item.email === email)) {
    return { ok: false, message: "An account already exists for this email address." };
  }

  saveAccounts([...accounts, { ...account, cooperativeName: account.cooperativeName.trim(), email }]);
  return { ok: true };
}

export function signIn(email: string, password: string) {
  const account = getAccounts().find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password
  );

  if (!account) return { ok: false, message: "Incorrect email or password." };
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email }));
  return { ok: true };
}

export function isAuthenticated() {
  if (!isBrowser()) return false;
  return Boolean(localStorage.getItem(SESSION_KEY));
}

export function signOut() {
  if (isBrowser()) localStorage.removeItem(SESSION_KEY);
}

export function getCurrentAccount(): Account | null {
  if (!isBrowser()) return null;
  const sessionRaw = localStorage.getItem(SESSION_KEY);
  if (!sessionRaw) return null;
  
  try {
    const session = JSON.parse(sessionRaw);
    const accounts = getAccounts();
    return accounts.find(a => a.email === session.email) || null;
  } catch {
    return null;
  }
}

export function resetPassword(email: string, password: string) {
  const accounts = getAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const index = accounts.findIndex((account) => account.email === normalizedEmail);

  if (index === -1) return { ok: false, message: "No account was found for that email address." };
  accounts[index] = { ...accounts[index], password };
  saveAccounts(accounts);
  return { ok: true };
}
