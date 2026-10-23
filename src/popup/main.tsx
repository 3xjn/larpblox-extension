import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ChevronRightIcon, SettingsIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import "./styles.css";

declare global {
  var LarpbloxPopupContext: {
    logo: string; version: string; settingsOpen: boolean; theme: "light" | "dark"; ready: () => void;
    runtime?: {sendMessage: (message: Message) => Promise<any>};
    tabs?: {query: (query: {active?: boolean; currentWindow?: boolean}) => Promise<Array<{id?: number; url?: string}>>};
    userscript?: boolean; openUpdate?: () => void; root?: HTMLElement; container?: HTMLElement;
  } | undefined;
}

type PopupState = {
  mode: boolean;
  sharing: boolean;
  verified: boolean;
  balance: number;
  appearance: "classic" | "modern";
  socialCounts: { followers: number; following: number; friends?: number } | null;
  username: string;
  avatarPage: boolean;
  avatarView: "real" | "larp";
  previewStatus: string;
  gameStatus: string;
  hatCustomization: { equipped: boolean; style: string; name: string };
  message?: string;
};
type Reply = PopupState & { ok: boolean; error?: string };
type Message = { type: string; [key: string]: unknown };
type Notice = { text: string; error?: boolean };

const HAT_STYLES = [
  { value: "auto", label: "Automatic (seasonal)" },
  { value: "normal", label: "Normal" },
  { value: "halloween", label: "Halloween" },
  { value: "thanksgiving", label: "Thanksgiving" },
  { value: "christmas", label: "Christmas" },
  { value: "birthday", label: "Roblox Birthday" },
  { value: "stpatricks", label: "St. Patrick’s Day" },
  { value: "valentines", label: "Valentine’s Day" },
  { value: "aprilfools", label: "April Fools’" },
];

function UpdateSettings() {
  const context = globalThis.LarpbloxPopupContext;
  const [result, setResult] = useState<{version?: string; loaderVersion?:string; enabled?: boolean; pendingReload?: boolean; updateAvailable?: boolean; latestVersion?: string}>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  async function run(action: string) {
    setBusy(true); setError(false); setNotice("");
    try {
      const reply = await (context?.runtime || chrome.runtime).sendMessage({type:"larpblox-website-update", action});
      if (!reply?.ok) throw new Error(reply?.error || "Could not check for updates.");
      if (action === "enable") return;
      setResult({...reply, loaderVersion:reply.loaderVersion || result.loaderVersion, pendingReload: reply.pendingReload ?? reply.updated === true});
      setNotice(context?.userscript ? (reply.updateAvailable ? `Version ${reply.latestVersion} is available.` : "You’re up to date.") : reply.enabled === false ? "Enable Allow User Scripts in the extension’s details, then return here." :
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
  if (context?.userscript) return <section aria-label="Userscript settings" className="update-settings">
    <div className="update-heading"><h2>Userscript</h2></div>
    <p className="notice">Installed version {context.version}</p>
    <Button variant="outline" className="h-10 w-full" loading={busy} disabled={busy} onClick={() => void run("check")}>{busy ? "Checking…" : "Check for updates"}</Button>
    {!busy && !error && result.updateAvailable && context.openUpdate && <Button className="h-10 w-full" onClick={context.openUpdate}>Update userscript</Button>}
    {notice && <p role="status" className={error ? "notice error" : "notice"}>{notice}</p>}
  </section>;
  return <section aria-label="Extension settings" className="update-settings">
    <div className="update-heading">
      <h2>Updates</h2>
    </div>
    <div className="update-versions">
      {result.version && <span className="update-version" aria-label={`Version ${result.version}`}>Website v{result.version}</span>}
      {result.loaderVersion && <span className="update-version">Extension v{result.loaderVersion}</span>}
    </div>
    {result.enabled === false ?
      <Button variant="outline" className="h-10 w-full" disabled={busy} onClick={() => void run("enable")}>Open extension settings</Button> :
      result.pendingReload ?
        <Button className="h-10 w-full" loading={busy} disabled={busy} onClick={() => void run("reload")}>Apply update</Button> :
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
  const [settingsOpen, setSettingsOpen] = useState(globalThis.LarpbloxPopupContext?.settingsOpen === true);
  const [state, setState] = useState<PopupState | null>(null);
  const [pending, setPending] = useState<string | null>("initialize");
  const [notice, setNotice] = useState<Notice>({ text: "Connecting to Roblox…" });
  const [countsNotice, setCountsNotice] = useState<Notice>({ text: "" });
  const [balance, setBalance] = useState("");
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [friends, setFriends] = useState("");
  const tabId = useRef<number | undefined>(undefined);
  const mounted = useRef(true);
  const inFlight = useRef(false);

  async function send(message: Message): Promise<PopupState> {
    if (tabId.current === undefined) throw new Error("Open a signed-in Roblox tab first.");
    let response: Reply;
    try { response = await (globalThis.LarpbloxPopupContext?.runtime || chrome.runtime).sendMessage({type:"larpblox-popup-relay", tabId:tabId.current, message}) as Reply; }
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
      setFriends(next.socialCounts?.friends == null ? "" : String(next.socialCounts.friends));
    }
  }

  async function initialize() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending("initialize");
    setNotice({ text: "Connecting to Roblox…" });
    try {
      const tabs = globalThis.LarpbloxPopupContext?.tabs || globalThis.chrome?.tabs;
      if (!tabs) throw new Error("Open Larpblox from the extension button on a signed-in Roblox tab.");
      const [tab] = await tabs.query({ active: true, currentWindow: true });
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

  useEffect(() => { mounted.current = true; void initialize(); globalThis.LarpbloxPopupContext?.ready(); return () => { mounted.current = false; }; }, []);

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

  // The installed popup sandbox blocks native form submissions. Handle the
  // button click directly, retaining field validation and Enter-key activation.
  const submit = (event: MouseEvent<HTMLButtonElement>, callback: () => void) => {
    event.preventDefault();
    if (event.currentTarget.form?.reportValidity()) callback();
  };
  const busy = pending !== null;
  const disabled = busy || !state?.mode;
  const status = (value: Notice) => value.text ? <p role="status" className={value.error ? "notice error" : "notice"}>{value.text}</p> : null;

  return <main className={settingsOpen ? "settings-view" : undefined} data-popup-version={globalThis.LarpbloxPopupContext?.version}>
    <header className="popup-header"><img src={globalThis.LarpbloxPopupContext?.logo || "assets/larpblox-logo.png"} alt="Larpblox" /><h1 className="sr-only">Larpblox</h1>
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
          <div className="toggle-row mt-3">
            <div><Label htmlFor="verified-mode">Larp verification</Label><p id="verified-help" className="help">Show a cosmetic verified mark beside Larp usernames.</p></div>
            <Switch id="verified-mode" checked={state.mode && state.verified} disabled={disabled} aria-describedby="verified-help" onCheckedChange={verified => void act("verified", { type: "larpblox-popup-update", verified })} />
          </div>
        </div>
      </section>

      <section className="profile-section">
        <form className="field">
          <Label htmlFor="balance">Larpbux balance</Label>
          <div className="flex items-center gap-2.5">
            <div className="relative min-w-0 flex-1"><span className="input-prefix" aria-hidden="true">R$</span><Input id="balance" type="number" min="0" step="1" inputMode="numeric" required className="h-10 pl-10" aria-describedby="balance-help" disabled={disabled} value={balance} onChange={event => setBalance(event.target.value)} /></div>
            <Button type="submit" onClick={event => submit(event, () => void act("balance", { type: "larpblox-popup-update", balance }, ["balance"], "Balance saved."))} variant="outline" className="h-10 px-4" disabled={disabled} loading={pending === "balance"}>Save</Button>
          </div>
          <p id="balance-help" className="help">Pretend balance only.</p>
        </form>
        <form className="field">
          <div className="flex items-center justify-between"><Label htmlFor="username">Larp username</Label><span className="help">R$ 1,000</span></div>
          <div className="flex items-center gap-2.5"><Input className="h-10 min-w-0 flex-1" id="username" autoComplete="off" maxLength={20} required disabled={disabled} value={username} onChange={event => setUsername(event.target.value)} aria-describedby="username-help" />
          <Button type="submit" onClick={event => submit(event, () => void act("username", { type: "larpblox-popup-username", username }, ["username", "balance"]))} variant="outline" className="h-10 px-4" disabled={disabled} loading={pending === "username"}>Change</Button></div>
          <p id="username-help" className="help">Your Larp display name stays separate.</p>
        </form>
      </section>

      {state.avatarPage && state.mode && <section className="section space-y-2.5">
        <Choice id="avatar-view" label="Avatar to edit" value={state.avatarView || "larp"} disabled={busy} items={[{ value: "real", label: "Real avatar" }, { value: "larp", label: "Larp avatar" }]} onChange={view => void act("avatar-view", { type: "larpblox-popup-avatar-view", view })} />
        {state.previewStatus && <><p className="help" role="status">{state.previewStatus}</p><Button variant="outline" disabled={busy} loading={pending === "preview"} onClick={() => void act("preview", { type: "larpblox-popup-avatar-retry" })}>Retry avatar preview</Button></>}

      </section>}

      {state.mode && <section className="section"><Button variant="outline" disabled={busy} loading={pending === "preview-details"} onClick={() => void act("preview-details", { type: "larpblox-popup-avatar-details" }, [], "Preview details saved. Attach larpblox-preview-details.json in our chat.")}>Save preview details</Button></section>}

      <Disclosure title="More settings">
        <div className="secondary-group">
        <h2>Hat customization</h2>
        <p className="help">Choose a saved style for your supported hat.</p>
        <Choice
          id="hat"
          label="Hat"
          value="smokestack"
          items={[{ value: "smokestack", label: state.hatCustomization?.name || "Rbadam Smokestack" }]}
          disabled={busy}
          onChange={() => undefined}
        />
        <Choice
          id="hat-style"
          label="Hat style"
          value={state.hatCustomization?.style || "auto"}
          items={HAT_STYLES}
          disabled={disabled || !state.hatCustomization?.equipped}
          onChange={style => void act("hat-style", { type: "larpblox-popup-hat-style", style }, [], "Hat style saved.")}
        />
        {!state.hatCustomization?.equipped && <p className="help">Wear Rbadam Smokestack to choose its saved style.</p>}
        </div>

        <div className="secondary-group">
        <h2>Profile counts</h2>
        <p className="help">Choose the counts other Larpblox users see while Larp mode is on.</p>
        <form className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="field"><Label htmlFor="followers">Followers</Label><Input id="followers" type="number" min="0" step="1" disabled={disabled} value={followers} onChange={event => setFollowers(event.target.value)} /></div>
            <div className="field"><Label htmlFor="following">Following</Label><Input id="following" type="number" min="0" step="1" disabled={disabled} value={following} onChange={event => setFollowing(event.target.value)} /></div>
            <div className="field"><Label htmlFor="friends">Friends</Label><Input id="friends" type="number" min="0" max="1000" step="1" placeholder="Roblox count" disabled={disabled} value={friends} onChange={event => setFriends(event.target.value)} /><p className="help">Up to 1,000. Leave blank to use Roblox’s count.</p></div>
          </div>
          <div className="flex flex-wrap gap-2.5"><Button type="submit" onClick={event => submit(event, () => void act("counts", { type: "larpblox-popup-profile-counts", socialCounts: { followers, following, friends } }, ["counts"], "Profile counts saved.", "counts"))} disabled={disabled} loading={pending === "counts"}>Save counts</Button><Button type="button" variant="outline" disabled={disabled} loading={pending === "reset-counts"} onClick={() => void act("reset-counts", { type: "larpblox-popup-profile-counts", socialCounts: null }, ["counts"], "Roblox counts restored.", "counts")}>Use Roblox counts</Button></div>
        </form>
        {status(countsNotice)}
        </div>

      </Disclosure>
    </>}
    </>}
  </main>;
}

export function renderUserscriptPopup(root: HTMLElement, context: NonNullable<typeof globalThis.LarpbloxPopupContext>) {
  globalThis.LarpbloxPopupContext = {...context, root, container: context.container || root};
  return createRoot(root).render(<App />);
}

if (!globalThis.LarpbloxPopupContext?.root) createRoot(document.getElementById("root")!).render(<App />);
