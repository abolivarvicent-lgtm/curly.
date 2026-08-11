import React, { useState, useEffect, useCallback } from "react";
import {
  Droplets, Sparkles, Scissors, Check, ChevronRight, ChevronLeft,
  Trash2, User, BookOpen, Home as HomeIcon, Plus, X, Flame,
  Sun, Wind, CircleDot, Loader2, Pencil
} from "lucide-react";
import { storage } from "./storage";
import { BRANDS, PRODUCTS, curlGroup, productsForCategory, recommendedProducts, brandById } from "./products";

/* ---------------------------------------------------------
   THEME — apothecary-warm, not the cream+terracotta default.
--------------------------------------------------------- */
const T = {
  bg: "#FBF6EE",
  surface: "#FFFFFF",
  surfaceSunk: "#F3EADA",
  ink: "#33241A",
  inkSoft: "#6E5A4C",
  line: "#E7DAC5",
  amber: "#D98E3F",
  amberDeep: "#B8722A",
  teal: "#2F6E68",
  tealDeep: "#204E4A",
  coral: "#E07856",
  cream: "#F5EBDD",
};

const display = { fontFamily: "'Fraunces', serif" };
const body = { fontFamily: "'Inter', sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

function CurlGlyph({ tightness = 1, size = 40, color = T.ink, strokeWidth = 2.4 }) {
  const loops = 1 + Math.round(tightness * 3);
  const amp = 10 - tightness * 5.5;
  const w = size, h = size;
  let d = `M ${w * 0.18} ${h * 0.15}`;
  const steps = 60;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const y = h * 0.15 + t * h * 0.72;
    const x = w * 0.5 + Math.sin(t * Math.PI * loops * 2) * amp * (0.5 + t * 0.6);
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BrandTile({ brand, size = 44 }) {
  const initials = brand.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{ background: brand.color, width: size, height: size, minWidth: size }}
      className="rounded-xl flex items-center justify-center"
    >
      <span style={{ ...mono, color: "#fff", fontSize: size * 0.32, fontWeight: 500 }}>{initials}</span>
    </div>
  );
}

function ProductCard({ product, selected, recommended, onClick }) {
  const brand = brandById(product.brand);
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? T.teal : T.surface,
        border: `1.5px solid ${selected ? T.teal : T.line}`,
      }}
      className="rounded-2xl p-3 flex items-center gap-3 text-left w-full transition"
    >
      {product.image ? (
        <img src={product.image} alt="" style={{ width: 44, height: 44, objectFit: "cover" }} className="rounded-xl" />
      ) : (
        <BrandTile brand={brand} />
      )}
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 13, fontWeight: 500, color: selected ? "#fff" : T.ink }} className="leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span style={{ ...mono, fontSize: 10, color: selected ? "#fff" : T.inkSoft, opacity: selected ? 0.85 : 1 }}>
            {brand?.name}
          </span>
          {recommended && (
            <span
              style={{ background: selected ? "rgba(255,255,255,0.2)" : T.surfaceSunk, color: selected ? "#fff" : T.amberDeep }}
              className="text-[10px] rounded-full px-1.5 py-0.5"
            >
              For your curl type
            </span>
          )}
        </div>
      </div>
      {selected && <Check size={16} color="#fff" />}
    </button>
  );
}

function ProductPicker({ category, hairType, selectedNames, onToggle }) {
  const [activeBrand, setActiveBrand] = useState(BRANDS[0].id);
  const [customDraft, setCustomDraft] = useState("");
  const group = curlGroup(hairType);
  const categoryProducts = productsForCategory(category);
  const brandsWithProducts = BRANDS.filter((b) => categoryProducts.some((p) => p.brand === b.id));
  const visible = categoryProducts.filter((p) => p.brand === activeBrand);

  useEffect(() => {
    if (brandsWithProducts.length && !brandsWithProducts.find((b) => b.id === activeBrand)) {
      setActiveBrand(brandsWithProducts[0].id);
    }
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-1 -mx-6 px-6" style={{ scrollbarWidth: "none" }}>
        {brandsWithProducts.map((b) => {
          const active = activeBrand === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBrand(b.id)}
              style={{
                background: active ? T.ink : T.surface,
                border: `1.5px solid ${active ? T.ink : T.line}`,
                color: active ? T.cream : T.ink,
                whiteSpace: "nowrap",
              }}
              className="rounded-full px-3.5 py-2 text-xs font-medium transition flex-shrink-0"
            >
              {b.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            selected={selectedNames.includes(p.name)}
            recommended={group ? p.curlTypes.includes(group) : false}
            onClick={() => onToggle(p.name)}
          />
        ))}
        {visible.length === 0 && (
          <p style={{ color: T.inkSoft, fontSize: 12.5 }} className="py-2">No products listed for this brand yet.</p>
        )}
      </div>

      <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">
        CAN'T FIND IT? ADD YOUR OWN
      </label>
      <div className="flex gap-2">
        <input
          value={customDraft}
          onChange={(e) => setCustomDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customDraft.trim()) {
              onToggle(customDraft.trim());
              setCustomDraft("");
            }
          }}
          placeholder="Product name"
          style={{ background: T.surface, border: `1.5px solid ${T.line}`, color: T.ink }}
          className="flex-1 rounded-2xl px-4 py-3 outline-none text-sm"
        />
        <button
          onClick={() => {
            if (customDraft.trim()) {
              onToggle(customDraft.trim());
              setCustomDraft("");
            }
          }}
          style={{ background: T.ink, color: T.cream }}
          className="rounded-2xl px-4"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

function WaveDivider({ color = T.line, height = 10 }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 200 10" preserveAspectRatio="none" style={{ display: "block" }}>
      <path
        d="M0 5 Q 5 0, 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5 T 110 5 T 120 5 T 130 5 T 140 5 T 150 5 T 160 5 T 170 5 T 180 5 T 190 5 T 200 5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

const CURL_TYPES = [
  { id: "2A", label: "Wavy", desc: "Fine, loose S-waves", t: 0.05 },
  { id: "2B", label: "Wavy", desc: "Defined waves, some frizz", t: 0.12 },
  { id: "2C", label: "Wavy", desc: "Strong waves, near curl", t: 0.2 },
  { id: "3A", label: "Curly", desc: "Loose, springy loops", t: 0.35 },
  { id: "3B", label: "Curly", desc: "Springy ringlets", t: 0.48 },
  { id: "3C", label: "Curly", desc: "Tight corkscrews", t: 0.6 },
  { id: "4A", label: "Coily", desc: "Springy, S-shaped coils", t: 0.72 },
  { id: "4B", label: "Coily", desc: "Z-shaped, less defined", t: 0.85 },
  { id: "4C", label: "Coily", desc: "Tightly coiled, most shrinkage", t: 1 },
];
const POROSITY = ["Low", "Medium", "High", "Not sure"];

const ACTIVITIES = [
  { id: "shampoo", label: "Shampoo", icon: Droplets, needsProduct: true },
  { id: "cowash", label: "Co-wash", icon: Droplets, needsProduct: true },
  { id: "conditioner", label: "Conditioner", icon: Droplets, needsProduct: true },
  { id: "deepcondition", label: "Deep condition", icon: Sparkles, needsProduct: true },
  { id: "leavein", label: "Leave-in", icon: Sparkles, needsProduct: true },
  { id: "styler", label: "Styling product", icon: Wind, needsProduct: true },
  { id: "oil", label: "Oil / scalp treatment", icon: Sun, needsProduct: true },
  { id: "protective", label: "Protective style", icon: CircleDot, needsProduct: false },
  { id: "detangle", label: "Detangled", icon: CircleDot, needsProduct: false },
  { id: "trim", label: "Trim", icon: Scissors, needsProduct: false },
  { id: "other", label: "Something else", icon: Plus, needsProduct: true },
];

const FEELINGS = [
  "Defined & bouncy", "Soft", "Great volume", "Frizzy",
  "Dry", "Greasy", "Tangled", "Itchy scalp", "Flat", "Other",
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function prettyDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function computeStreak(diary) {
  const dates = new Set(diary.map((e) => e.date));
  let streak = 0;
  let cur = new Date();
  while (true) {
    const ds = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    if (dates.has(ds)) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  return streak;
}

/* ===========================================================
   MAIN APP
=========================================================== */
export default function App() {
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [diary, setDiary] = useState([]);
  const [screen, setScreen] = useState("home");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let p = null, d = [];
        try {
          const r = await storage.get("profile");
          if (r) p = JSON.parse(r.value);
        } catch (_) {}
        try {
          const r = await storage.get("diary");
          if (r) d = JSON.parse(r.value);
        } catch (_) {}
        setProfile(p);
        setDiary(Array.isArray(d) ? d : []);
      } catch (e) {
        setStorageError(true);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const saveProfile = useCallback(async (p) => {
    setSaving(true);
    try {
      await storage.set("profile", JSON.stringify(p));
      setProfile(p);
    } catch (e) {
      setStorageError(true);
    } finally {
      setSaving(false);
    }
  }, []);

  const saveDiary = useCallback(async (nextDiary) => {
    setSaving(true);
    try {
      await storage.set("diary", JSON.stringify(nextDiary));
      setDiary(nextDiary);
    } catch (e) {
      setStorageError(true);
    } finally {
      setSaving(false);
    }
  }, []);

  const upsertEntry = useCallback(
    (entry) => {
      const next = diary.filter((e) => e.date !== entry.date);
      next.push(entry);
      next.sort((a, b) => (a.date < b.date ? 1 : -1));
      return saveDiary(next);
    },
    [diary, saveDiary]
  );

  const deleteEntry = useCallback(
    (date) => {
      const next = diary.filter((e) => e.date !== date);
      return saveDiary(next);
    },
    [diary, saveDiary]
  );

  const resetAll = useCallback(async () => {
    setSaving(true);
    try {
      await storage.delete("profile").catch(() => {});
      await storage.delete("diary").catch(() => {});
      setProfile(null);
      setDiary([]);
      setScreen("home");
    } finally {
      setSaving(false);
    }
  }, []);

  if (!ready) {
    return (
      <div style={{ ...body, background: T.bg }} className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" color={T.amberDeep} size={28} />
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onDone={saveProfile} saving={saving} error={storageError} />;
  }

  const todayEntry = diary.find((e) => e.date === todayStr());
  const streak = computeStreak(diary);

  return (
    <div style={{ ...body, background: T.bg, color: T.ink }} className="min-h-screen flex flex-col">
      <div className="flex-1 pb-24 max-w-md mx-auto w-full">
        {screen === "home" && (
          <Home
            profile={profile}
            diary={diary}
            todayEntry={todayEntry}
            streak={streak}
            onLog={() => setScreen("log")}
            onOpenDiary={() => setScreen("diary")}
          />
        )}
        {screen === "diary" && (
          <DiaryList diary={diary} onDelete={deleteEntry} onEdit={() => setScreen("log")} />
        )}
        {screen === "profile" && (
          <ProfileScreen profile={profile} onSave={saveProfile} onReset={resetAll} saving={saving} />
        )}
        {screen === "log" && (
          <LogFlow
            initialEntry={todayEntry}
            profile={profile}
            onCancel={() => setScreen("home")}
            onSave={async (entry) => {
              await upsertEntry(entry);
              setScreen("home");
            }}
          />
        )}
      </div>

      {screen !== "log" && <BottomNav screen={screen} setScreen={setScreen} />}

      {storageError && (
        <div
          style={{ background: T.coral, color: "#fff" }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm shadow-lg"
        >
          Couldn't save — check your device storage isn't full.
        </div>
      )}
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "home", label: "Today", icon: HomeIcon },
    { id: "diary", label: "Diary", icon: BookOpen },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div
      style={{ background: T.surface, borderTop: `1px solid ${T.line}` }}
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
    >
      <div className="flex">
        {items.map((it) => {
          const active = screen === it.id;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => setScreen(it.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3"
              style={{ color: active ? T.amberDeep : T.inkSoft }}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span style={{ ...mono, fontSize: 10, letterSpacing: 0.5 }}>{it.label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Onboarding({ onDone, saving, error }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [hairType, setHairType] = useState(null);
  const [porosity, setPorosity] = useState(null);

  const canNext0 = name.trim().length > 0 && String(age).trim().length > 0;

  return (
    <div style={{ ...body, background: T.bg, color: T.ink }} className="min-h-screen flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col px-6 pt-14 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <CurlGlyph tightness={0.85} size={34} color={T.amberDeep} />
          <h1 style={{ ...display, fontSize: 26, fontWeight: 600 }}>Curl Diary</h1>
        </div>
        <p style={{ color: T.inkSoft, fontSize: 14 }} className="mb-8">
          A wash-day journal built around your curl pattern.
        </p>

        {step === 0 && (
          <div className="flex flex-col gap-5 flex-1">
            <div>
              <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">YOUR NAME</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amara"
                style={{ background: T.surface, border: `1.5px solid ${T.line}`, color: T.ink }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-base"
              />
            </div>
            <div>
              <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">AGE</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 22"
                inputMode="numeric"
                style={{ background: T.surface, border: `1.5px solid ${T.line}`, color: T.ink }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-base"
              />
            </div>
            <div className="flex-1" />
            <button
              disabled={!canNext0}
              onClick={() => setStep(1)}
              style={{ background: canNext0 ? T.ink : T.line, color: canNext0 ? T.cream : T.inkSoft }}
              className="w-full rounded-full py-3.5 font-medium flex items-center justify-center gap-2 transition"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5 flex-1">
            <div>
              <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-1 tracking-wide">YOUR CURL TYPE</label>
              <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-4">
                Tap the pattern closest to yours — loops get tighter from 2A to 4C.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {CURL_TYPES.map((c) => {
                const active = hairType === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setHairType(c.id)}
                    style={{ background: active ? T.ink : T.surface, border: `1.5px solid ${active ? T.ink : T.line}` }}
                    className="rounded-2xl py-3 flex flex-col items-center gap-1.5 transition"
                  >
                    <CurlGlyph tightness={c.t} size={30} color={active ? T.cream : T.amberDeep} strokeWidth={2.2} />
                    <span style={{ ...mono, fontSize: 12, color: active ? T.cream : T.ink }}>{c.id}</span>
                  </button>
                );
              })}
            </div>
            {hairType && (
              <p style={{ color: T.inkSoft, fontSize: 13 }} className="text-center">
                {CURL_TYPES.find((c) => c.id === hairType).label} — {CURL_TYPES.find((c) => c.id === hairType).desc}
              </p>
            )}
            <div className="flex-1" />
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} style={{ border: `1.5px solid ${T.line}`, color: T.ink }} className="rounded-full px-5 py-3.5">
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!hairType}
                onClick={() => setStep(2)}
                style={{ background: hairType ? T.ink : T.line, color: hairType ? T.cream : T.inkSoft }}
                className="flex-1 rounded-full py-3.5 font-medium flex items-center justify-center gap-2 transition"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 flex-1">
            <div>
              <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-1 tracking-wide">POROSITY</label>
              <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-4">
                How fast does your hair absorb (and lose) moisture?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {POROSITY.map((p) => {
                const active = porosity === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPorosity(p)}
                    style={{ background: active ? T.teal : T.surface, border: `1.5px solid ${active ? T.teal : T.line}`, color: active ? "#fff" : T.ink }}
                    className="rounded-2xl py-3.5 font-medium transition"
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <div className="flex-1" />
            {error && (
              <p style={{ color: T.coral, fontSize: 12 }} className="text-center">
                Storage hiccup — you can still continue, we'll retry saving.
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} style={{ border: `1.5px solid ${T.line}`, color: T.ink }} className="rounded-full px-5 py-3.5">
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!porosity || saving}
                onClick={() => onDone({ name: name.trim(), age: Number(age), hairType, porosity })}
                style={{ background: porosity ? T.ink : T.line, color: porosity ? T.cream : T.inkSoft }}
                className="flex-1 rounded-full py-3.5 font-medium flex items-center justify-center gap-2 transition"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <>Create profile <Check size={18} /></>}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-1.5 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ background: i === step ? T.amberDeep : T.line, width: i === step ? 18 : 6 }} className="h-1.5 rounded-full transition-all" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Home({ profile, diary, todayEntry, streak, onLog, onOpenDiary }) {
  const curl = CURL_TYPES.find((c) => c.id === profile.hairType);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <div className="px-6 pt-12">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="tracking-wide">{greeting.toUpperCase()}</p>
          <h1 style={{ ...display, fontSize: 28, fontWeight: 600 }}>{profile.name}</h1>
        </div>
        <div style={{ background: T.surface, border: `1.5px solid ${T.line}` }} className="rounded-2xl px-3 py-2 flex flex-col items-center">
          <CurlGlyph tightness={curl?.t ?? 0.3} size={22} color={T.amberDeep} strokeWidth={2} />
          <span style={{ ...mono, fontSize: 10, color: T.inkSoft }}>{profile.hairType}</span>
        </div>
      </div>

      <div className="my-5"><WaveDivider /></div>

      {streak > 0 && (
        <div className="flex items-center gap-2 mb-5" style={{ color: T.amberDeep }}>
          <Flame size={16} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{streak} day{streak > 1 ? "s" : ""} logged in a row</span>
        </div>
      )}

      {!todayEntry ? (
        <button
          onClick={onLog}
          style={{ background: T.ink, color: T.cream }}
          className="w-full rounded-3xl p-6 flex items-center justify-between mb-6 transition active:scale-[0.99]"
        >
          <div className="text-left">
            <p style={{ ...display, fontSize: 20, fontWeight: 600 }}>Log today's hair day</p>
            <p style={{ color: T.cream, opacity: 0.75, fontSize: 13 }} className="mt-1">What did you do today?</p>
          </div>
          <Plus size={22} />
        </button>
      ) : (
        <div style={{ background: T.surface, border: `1.5px solid ${T.line}` }} className="rounded-3xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p style={{ ...mono, fontSize: 11, color: T.teal }} className="tracking-wide">TODAY, LOGGED</p>
            <button onClick={onLog} style={{ color: T.amberDeep }} className="flex items-center gap-1 text-sm font-medium">
              <Pencil size={13} /> Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {todayEntry.activities.map((a) => {
              const act = ACTIVITIES.find((x) => x.id === a);
              return (
                <span key={a} style={{ background: T.surfaceSunk, color: T.ink }} className="text-xs rounded-full px-3 py-1">
                  {act?.label || a}
                </span>
              );
            })}
          </div>
          {todayEntry.feeling && (
            <p style={{ color: T.inkSoft, fontSize: 13 }}>Hair felt: <b style={{ color: T.ink }}>{todayEntry.feeling}</b></p>
          )}
        </div>
      )}

      <RecommendedStrip hairType={profile.hairType} />

      <button onClick={onOpenDiary} className="w-full flex items-center justify-between py-4" style={{ borderTop: `1px solid ${T.line}` }}>
        <span style={{ ...display, fontSize: 16, fontWeight: 500 }}>
          {diary.length === 0 ? "No entries yet" : `${diary.length} ${diary.length === 1 ? "entry" : "entries"} in your diary`}
        </span>
        <ChevronRight size={18} color={T.inkSoft} />
      </button>
    </div>
  );
}

function RecommendedStrip({ hairType }) {
  const curl = CURL_TYPES.find((c) => c.id === hairType);
  const recs = recommendedProducts(hairType, 8);
  if (recs.length === 0) return null;
  return (
    <div className="mb-6">
      <p style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="tracking-wide mb-3">
        RECOMMENDED FOR {hairType} {curl ? `(${curl.label.toUpperCase()})` : ""}
      </p>
      <div className="flex gap-3 overflow-x-auto -mx-6 px-6 pb-1" style={{ scrollbarWidth: "none" }}>
        {recs.map((p) => {
          const brand = brandById(p.brand);
          return (
            <div
              key={p.id}
              style={{ background: T.surface, border: `1.5px solid ${T.line}`, width: 148 }}
              className="rounded-2xl p-3 flex-shrink-0"
            >
              <BrandTile brand={brand} size={36} />
              <p style={{ fontSize: 12.5, fontWeight: 500, color: T.ink }} className="leading-snug mt-2.5 mb-1">
                {p.name}
              </p>
              <p style={{ ...mono, fontSize: 10, color: T.inkSoft }}>{brand?.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LogFlow({ initialEntry, profile, onCancel, onSave }) {
  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState(initialEntry?.activities || []);
  const [products, setProducts] = useState(initialEntry?.products || {});
  const [feeling, setFeeling] = useState(initialEntry?.feeling || "");
  const [notes, setNotes] = useState(initialEntry?.notes || "");
  const [busy, setBusy] = useState(false);

  const productSteps = ACTIVITIES.filter((a) => activities.includes(a.id) && a.needsProduct);
  const totalSteps = 2 + productSteps.length;

  const toggleActivity = (id) => {
    setActivities((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const toggleProduct = (activityId, name) => {
    setProducts((cur) => {
      const list = cur[activityId] || [];
      const exists = list.includes(name);
      return { ...cur, [activityId]: exists ? list.filter((n) => n !== name) : [...list, name] };
    });
  };

  const isLast = step === totalSteps - 1;
  const currentProductActivity = step >= 1 && step <= productSteps.length ? productSteps[step - 1] : null;

  const goNext = () => {
    if (isLast) handleSave();
    else setStep((s) => s + 1);
  };

  const handleSave = async () => {
    setBusy(true);
    const entry = {
      id: initialEntry?.id || `${Date.now()}`,
      date: initialEntry?.date || todayStr(),
      activities,
      products,
      feeling,
      notes,
      createdAt: new Date().toISOString(),
    };
    await onSave(entry);
    setBusy(false);
  };

  return (
    <div className="px-6 pt-10 min-h-screen flex flex-col" style={{ ...body, color: T.ink }}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} style={{ color: T.inkSoft }}><X size={22} /></button>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{ background: i <= step ? T.amberDeep : T.line, width: i === step ? 16 : 6 }} className="h-1.5 rounded-full transition-all" />
          ))}
        </div>
        <div style={{ width: 22 }} />
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col">
          <h2 style={{ ...display, fontSize: 24, fontWeight: 600 }} className="mb-1">What did you do today?</h2>
          <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-6">Select everything that applies.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ACTIVITIES.map((a) => {
              const active = activities.includes(a.id);
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => toggleActivity(a.id)}
                  style={{ background: active ? T.teal : T.surface, border: `1.5px solid ${active ? T.teal : T.line}`, color: active ? "#fff" : T.ink }}
                  className="rounded-2xl p-4 flex flex-col items-start gap-3 transition text-left"
                >
                  <Icon size={18} />
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentProductActivity && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          <h2 style={{ ...display, fontSize: 24, fontWeight: 600 }} className="mb-1">
            Which {currentProductActivity.label.toLowerCase()} did you use?
          </h2>
          <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-4">Browse by brand, or add your own below.</p>
          <ProductPicker
            category={currentProductActivity.id}
            hairType={profile?.hairType}
            selectedNames={products[currentProductActivity.id] || []}
            onToggle={(name) => toggleProduct(currentProductActivity.id, name)}
          />
        </div>
      )}

      {step === totalSteps - 1 && (
        <div className="flex-1 flex flex-col">
          <h2 style={{ ...display, fontSize: 24, fontWeight: 600 }} className="mb-1">How did your hair feel?</h2>
          <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-5">Pick what fits best.</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {FEELINGS.map((f) => {
              const active = feeling === f;
              return (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  style={{ background: active ? T.coral : T.surface, border: `1.5px solid ${active ? T.coral : T.line}`, color: active ? "#fff" : T.ink }}
                  className="rounded-full px-4 py-2 text-sm transition"
                >
                  {f}
                </button>
              );
            })}
          </div>
          <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">NOTES (OPTIONAL)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else worth remembering about today..."
            rows={4}
            style={{ background: T.surface, border: `1.5px solid ${T.line}`, color: T.ink }}
            className="w-full rounded-2xl px-4 py-3 outline-none text-sm resize-none"
          />
        </div>
      )}

      <div className="flex gap-3 mt-6 mb-4">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} style={{ border: `1.5px solid ${T.line}`, color: T.ink }} className="rounded-full px-5 py-3.5">
            <ChevronLeft size={18} />
          </button>
        )}
        <button
          onClick={goNext}
          disabled={(step === 0 && activities.length === 0) || busy}
          style={{ background: step === 0 && activities.length === 0 ? T.line : T.ink, color: step === 0 && activities.length === 0 ? T.inkSoft : T.cream }}
          className="flex-1 rounded-full py-3.5 font-medium flex items-center justify-center gap-2 transition"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : isLast ? <>Save entry <Check size={18} /></> : <>Continue <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
}

function DiaryList({ diary, onDelete, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (diary.length === 0) {
    return (
      <div className="px-6 pt-16 flex flex-col items-center text-center">
        <CurlGlyph tightness={0.5} size={44} color={T.line} />
        <h2 style={{ ...display, fontSize: 20, fontWeight: 600 }} className="mt-4 mb-1">Nothing here yet</h2>
        <p style={{ color: T.inkSoft, fontSize: 13.5 }}>Your wash-day entries will show up here once you start logging.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12">
      <h1 style={{ ...display, fontSize: 26, fontWeight: 600 }} className="mb-1">Your Diary</h1>
      <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-6">{diary.length} entries</p>

      <div className="flex flex-col gap-4">
        {diary.map((entry) => (
          <div key={entry.date} style={{ background: T.surface, border: `1.5px solid ${T.line}` }} className="rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span style={{ ...mono, fontSize: 11.5, color: T.teal }} className="tracking-wide">
                {prettyDate(entry.date).toUpperCase()}{entry.date === todayStr() ? " · TODAY" : ""}
              </span>
              <div className="flex items-center gap-3">
                {entry.date === todayStr() && (
                  <button onClick={onEdit} style={{ color: T.amberDeep }}><Pencil size={14} /></button>
                )}
                {confirmDelete === entry.date ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => onDelete(entry.date)} style={{ color: T.coral, fontSize: 11 }} className="font-medium">Delete</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ color: T.inkSoft, fontSize: 11 }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(entry.date)} style={{ color: T.inkSoft }}><Trash2 size={14} /></button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {entry.activities.map((a) => {
                const act = ACTIVITIES.find((x) => x.id === a);
                return (
                  <span key={a} style={{ background: T.surfaceSunk }} className="text-xs rounded-full px-2.5 py-1">
                    {act?.label || a}
                  </span>
                );
              })}
            </div>

            {entry.products && Object.keys(entry.products).some((k) => entry.products[k]?.length) && (
              <div style={{ color: T.inkSoft, fontSize: 12.5 }} className="mb-1.5 leading-relaxed">
                {Object.entries(entry.products)
                  .filter(([, v]) => v?.length)
                  .map(([k, v]) => `${ACTIVITIES.find((a) => a.id === k)?.label || k}: ${v.join(", ")}`)
                  .join(" · ")}
              </div>
            )}

            {entry.feeling && <p style={{ fontSize: 13 }}>Felt: <b>{entry.feeling}</b></p>}
            {entry.notes && <p style={{ color: T.inkSoft, fontSize: 12.5 }} className="mt-1.5 italic">"{entry.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ profile, onSave, onReset, saving }) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [hairType, setHairType] = useState(profile.hairType);
  const [porosity, setPorosity] = useState(profile.porosity);
  const [confirmReset, setConfirmReset] = useState(false);
  const [dirty, setDirty] = useState(false);

  const update = (setter) => (v) => {
    setter(v);
    setDirty(true);
  };

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 style={{ ...display, fontSize: 26, fontWeight: 600 }} className="mb-6">Profile</h1>

      <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">NAME</label>
      <input
        value={name}
        onChange={(e) => update(setName)(e.target.value)}
        style={{ background: T.surface, border: `1.5px solid ${T.line}`, color: T.ink }}
        className="w-full rounded-2xl px-4 py-3 outline-none text-base mb-4"
      />

      <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">AGE</label>
      <input
        value={age}
        onChange={(e) => update(setAge)(e.target.value.replace(/[^0-9]/g, ""))}
        inputMode="numeric"
        style={{ background: T.surface, border: `1.5px solid ${T.line}`, color: T.ink }}
        className="w-full rounded-2xl px-4 py-3 outline-none text-base mb-5"
      />

      <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">CURL TYPE</label>
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {CURL_TYPES.map((c) => {
          const active = hairType === c.id;
          return (
            <button
              key={c.id}
              onClick={() => update(setHairType)(c.id)}
              style={{ background: active ? T.ink : T.surface, border: `1.5px solid ${active ? T.ink : T.line}` }}
              className="rounded-xl py-2.5 flex flex-col items-center gap-1 transition"
            >
              <CurlGlyph tightness={c.t} size={22} color={active ? T.cream : T.amberDeep} strokeWidth={2} />
              <span style={{ ...mono, fontSize: 10.5, color: active ? T.cream : T.ink }}>{c.id}</span>
            </button>
          );
        })}
      </div>

      <label style={{ ...mono, fontSize: 11, color: T.inkSoft }} className="block mb-2 tracking-wide">POROSITY</label>
      <div className="grid grid-cols-2 gap-2.5 mb-8">
        {POROSITY.map((p) => {
          const active = porosity === p;
          return (
            <button
              key={p}
              onClick={() => update(setPorosity)(p)}
              style={{ background: active ? T.teal : T.surface, border: `1.5px solid ${active ? T.teal : T.line}`, color: active ? "#fff" : T.ink }}
              className="rounded-xl py-2.5 text-sm font-medium transition"
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        disabled={!dirty || saving}
        onClick={() => {
          onSave({ name: name.trim(), age: Number(age), hairType, porosity });
          setDirty(false);
        }}
        style={{ background: dirty ? T.ink : T.line, color: dirty ? T.cream : T.inkSoft }}
        className="w-full rounded-full py-3.5 font-medium flex items-center justify-center gap-2 mb-8 transition"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : "Save changes"}
      </button>

      <div style={{ borderTop: `1px solid ${T.line}` }} className="pt-6">
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{ color: T.coral }} className="text-sm font-medium">
            Delete profile & diary
          </button>
        ) : (
          <div style={{ background: T.surfaceSunk }} className="rounded-2xl p-4">
            <p style={{ fontSize: 13 }} className="mb-3">This permanently deletes your profile and every diary entry on this device. This can't be undone.</p>
            <div className="flex gap-3">
              <button onClick={onReset} style={{ background: T.coral, color: "#fff" }} className="rounded-full px-4 py-2 text-sm font-medium">
                Yes, delete everything
              </button>
              <button onClick={() => setConfirmReset(false)} style={{ color: T.inkSoft }} className="text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
