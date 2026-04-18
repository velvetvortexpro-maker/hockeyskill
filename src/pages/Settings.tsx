import { useState } from "react";
import { useApp } from "../components/AppContext";
import { todayISO } from "../lib/dates";
import type { Position } from "../types";

const emojiOptions = [
  "🏒", "🥅", "⛸️", "🦍", "🐻", "🦅",
  "🐺", "🦁", "🐉", "🦈", "👑", "⚡",
];

const positions: { value: Position; label: string }[] = [
  { value: "Forward", label: "Forward" },
  { value: "Center", label: "Center" },
  { value: "Back", label: "Back" },
  { value: "Goalie", label: "Goalie" },
];

export function Settings() {
  const { data, updateProfile, reset, addRestDay, removeRestDay, setLanguage } = useApp();
  const [name, setName] = useState(data.profile.name);
  const [position, setPosition] = useState<Position>(data.profile.position);
  const [emoji, setEmoji] = useState(data.profile.emoji);
  const [jersey, setJersey] = useState(data.profile.jerseyNumber);
  const [photoUrl, setPhotoUrl] = useState<string>(data.profile.photoUrl ?? "");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const todayStr = todayISO();
  const isRestToday = data.restDays.includes(todayStr);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhotoUrl(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name: name.trim() || "Spelare",
      position,
      emoji,
      jerseyNumber: Math.max(0, Math.min(99, jersey)),
      photoUrl: photoUrl || undefined,
    });
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  }

  function onReset() {
    if (confirm("Är du säker? All data (sessioner, XP, badges, mål) raderas permanent.")) {
      reset();
      setName("Ny Spelare");
      setPosition("Forward");
      setEmoji("🏒");
      setJersey(99);
    }
  }

  return (
    <div className="py-4 sm:py-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Inställningar</h1>
        <p className="text-white/60 text-sm">Redigera din spelarprofil.</p>
      </div>

      <form onSubmit={save} className="card p-5 space-y-5">
        <div>
          <label className="label" htmlFor="settings-name">Namn</label>
          <input
            id="settings-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
          />
        </div>

        <div>
          <label className="label">Position</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {positions.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPosition(p.value)}
                aria-label={`Välj position ${p.label}`}
                className={`py-2.5 rounded-xl border font-semibold transition
                  ${position === p.value ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/70"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-white/50 mt-1.5">
            Positionen påverkar hur din Overall beräknas.
            {position === "Goalie" && " Goalie-läge aktiverar räddningsprocent istället för tackling."}
          </div>
        </div>

        <div>
          <label className="label">Profilbild</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-ice-800 flex items-center justify-center shrink-0">
              {photoUrl ? (
                <img src={photoUrl} className="w-full h-full object-cover object-top" alt="Profilbild" />
              ) : (
                <span className="text-3xl">{emoji}</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="btn-ghost cursor-pointer text-sm">
                📷 Ladda upp bild
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                  aria-label="Ladda upp profilbild"
                />
              </label>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="block text-xs text-white/40 hover:text-red-400 transition"
                >
                  Ta bort bild
                </button>
              )}
              <p className="text-[11px] text-white/30">Bilden visas på ditt spelarkort.</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-4">
          <div>
            <label className="label">Avatar (emoji)</label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  aria-label={`Välj avatar ${e}`}
                  className={`w-11 h-11 rounded-xl border text-2xl flex items-center justify-center
                    ${emoji === e ? "bg-neon-cyan/20 border-neon-cyan" : "bg-ice-800 border-white/10"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="settings-jersey">Tröjnummer</label>
            <input
              id="settings-jersey"
              type="number"
              className="input max-w-[120px]"
              min={0}
              max={99}
              value={jersey}
              onChange={(e) => setJersey(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          {savedAt && <span className="self-center text-neon-green text-sm">✓ Sparat</span>}
          <button className="btn-primary" type="submit">Spara</button>
        </div>
      </form>

      {/* Language */}
      <div className="card p-5 space-y-3">
        <h2 className="font-display text-xl text-white">Språk</h2>
        <div className="grid grid-cols-2 gap-2 max-w-xs">
          {(["sv", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              aria-label={`Byt språk till ${lang === "sv" ? "Svenska" : "English"}`}
              className={`py-2.5 rounded-xl border font-semibold transition
                ${data.language === lang ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/70"}`}
            >
              {lang === "sv" ? "🇸🇪 Svenska" : "🇬🇧 English"}
            </button>
          ))}
        </div>
        <div className="text-xs text-white/40">
          i18n förberedda. Full översättning aktiveras i nästa version.
        </div>
      </div>

      {/* Rest day */}
      <div className="card p-5 space-y-3">
        <h2 className="font-display text-xl text-white">Vila & återhämtning</h2>
        <p className="text-white/60 text-sm">
          Markera vilodagar — de bryter inte din streak och räknas som aktiv återhämtning.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              isRestToday ? removeRestDay(todayStr) : addRestDay(todayStr)
            }
            className={`px-4 py-2 rounded-xl border font-semibold transition
              ${isRestToday ? "bg-neon-green/20 border-neon-green text-neon-green" : "bg-ice-800 border-white/10 text-white/70"}`}
            aria-label={isRestToday ? "Ta bort dagens vila" : "Markera idag som vilodag"}
          >
            {isRestToday ? "✓ Vilodag markerad" : "🛌 Markera dagens vila"}
          </button>
          {isRestToday && (
            <span className="text-xs text-neon-green">
              Bra jobbat — vila är träning.
            </span>
          )}
        </div>
        {data.restDays.length > 0 && (
          <div className="text-xs text-white/40">
            {data.restDays.length} vilodagar registrerade totalt
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="card p-5 border-red-400/30">
        <h2 className="font-display text-xl text-white">Återställ data</h2>
        <p className="text-white/60 text-sm mt-1">
          Raderar alla sessioner, XP, badges och mål. Går inte att ångra.
        </p>
        <button
          onClick={onReset}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
            bg-red-500/20 text-red-300 border border-red-400/40 hover:bg-red-500/30 transition"
          aria-label="Återställ all data"
        >
          🗑️ Återställ all data
        </button>
      </div>

      <div className="text-center text-xs text-white/40 pb-4">
        Hockey Skills Tracker • byggt med ❤️ • data sparas lokalt i din browser.
      </div>
    </div>
  );
}
