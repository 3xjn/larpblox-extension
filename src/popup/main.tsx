import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ChevronRightIcon, SettingsIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import "./styles.css";

type PopupState = {
  mode: boolean;
  sharing: boolean;
  balance: number;
  appearance: "classic" | "modern";
  socialCounts: { followers: number; following: number } | null;
  username: string;
  avatarPage: boolean;
  avatarView: "real" | "larp";
  previewStatus: string;
  gameStatus: string;
  message?: string;
};
type Reply = PopupState & { ok: boolean; error?: string };
type Message = { type: string; [key: string]: unknown };
type Notice = { text: string; error?: boolean };

function UpdateSettings() {
  const [result, setResult] = useState<{version?: string; enabled?: boolean; pendingReload?: boolean}>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  async function run(action: string) {
    setBusy(true); setError(false); setNotice("");
    try {
      const reply = await chrome.runtime.sendMessage({type:"larpblox-website-update", action});
      if (!reply?.ok) throw new Error(reply?.error || "Could not check for updates.");
      if (action === "enable") return;
      setResult({...reply, pendingReload: reply.pendingReload ?? reply.updated === true});
      setNotice(reply.enabled === false ? "Enable Allow User Scripts in the extension’s details, then return here." :
        reply.updated === false ? "You’re up to date." : "");
    } catch (failure) { setError(true); setNotice(failure instanceof Error ? failure.message : "Could not check for updates."); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    void run("status");
    const focus = () => void run("status");
    window.addEventListener("focus", focus);
    return () => window.removeEventListener("focus", focus);
  }, []);
  return <section aria-label="Extension settings" className="update-settings">
    <div className="update-heading">
      <h2>Updates</h2>
      {result.version && <span className="update-version" aria-label={`Version ${result.version}`}>v{result.version}</span>}
    </div>
    {result.enabled === false ?
      <Button variant="outline" className="h-10 w-full" disabled={busy} onClick={() => void run("enable")}>Open extension settings</Button> :
      result.pendingReload ?
        <Button className="h-10 w-full" loading={busy} disabled={busy} onClick={() => void run("reload")}>Reload Roblox tabs</Button> :
        <Button variant="outline" className="h-10 w-full" loading={busy} disabled={busy} onClick={() => void run("check")}>Check for updates</Button>}
    {notice && <p role="status" className={error ? "notice error" : "notice"}>{notice}</p>}
  </section>;
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return <Collapsible className="disclosure">
    <CollapsibleTrigger className="disclosure-trigger">
      <span>{title}</span><ChevronRightIcon aria-hidden="true" className="size-4 transition-transform in-data-panel-open:rotate-90" />
    </CollapsibleTrigger>
    <CollapsiblePanel><div className="disclosure-content">{children}</div></CollapsiblePanel>
  </Collapsible>;
}

function Choice({ id, label, value, items, disabled, onChange }: {
  id: string; label: string; value: string; items: { value: string; label: string }[];
  disabled?: boolean; onChange: (value: string) => void;
}) {
  return <div className="field">
    <Label htmlFor={id}>{label}</Label>
    <Select items={items} value={value} onValueChange={next => { if (next !== null) onChange(next); }} disabled={disabled}>
      <SelectTrigger id={id} className="h-10"><SelectValue /></SelectTrigger>
      <SelectPopup alignItemWithTrigger={false}>
        {items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
      </SelectPopup>
    </Select>
  </div>;
}

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [state, setState] = useState<PopupState | null>(null);
  const [pending, setPending] = useState<string | null>("initialize");
  const [notice, setNotice] = useState<Notice>({ text: "Connecting to Roblox…" });
  const [countsNotice, setCountsNotice] = useState<Notice>({ text: "" });
  const [balance, setBalance] = useState("");
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const tabId = useRef<number | undefined>(undefined);
  const mounted = useRef(true);
  const inFlight = useRef(false);

  async function send(message: Message): Promise<PopupState> {
    if (tabId.current === undefined) throw new Error("Open a signed-in Roblox tab first.");
    let response: Reply;
    try { response = await chrome.runtime.sendMessage({type:"larpblox-popup-relay", tabId:tabId.current, message}); }
    catch { throw new Error("Reload your Roblox tab, then reopen Larpblox."); }
    if (!response?.ok) throw new Error(response?.error || "Could not update Larpblox. Reload Roblox and try again.");
    return response;
  }

  function receive(next: PopupState, fields: string[] = []) {
    if (!mounted.current) return;
    setState({ ...next, sharing: next.sharing === true });
    if (fields.includes("balance")) setBalance(String(next.balance));
    if (fields.includes("username")) setUsername(next.username || "");
    if (fields.includes("counts")) {
      setFollowers(next.socialCounts ? String(next.socialCounts.followers) : "");
      setFollowing(next.socialCounts ? String(next.socialCounts.following) : "");
    }
  }

  async function initialize() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending("initialize");
    setNotice({ text: "Connecting to Roblox…" });
    try {
      if (typeof chrome === "undefined" || !chrome.tabs) throw new Error("Open Larpblox from the extension button on a signed-in Roblox tab.");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || !/^https:\/\/www\.roblox\.com\//i.test(tab.url || "")) throw new Error("Open a signed-in Roblox tab to manage your Larp settings.");
      tabId.current = tab.id;
      const next = await send({ type: "larpblox-popup-get-state" });
      receive(next, ["balance", "username", "counts"]);
      if (mounted.current) setNotice({ text: next.message || "" });
    } catch (error) {
      if (mounted.current) setNotice({ text: error instanceof Error ? error.message : "Could not connect to Roblox.", error: true });
    } finally {
      inFlight.current = false;
      if (mounted.current) setPending(null);
    }
  }

  useEffect(() => { mounted.current = true; void initialize(); return () => { mounted.current = false; }; }, []);

  async function act(key: string, message: Message, fields: string[] = [], success?: string, target: "main" | "counts" = "main") {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(key);
    const notify = target === "counts" ? setCountsNotice : setNotice;
    notify({ text: "" });
    try {
      const next = await send(message);
      receive(next, fields);
      if (mounted.current) notify({ text: success || next.message || "" });
    } catch (error) {
      if (mounted.current) notify({ text: error instanceof Error ? error.message : "Could not save this change.", error: true });
    } finally {
      inFlight.current = false;
      if (mounted.current) setPending(null);
    }
  }

  const submit = (event: FormEvent, callback: () => void) => { event.preventDefault(); callback(); };
  const busy = pending !== null;
  const disabled = busy || !state?.mode;
  const status = (value: Notice) => value.text ? <p role="status" className={value.error ? "notice error" : "notice"}>{value.text}</p> : null;

  return <main className={settingsOpen ? "settings-view" : undefined}>
    <header className="popup-header"><img src="assets/larpblox-logo.png" alt="Larpblox" /><h1 className="sr-only">Larpblox</h1>
      <Button variant="ghost" size="icon" className="ml-auto" aria-label={settingsOpen ? "Back to Larpblox" : "Settings"} title={settingsOpen ? "Back" : "Settings"} aria-expanded={settingsOpen} onClick={() => setSettingsOpen(open => !open)}>
        {settingsOpen ? <ArrowLeftIcon aria-hidden="true" /> : <SettingsIcon aria-hidden="true" />}
      </Button>
    </header>
    {settingsOpen ? <UpdateSettings /> : <>
    {status(notice)}
    {!state ? pending === null && <Button variant="outline" className="mt-4 w-full" onClick={() => void initialize()}>Retry connection</Button> : <>
      <section className="mode-section">
        <div className="toggle-row">
          <div><Label htmlFor="larp-mode" className="text-base font-semibold">Larp mode</Label><p className="help">Your avatar, profile, and pretend Robux.</p></div>
          <Switch id="larp-mode" checked={state.mode} disabled={busy} onCheckedChange={mode => void act("mode", { type: "larpblox-popup-update", mode })} />
        </div>
        <div className="sharing-option">
          <div className="toggle-row">
            <div><Label htmlFor="share-mode">Share appearance</Label><p id="sharing-help" className="help">Visible to Larpblox players in your server.</p></div>
            <Switch id="share-mode" checked={state.mode && state.sharing} disabled={disabled} aria-describedby="sharing-help" onCheckedChange={sharing => void act("sharing", { type: "larpblox-popup-update", sharing })} />
          </div>
        </div>
      </section>

      <section className="profile-section">
        <form className="field" onSubmit={event => submit(event, () => void act("balance", { type: "larpblox-popup-update", balance }, ["balance"], "Balance saved."))}>
          <Label htmlFor="balance">Larpbux balance</Label>
          <div className="flex items-center gap-2.5">
            <div className="relative min-w-0 flex-1"><span className="input-prefix" aria-hidden="true">R$</span><Input id="balance" type="number" min="0" step="1" inputMode="numeric" required className="h-10 pl-10" aria-describedby="balance-help" disabled={disabled} value={balance} onChange={event => setBalance(event.target.value)} /></div>
            <Button type="submit" variant="outline" className="h-10 px-4" disabled={disabled} loading={pending === "balance"}>Save</Button>
          </div>
          <p id="balance-help" className="help">Pretend balance only.</p>
        </form>
        <form className="field" onSubmit={event => submit(event, () => void act("username", { type: "larpblox-popup-username", username }, ["username", "balance"]))}>
          <div className="flex items-center justify-between"><Label htmlFor="username">Larp username</Label><span className="help">R$ 1,000</span></div>
          <div className="flex items-center gap-2.5"><Input className="h-10 min-w-0 flex-1" id="username" autoComplete="off" maxLength={20} required disabled={disabled} value={username} onChange={event => setUsername(event.target.value)} aria-describedby="username-help" />
          <Button type="submit" variant="outline" className="h-10 px-4" disabled={disabled} loading={pending === "username"}>Change</Button></div>
          <p id="username-help" className="help">Also updates your Larp display name.</p>
        </form>
      </section>

      {state.avatarPage && state.mode && <section className="section space-y-2.5">
        <Choice id="avatar-view" label="Avatar to edit" value={state.avatarView || "larp"} disabled={busy} items={[{ value: "real", label: "Real avatar" }, { value: "larp", label: "Larp avatar" }]} onChange={view => void act("avatar-view", { type: "larpblox-popup-avatar-view", view })} />
        {state.previewStatus && <><p className="help" role="status">{state.previewStatus}</p><Button variant="outline" disabled={busy} loading={pending === "preview"} onClick={() => void act("preview", { type: "larpblox-popup-avatar-retry" })}>Retry avatar preview</Button></>}
      </section>}

      <Disclosure title="More settings">
        <div className="secondary-group">
        <h2>Profile counts</h2>
        <p className="help">Choose the counts other Larpblox users see while Larp mode is on.</p>
        <form className="space-y-3" onSubmit={event => submit(event, () => void act("counts", { type: "larpblox-popup-profile-counts", socialCounts: { followers, following } }, ["counts"], "Profile counts saved.", "counts"))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="field"><Label htmlFor="followers">Followers</Label><Input id="followers" type="number" min="0" step="1" disabled={disabled} value={followers} onChange={event => setFollowers(event.target.value)} /></div>
            <div className="field"><Label htmlFor="following">Following</Label><Input id="following" type="number" min="0" step="1" disabled={disabled} value={following} onChange={event => setFollowing(event.target.value)} /></div>
          </div>
          <div className="flex flex-wrap gap-2.5"><Button type="submit" disabled={disabled} loading={pending === "counts"}>Save counts</Button><Button type="button" variant="outline" disabled={disabled} loading={pending === "reset-counts"} onClick={() => void act("reset-counts", { type: "larpblox-popup-profile-counts", socialCounts: null }, ["counts"], "Roblox counts restored.", "counts")}>Use Roblox counts</Button></div>
        </form>
        {status(countsNotice)}
        </div>

        <div className="secondary-group space-y-2">
        <Choice id="appearance" label="Website appearance" value={state.appearance} disabled={busy} items={[{ value: "modern", label: "Current Roblox" }, { value: "classic", label: "Classic Roblox (2016)" }]} onChange={appearance => void act("appearance", { type: "larpblox-popup-update", appearance })} />
        <p className="help">Changes how Roblox looks in this browser.</p>
        </div>
      </Disclosure>
    </>}
    </>}
  </main>;
}

createRoot(document.getElementById("root")!).render(<App />);
