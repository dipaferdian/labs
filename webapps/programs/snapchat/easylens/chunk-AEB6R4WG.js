// Merge in the client-visible compile-time environment.
window.process = {
  ...window.process,
  env: {
    ...window.process?.env,
  },
};

import {
  a as mt,
  b as ft,
  c as vt,
  d as ht,
  e as oe,
  f as X,
  h as yt,
  i as Et,
  k as _t,
  l as At,
  m as St,
  n as I,
  o as P,
  p as It,
  q as Le,
  r as R,
  s as x,
  t as Me,
  u as Z,
  v as bt,
  w as wt,
  x as kt,
  y as Pt,
  z as Rt,
} from "/chunks/chunk-5ZIJHWQR.js";
import { a as Mt } from "/chunks/chunk-NLAW5KJF.js";
import { i as Tt, l as Lt } from "/chunks/chunk-GHXM7VQ6.js";
import { e as Ze } from "/chunks/chunk-WLT6MGQI.js";
import { d as Je, l as ie } from "/chunks/chunk-ENCHW3GY.js";
import {
  Ia as Te,
  Y as ct,
  Z as gt,
  i as Xe,
  o as ke,
} from "/chunks/chunk-XX3F65OQ.js";
import {
  E as we,
  F as A,
  Fb as it,
  Fd as rt,
  Gd as re,
  Ld as W,
  Ra as nt,
  Td as at,
  Wd as ot,
  Xd as dt,
  Y as S,
  Yd as lt,
  Zd as ut,
  he as pt,
  ie as ae,
  ja as Pe,
  ka as et,
  kd as J,
  la as tt,
  ld as Re,
} from "./chunk-CEML3LCE.js";
import { a as U } from "/chunks/chunk-DBINO3PG.js";
import { Ga as st } from "/chunks/chunk-POE77C62.js";
import { a as Ps } from "/chunks/chunk-CGCWXGBV.js";
import { e as ks } from "/chunks/chunk-C4S62VNK.js";
var ai = "fast";
async function Ct(t) {
  try {
    let e = await at(t);
    if (!e.ok) throw new Error(`Failed to fetch PLY from GCS: ${e.status}`);
    let s = await e.json();
    if (!s.ply_base64)
      throw new Error(
        `fetchPlyFromGcs: missing ply_base64, keys=${Object.keys(s).join(",")}`,
      );
    return s;
  } catch (e) {
    let s = new Error("Error fetching PLY from GCS.", {
      cause: e,
    });
    throw (
      we.logError({
        component: "SnapMl",
        action: "fetchPlyFromGcs",
        error: s,
      }),
      s
    );
  }
}
function gi(t) {
  let e = new URLSearchParams();
  return (
    t.maxPageSize && e.set("maxPageSize", t.maxPageSize.toString()),
    t.pageToken && e.set("pageToken", t.pageToken),
    t.state && e.set("state", t.state),
    ae(`${W}/api/fast-selfie-attachments?${e.toString()}`)
      .then((s) => {
        if (!s.ok) throw new Error("Failed to fetch fast selfie attachments");
        return s.json();
      })
      .catch((s) => {
        let n = new Error("Error fetching fast selfie attachments.", {
          cause: s,
        });
        throw (
          we.logError({
            component: "SnapMl",
            action: "listFastSelfieAttachments",
            error: n,
          }),
          n
        );
      })
  );
}
async function mi(t) {
  return lt(`${W}/api/fast-selfie-attachments/${t}`, {
    method: "DELETE",
  });
}
var Rs = A("VariationService");
async function Ut(t) {
  let e = await Ct(t),
    s = new Uint8Array(ut(e.ply_base64)),
    n = new Blob([s], {
      type: "model/ply",
    });
  return (
    Rs.info(
      `fetchPlyBlob: decoded ${e.ply_base64.length} base64 chars \u2192 ${n.size} bytes`,
    ),
    n
  );
}
function Ii(t, e) {
  return (
    t.startsWith(`variation_preview_${e}_`) || t.startsWith(`variation_${e}_`)
  );
}
function bi(t, e, s) {
  return !!t && t.blockKey === e && !t.isApplying && t.selectedPreview === s;
}
function wi(t) {
  return t && t !== J ? t : void 0;
}
async function Ts(t) {
  if (t.startsWith("data:")) {
    let s = t.indexOf(","),
      n = t.substring(0, s),
      i = t.substring(s + 1),
      a = n.match(/data:([^;,]+)/)?.[1] || "image/png";
    if (n.includes(";base64")) {
      let o = atob(i),
        l = new Uint8Array(o.length);
      for (let u = 0; u < o.length; u++) l[u] = o.charCodeAt(u);
      return new Blob([l], {
        type: a,
      });
    } else
      return new Blob([decodeURIComponent(i)], {
        type: a,
      });
  }
  return (await fetch(t)).blob();
}
var Ce = {
  image: {
    ext: "png",
    mimeType: "image/png",
    showProgress: !1,
    progressOnResolve: !0,
  },
  video: {
    ext: "mp4",
    mimeType: "video/mp4",
    showProgress: !0,
    progressOnResolve: !0,
  },
  selfie: {
    ext: "ply",
    mimeType: "model/ply",
    showProgress: !0,
    progressOnResolve: !1,
  },
};
async function ki(t) {
  let { mimeType: e } = Ce[t.kind];
  if (t.kind === "video")
    return {
      assetUrl: t.previewUrl,
      fileRefType: e,
    };
  let s = t.kind === "selfie" ? await Ls(t) : await Ts(t.previewUrl);
  return {
    assetUrl: URL.createObjectURL(s),
    fileRefType: s.type || e,
  };
}
async function Ls(t) {
  if (!t.plyGcsUrl) throw new Error("PLY URL not ready");
  return Ut(t.plyGcsUrl);
}
var xt = {
  num_inference_steps: 28,
  guidance_scale: 5,
  use_dpm: !1,
  flow_shift: 3,
  height: 1120,
  width: 640,
};
function Pi(t, e) {
  for (let s = t.length - 1; s >= 0; s--) {
    let n = t[s].variationsState?.[e];
    if (n && n.previews.some((i) => i !== void 0)) return n;
  }
}
function Ri(t, e, s) {
  if (!t || t.blockKey !== s) return t;
  let {
    previews: n,
    loading: i,
    error: r,
    failedSlots: a,
    backendAssetKey: d,
    backendPrompt: o,
  } = e;
  return {
    ...t,
    previews: n,
    isLoading: i,
    error: r ?? (i ? t.error : void 0),
    failedSlots: a,
    ...(d && {
      assetKey: d,
    }),
    ...(o &&
      t.prompt !== o &&
      !t.userEditedPrompt && {
        prompt: o,
        customPrompt: t.customPrompt === t.prompt ? o : t.customPrompt,
      }),
  };
}
function Ti(t, e, s) {
  let n = t?.variationInfo;
  return {
    prompt: s || n?.prompt || "<missing prompt>",
    blockName: n?.blockName || e,
    assetOutput: n?.assetOutput || "image",
    assetKey: n?.assetKey || "imageTex",
    originalInput: n?.originalInput,
    kind: n?.kind,
    blockId: n?.blockId,
    supportsInstantSwap: n?.supportsInstantSwap,
    instantSwapMimeType: n?.instantSwapMimeType,
  };
}
function Li(t, e) {
  return t === "collection"
    ? e
      ? {
          kind: "collection",
          blockId: e,
        }
      : {
          kind: "unavailable",
        }
    : {
        kind: "prompt",
      };
}
function Mi(t, e) {
  return (t === "publish" || t === "package") &&
    e?.selectedPreview &&
    !e.minimized
    ? "applyVariation"
    : t;
}
function Ci(t) {
  if (
    !t ||
    !t.selectedPreview ||
    t.isApplying ||
    (!t.slots && t.isSelectingPreview)
  )
    return !0;
  if (t.slots && t.selectedPreview) {
    let e = t.selectedPreview,
      s = t.slots.find(
        (n) =>
          (e.variantUid !== void 0 && n.asset?.variantUid === e.variantUid) ||
          n.index === e.variationIndex,
      );
    if (t.kind === "collection" && t.supportsInstantSwap === !0)
      return !s?.asset?.downloadUrl;
    if (s && s.status !== "done") return !0;
  }
  return !1;
}
function Ui(t, e) {
  let s;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n].suggestions?.find(
      (r) => r.type === "VisualEdit" && r.blockKey === e,
    );
    if (i) {
      if (i.variationInfo) return i;
      s ??= i;
    }
  }
  return s;
}
function Vt() {
  let [t] = ie(),
    { conversationId: e } = Je();
  return {
    conversationId: e,
    checkpointId: Lt(t.get(Tt)),
  };
}
var k = ks(Ps(), 1);
function Nt(t, e = {}) {
  let s = new URLSearchParams();
  (e.contentful_stage && s.set("contentful_stage", e.contentful_stage),
    e.contentful_environment &&
      s.set("contentful_environment", e.contentful_environment));
  let n = s.toString(),
    i = `${re}/assistant/starter-suggestions${n ? `?${n}` : ""}`;
  return t ? ot(i) : dt(i);
}
var p = class {
    constructor(e, s) {
      this.type = e;
      this.detail = s;
    }
    type;
    detail;
  },
  j = class {
    listeners;
    options;
    constructor() {
      ((this.listeners = new Map()), (this.options = new Map()));
    }
    addEventListener(e, s, n) {
      let i = s,
        r = this.listeners.get(e) ?? [];
      (this.listeners.set(e, [...r, i]), n && this.options.set(i, n));
    }
    dispatchEvent(e) {
      let s = this.listeners.get(e.type);
      return (
        s &&
          s.forEach((n) => {
            let i = this.options.get(n) ?? {};
            try {
              n(e);
            } catch (r) {
              window &&
                window.dispatchEvent(
                  new CustomEvent("error", {
                    detail: r,
                  }),
                );
            }
            i.once && this.removeEventListener(e.type, n);
          }),
        !0
      );
    }
    removeEventListener(e, s) {
      let n = s,
        i = this.listeners.get(e);
      i &&
        (this.listeners.set(
          e,
          i.filter((r) => r !== n),
        ),
        this.options.delete(n));
    }
  };
var $i = (t) =>
  t.startsWith("snapvideo") || t === "FACEGEN_LIVE_PREVIEW"
    ? {
        extension: ".mp4",
        mimeType: "video/mp4",
      }
    : {
        extension: ".png",
        mimeType: "image/png",
      };
var y = class extends j {
  get value() {
    return this._value;
  }
  _value;
  constructor(e) {
    (super(), (this._value = e));
  }
  dispatchEvent(e) {
    return ((this._value = e.detail), super.dispatchEvent(e));
  }
};
function tr(t) {
  if (t.type === "VisualEdit" && t.lensPayload.action === "enable_gizmo")
    return t.lensPayload.data.block_id;
  if (t.type === "VisualBlockInfo") return t.blockKey;
}
function Ue(t, e) {
  for (let s of t) {
    let n = s.suggestions?.find((i) => i.suggestionId == e);
    if (n) return n;
  }
  throw yt(`Suggestion ${e} not found.`);
}
function Ot({
  conversationalPrompts: t,
  suggestedPostActions: e,
  recipeBlocks: s,
  lensRecipe: n,
}) {
  let i = [];
  for (let r of t ?? [])
    i.push({
      suggestionId: R(),
      type: "ConversationalPrompt",
      prompt: r,
      label: r,
      isActive: !0,
      isApplied: !1,
    });
  for (let r of e ?? [])
    i.push({
      suggestionId: R(),
      type: "FollowUpPrompt",
      prompt: r.prompt,
      label: r.label,
      isActive: !0,
      isApplied: !1,
    });
  for (let r of s ?? []) {
    let a =
        r.supports_variations === !0 ||
        r.name.startsWith("Background Image") ||
        r.name.includes("Selfie Attachment"),
      d = {
        suggestionId: R(),
        label: r.name,
        description: r.description,
        blockKey: r.key,
        isActive: !0,
        isApplied: !1,
        community_creator_details: r.community_creator_details,
        isExclusive: r.is_exclusive,
      };
    if (r.supports_visual_edit !== !1 || a) {
      let o = r.variation_kind,
        l =
          (n ? Ve(r.key, n, o, r.input_variations) : void 0) ??
          (r.prompt
            ? {
                prompt: r.prompt,
                blockName: r.name || r.key,
                assetOutput: "image",
                assetKey: "imageTex",
                kind: o,
                blockId: r.block_id,
              }
            : void 0);
      i.push({
        ...d,
        type: "VisualEdit",
        lensPayload: {
          action: "enable_gizmo",
          data: {
            block_id: r.key,
            enabled: !0,
          },
        },
        supportsVariations: a,
        variationInfo: l,
      });
    } else
      i.push({
        ...d,
        type: "VisualBlockInfo",
      });
  }
  return (
    n?.controllerInputs &&
      Object.keys(n.controllerInputs).length > 0 &&
      i.push({
        suggestionId: R(),
        type: "VisualEdit",
        label: "Code",
        description: "Lens javascript code",
        lensPayload: {
          action: "enable_gizmo",
          data: {
            block_id: "lens_controller_id",
            enabled: !0,
          },
        },
        isActive: !0,
        isApplied: !1,
      }),
    i
  );
}
function sr(t) {
  if (!t || t.length === 0)
    return {
      suggestion: void 0,
      visualEditSuggestions: [],
    };
  let e = t.find(
      (n) =>
        n.type === "VisualEdit" &&
        n.lensPayload.action === "enable_gizmo" &&
        n.lensPayload.data.block_id === "lens_controller_id",
    ),
    s = e ? t.filter((n) => n !== e) : t;
  return {
    suggestion: e,
    visualEditSuggestions: s,
  };
}
function Dt(t, e) {
  let s = t?.blocks?.[e];
  if (!s) return;
  let n = s.inputs || {};
  for (let i of Object.values(n)) {
    if (Bt(i)) {
      let r = i.value?.id;
      if (r && t?.assetProviders?.[r]) {
        let a = t.assetProviders[r].parameters,
          d = Object.values(a || {}).find((o) => typeof o == "string" && xe(o));
        return L(i.value?.output, d);
      }
      return L(i.value?.output);
    }
    if (Ft(i)) {
      let r = i.value?.id;
      return (r
        ? t?.userProvidedAssets?.find((d) => d.name === r)
        : void 0
      )?.file_ref?.type?.startsWith("video")
        ? "video"
        : L(i.value?.output ?? i.value?.type, r);
    }
  }
}
function Bt(t) {
  return typeof t == "object" && t !== null && t.type === "asset_provider";
}
function Ft(t) {
  return typeof t == "object" && t !== null && t.type === "user_provided_asset";
}
function xe(t) {
  if (!t) return !1;
  let e = t.split(".").pop()?.toLowerCase();
  return e === "mp4" || e === "mov";
}
function L(t, e) {
  return xe(e) || t === "video" || t?.startsWith("video/")
    ? "video"
    : t && t !== "image" && t !== "texture"
      ? "ply_base64"
      : "image";
}
function Ve(t, e, s, n) {
  let i = e.blocks?.[t];
  if (!i) return;
  let r = i.blockId,
    a = (o) => n?.find((l) => l.input_key === o)?.supports_instant_swap === !0,
    d = i.inputs || {};
  for (let [o, l] of Object.entries(d)) {
    if (Bt(l)) {
      let u = l.value?.id;
      if (u && e.assetProviders?.[u]) {
        let f = e.assetProviders[u].parameters,
          c = Object.values(f || {}).find((w) => typeof w == "string" && xe(w)),
          v = L(l.value?.output, c),
          b = f?.positive_prompt || f?.prompt || i.description;
        if (b)
          return {
            prompt: b,
            blockName: i.name || t,
            assetOutput: v,
            assetKey: o,
            originalInput: l,
            kind: s,
            blockId: r,
            supportsInstantSwap: a(o),
            instantSwapMimeType:
              l.value?.type === "dnn"
                ? "model/dnn"
                : l.value?.type === "GaussianSplatting"
                  ? "model/ply"
                  : void 0,
          };
      }
      let m = L(l.value?.output);
      if (i.description)
        return {
          prompt: i.description,
          blockName: i.name || t,
          assetOutput: m,
          assetKey: o,
          originalInput: l,
          kind: s,
          blockId: r,
        };
    }
    if (Ft(l)) {
      let u = l.value?.id,
        m = u ? e.userProvidedAssets?.find((f) => f.name === u) : void 0,
        g = m?.file_ref?.type?.startsWith("video")
          ? "video"
          : L(l.value?.output ?? l.value?.type, u);
      if (u && m) {
        let f = m.predicted_caption || i.description;
        if (f) {
          let c = a(o),
            v = s === "collection" && !c ? void 0 : r;
          return {
            prompt: f,
            blockName: i.name || t,
            assetOutput: g,
            assetKey: o,
            originalInput: l,
            kind: s,
            blockId: v,
            ...(s === "collection" && c
              ? {
                  supportsInstantSwap: !0,
                  instantSwapMimeType: u?.toLowerCase().endsWith(".dnn")
                    ? "model/dnn"
                    : "model/ply",
                }
              : {}),
          };
        }
      }
    }
  }
}
function Oe(t) {
  let e = t.asset_ids;
  return Array.isArray(e) ? e.filter((s) => typeof s == "string") : [];
}
function qt(t) {
  return t.asset_type === "video";
}
function Cs(t) {
  return {
    label: "",
    asset_type: qt(t) ? "snapvideo" : "snapgen-t2i",
    prompt: "",
    input_user_provided_assets: [],
    generation_args: {},
  };
}
function Us(t, e) {
  let s = t.asset_id,
    n = Cs(t);
  switch (t.status) {
    case "SUCCEEDED": {
      let i = qt(t);
      return {
        status: "SUCCESS",
        id: s,
        assetRecipe: n,
        url: t.download_url ?? "",
        mimeType: i ? "video/mp4" : "image/png",
        filename: `generated_asset_${e + 1}.${i ? "mp4" : "png"}`,
        uploadUuid: t.asset_id,
      };
    }
    case "FAILED":
      return {
        status: "FAILED",
        id: s,
        assetRecipe: n,
        error: new Error(t.failure_reason ?? "Asset generation failed."),
      };
    case "CANCELLED":
      return {
        status: "CANCELLED",
        id: s,
        assetRecipe: n,
      };
    case "QUEUED":
      return {
        status: "QUEUED",
        id: s,
        assetRecipe: n,
      };
    default:
      return {
        status: "RUNNING",
        id: s,
        assetRecipe: n,
      };
  }
}
function xs(t) {
  return (
    t.status === "SUCCEEDED" ||
    t.status === "FAILED" ||
    t.status === "CANCELLED"
  );
}
function Vs(t) {
  return {
    status: "RUNNING",
    id: t,
    assetRecipe: {
      label: "",
      asset_type: "",
      prompt: "",
      input_user_provided_assets: [],
      generation_args: {},
    },
  };
}
function Ns(t) {
  let e = t.suggested_post_actions;
  return Array.isArray(e)
    ? e.filter(
        (s) => !!s && typeof s.label == "string" && typeof s.prompt == "string",
      )
    : [];
}
function Os(t, e, s) {
  return t.map((n, i) => ({
    suggestionId: `${s}-post-action-${i}`,
    type: "FollowUpPrompt",
    isActive: !0,
    isApplied: !1,
    label: n.label,
    prompt: n.prompt,
    asset: e,
  }));
}
function $t(t, e, s) {
  if (e.length === 0) return;
  let n = e.map((o, l) => {
      let u = s[o];
      return u ? Us(u, l) : Vs(o);
    }),
    i = e.map((o) => s[o]).filter((o) => o !== void 0),
    r = i.length === e.length && i.every(xs),
    a = n.find((o) => o.status === "SUCCESS"),
    d = r && a ? Os(Ns(t.payload), a, t.messageId) : [];
  return {
    message_id: t.messageId,
    showForkButton: t.payload.show_fork_button === !0,
    message_type: r ? "ASSET_GENERATION_DONE" : "ASSET_GENERATION",
    timestamp: t.timestamp ?? x(),
    agent_name: t.agentName,
    message: "",
    asset_generation_statuses: n,
    feedbackMessageId: t.messageId,
    suggestions: d.length > 0 ? d : void 0,
  };
}
function Ds(t) {
  return {
    suggestionId: `${t}-rerun`,
    type: "FollowUpPrompt",
    isActive: !0,
    isApplied: !1,
    label: "Rerun",
    prompt: "rerun",
    intent: "RERUN",
  };
}
function Wt(t) {
  let e = !1,
    s,
    n = !1;
  for (let i of t)
    i.message_type === "FROM_USER"
      ? (e = (i.payload?.user_provided_assets?.length ?? 0) > 0)
      : i.message_type === "ASSET_GENERATION_DONE" &&
        (i.asset_generation_statuses ?? []).some(
          (r) => r.status === "SUCCESS",
        ) &&
        ((s = i), (n = e));
  s && !n && (s.suggestions = [...(s.suggestions ?? []), Ds(s.message_id)]);
}
var Bs = 5e3,
  Fs = 100,
  Gs = [
    "Thinking this through",
    "Working on it",
    "Figuring things out",
    "Processing your request",
    "Piecing everything together",
    "Gathering context",
    "Analyzing what you asked for",
    "Planning the next steps",
    "Mapping out a response",
    "Organizing my thoughts",
    "Coming right up",
    "Understanding what's needed",
    "Getting things ready",
    "Breaking this down",
    "Exploring possible directions",
    "Working through the details",
    "Preparing the approach",
  ],
  qs = [
    "Crafting your immersive universe",
    "Aligning digital dreams with reality",
    "Weaving magic into every pixel",
    "Spinning up a world of wonder",
    "Mapping new dimensions",
    "Blending fantasy with the real world",
    "Sculpting a digital masterpiece",
    "Unfolding your alternate reality",
    "Merging magic with technology",
    "Charging up the immersive engine",
    "Brewing an experience like no other",
    "Linking dreams to reality",
    "Forging your digital dreamscape",
    "Orchestrating a symphony of augmented wonders",
    "Igniting the spark of surreal possibility",
    "Curating marvels in every pixel",
    "Shaping the canvas of your reality",
    "Empowering your journey through untold realms",
    "Energizing the heartbeat of your experience",
    "Pioneering new frontiers of imagination",
    "Turning words into AR magic",
    "Your text becomes augmented reality",
    "Transforming ideas into AR experiences",
    "Crafting AR from your imagination",
    "Mapping words to digital wonder",
    "Your vision, in AR",
    "Converting ideas into AR wonders",
    "Building AR from your words",
    "Words evolving into interactive AR",
    "Transforming text into immersive reality",
    "Weaving your narrative into AR",
    "From description to digital magic",
    "Sculpting digital marvels from your words",
    "Igniting AR experiences from your text",
    "Turning descriptions into AR dreams",
    "Unleashing AR magic from your ideas",
    "Crafting interactive reality from your words",
    "Breathing life into your AR vision",
    "Elevating text into AR art",
    "Translating ideas into augmented experiences",
    "Unfolding your story into AR wonders",
    "Converting narrative into immersive AR",
    "Designing reality with your words",
    "Shaping digital realms from your text",
    "Where words spark AR innovation",
    "Empowering your ideas with AR magic",
    "From words to augmented brilliance",
    "Transmuting text into digital adventure",
    "Your ideas, now a digital experience",
    "Animating your words in AR",
    "Crafting immersive tales with AR",
    "Your text transformed into digital wonder",
    "Building dreams from every word",
    "Weaving magic through augmented reality",
    "Creating interactive worlds from your text",
    "Translating vision into AR experiences",
    "Your description, now a digital journey",
    "Illuminating your ideas in AR",
    "Designing AR experiences from your words",
    "From text to a vibrant AR world",
    "Envisioning your story in augmented reality",
    "Where imagination meets AR reality",
    "Your words, our digital canvas",
    "Turning ideas into interactive AR",
    "Infusing your text with AR brilliance",
    "Transforming descriptions into digital dreams",
  ],
  De = mt + " is replying";
function Be(t) {
  switch (t) {
    case "Initial":
    case "Idle":
    case "ImmersivePreviewResult":
    case "Error":
    case "Terminated":
      return "idle";
    case "Awaiting":
      return "interpretation";
    case "ImmersiveTraining":
      return "generation";
    default:
      return Z(t);
  }
}
var de = class {
    constructor(e, s, n) {
      this.stateDispatcher = e;
      this.getPhase = s;
      this.callback = n;
    }
    stateDispatcher;
    getPhase;
    callback;
    debounceTimeout;
    phraseInterval;
    phase = "idle";
    isActive = !1;
    interpretation = new le(Gs);
    generation = new le(qs);
    start() {
      this.isActive ||
        ((this.isActive = !0),
        this.stateDispatcher.addEventListener(
          "changed",
          this.handleStateChange,
        ));
    }
    stop() {
      this.isActive &&
        ((this.isActive = !1),
        this.stateDispatcher.removeEventListener(
          "changed",
          this.handleStateChange,
        ),
        this.cleanup());
    }
    cleanup() {
      (this.debounceTimeout &&
        (clearTimeout(this.debounceTimeout), (this.debounceTimeout = void 0)),
        this.phraseInterval &&
          (clearInterval(this.phraseInterval), (this.phraseInterval = void 0)));
    }
    handleStateChange = (e) => {
      let s = e.detail;
      (this.debounceTimeout && clearTimeout(this.debounceTimeout),
        (this.debounceTimeout = setTimeout(() => {
          let n = this.getPhase(s);
          n !== this.phase &&
            ((this.phase = n),
            this.phraseInterval &&
              (clearInterval(this.phraseInterval),
              (this.phraseInterval = void 0)),
            this.phase !== "idle"
              ? (this.phraseInterval = setInterval(() => {
                  this.callback(this.nextPhrase(this.phase));
                }, Bs))
              : this.callback(De));
        }, Fs)));
    };
    nextPhrase = (e) =>
      e === "generation" ? this.generation.next() : this.interpretation.next();
  },
  le = class {
    base;
    pool;
    index;
    constructor(e) {
      ((this.base = e), (this.pool = Kt([...e])), (this.index = 0));
    }
    next() {
      return (
        this.index >= this.pool.length &&
          ((this.pool = Kt([...this.base])), (this.index = 0)),
        this.pool[this.index++]
      );
    }
  };
function Kt(t) {
  for (let e = t.length - 1; e > 0; e--) {
    let s = Math.floor(Math.random() * (e + 1));
    [t[e], t[s]] = [t[s], t[e]];
  }
  return t;
}
var $s = {
    reasoning: !0,
    code: !0,
    tool_call: !0,
  },
  Ws = {
    running: !0,
    done: !0,
    error: !0,
  };
function Q(t) {
  return t !== null && typeof t == "object";
}
function Ks(t, e) {
  let s = t?.planning_questions_metadata;
  if (!(t?.kind !== "planning_question" || !s))
    return {
      clarificationId: e,
      expiresAt: s.expires_at,
    };
}
function jt(t) {
  return typeof t == "string" && Object.prototype.hasOwnProperty.call($s, t);
}
function js(t) {
  return typeof t == "string" && Object.prototype.hasOwnProperty.call(Ws, t);
}
function V(t) {
  return t == null || typeof t == "string";
}
function Qt(t) {
  return !Q(t) ||
    typeof t.label != "string" ||
    !V(t.value) ||
    !V(t.preview) ||
    (t.kind !== void 0 &&
      t.kind !== null &&
      t.kind !== "text" &&
      t.kind !== "code")
    ? !1
    : t.items === void 0 ||
        t.items === null ||
        (Array.isArray(t.items) && t.items.every(Qt));
}
function Qs(t) {
  return t == null
    ? !0
    : Q(t)
      ? t.details === void 0 ||
        t.details === null ||
        (Array.isArray(t.details) && t.details.every(Qt))
      : !1;
}
function Yt(t) {
  if (!Q(t)) return;
  let e = t.reasoning;
  return Q(e) ? e : void 0;
}
function zt(t) {
  return new Error(
    `Invalid ${t} event: expected a valid transient activity payload`,
  );
}
function Ys(t) {
  if (
    !Q(t) ||
    !jt(t.kind) ||
    typeof t.id != "string" ||
    typeof t.agent_name != "string" ||
    typeof t.timestamp != "string"
  )
    return !1;
  switch (t.kind) {
    case "reasoning":
      return typeof t.chunk == "string";
    case "code":
      return typeof t.chunk == "string" && V(t.language);
    case "tool_call":
      return (
        typeof t.tool_name == "string" &&
        js(t.status) &&
        V(t.arguments_chunk) &&
        V(t.tool_arguments) &&
        V(t.result) &&
        V(t.error) &&
        Qs(t.display)
      );
    default:
      return Z(t.kind);
  }
}
function zs(t) {
  return (
    Q(t) &&
    jt(t.kind) &&
    typeof t.id == "string" &&
    typeof t.timestamp == "string" &&
    V(t.agent_name)
  );
}
function Fe(t, e) {
  return `${t}:${e}`;
}
function Hs(t) {
  return {
    downloadUrl: t.download_url ?? void 0,
    label: t.label ?? void 0,
    status: t.status ?? void 0,
  };
}
function Js(t) {
  if (t)
    return {
      name: t.name ?? void 0,
      url: t.url ?? void 0,
      iconData: t.icon_data ?? void 0,
      checksum: t.checksum ?? void 0,
      supportsFullscreen: t.supports_fullscreen ?? void 0,
      previews: t.previews?.map(Hs),
      recipe: t.recipe ?? void 0,
      assetManifest: t.asset_manifest ?? void 0,
      featureMetadata: t.feature_metadata ?? void 0,
      lensDescriptors: t.lens_descriptors ?? void 0,
      webLensPreviewUrl: t.web_lens_preview_url ?? void 0,
    };
}
function Ht(t) {
  return {
    items: (t?.messages ?? []).map(ue),
    hasMore: t?.has_more ?? !1,
    nextCursor: t?.next_cursor ?? void 0,
    isLoadingMore: !1,
  };
}
function Xs(t) {
  let e = t?.skills;
  return Array.isArray(e) ? e.filter((s) => typeof s == "string") : void 0;
}
function Ge(t) {
  return {
    conversationId: t.conversation_id,
    checkpointId: t.checkpoint_id ?? void 0,
    conversationState: t.conversation_state,
    version: t.version,
    allowedActions: new Set(t.allowed_actions),
    publishEligibility: t.publish_eligibility ?? void 0,
    republishEligibility: t.republish_eligibility ?? void 0,
    ...(t.lens !== void 0
      ? {
          readyLens: t.lens ? Js(t.lens) : void 0,
        }
      : {}),
    lensBuildStatus: t.lens_build_status ?? void 0,
    blocks: t.blocks ?? [],
    pendingVisualEdits: t.pending_visual_edits ?? void 0,
  };
}
function ue(t) {
  return {
    messageId: t.message_id,
    conversationId: t.conversation_id,
    messageType: t.message_type,
    agentName: t.agent_name,
    message: t.message,
    payload: t.payload ?? {},
    skills: Xs(t.payload),
    clarification: Ks(t.payload, t.message_id),
    suggestions: t.suggestions ?? [],
    timestamp: t.timestamp ?? void 0,
    canProvideFeedback: t.can_provide_feedback,
  };
}
function Jt(t) {
  return t
    .filter((e) => e.kind === "asset_ref" || e.uploadResult?.uid !== void 0)
    .map((e) =>
      e.kind === "asset_ref"
        ? {
            source: "asset_ref",
            asset_ref: e.assetRef,
          }
        : e.kind === "asset"
          ? {
              source: "generated",
              asset_id: e.uploadResult.uid,
            }
          : {
              upload_uuid: e.uploadResult.uid,
              name: e.fileInfo.filename,
              source: e.fileInfo.assetSource ?? "upload",
            },
    );
}
function Xt(t, e, s) {
  return {
    conversationId: s,
    messageId: t.message_id,
    messageType: t.message_type,
    agentName: t.agent_name,
    timestamp: t.timestamp,
    message: (e?.message ?? "") + t.chunk,
    payload: e?.payload ?? {},
    skills: e?.skills,
    clarification: e?.clarification,
    suggestions: e?.suggestions ?? [],
    isStreaming: !0,
  };
}
function Zt(t) {
  let e = t.activity;
  if (e != null) {
    if (Ys(e)) return e;
    throw zt("transient_status_update");
  }
  let s = Yt(t);
  if (
    typeof s?.id == "string" &&
    typeof s.agent_name == "string" &&
    typeof s.chunk == "string" &&
    typeof s.timestamp == "string"
  )
    return {
      kind: "reasoning",
      id: s.id,
      agent_name: s.agent_name,
      chunk: s.chunk,
      timestamp: s.timestamp,
    };
}
function es(t, e) {
  switch (t.kind) {
    case "reasoning": {
      let s = e?.kind === "reasoning" ? e.summary.text : "";
      return {
        kind: "reasoning",
        id: t.id,
        agentName: t.agent_name,
        summary: {
          messageId: t.id,
          text: `${s}${t.chunk}`,
        },
        timestamp: t.timestamp,
      };
    }
    case "code": {
      let s = e?.kind === "code" ? e.code : "";
      return {
        kind: "code",
        id: t.id,
        agentName: t.agent_name,
        code: `${s}${t.chunk}`,
        language: t.language ?? void 0,
        timestamp: t.timestamp,
      };
    }
    case "tool_call": {
      let s = e?.kind === "tool_call" ? e.argumentsText : "";
      return {
        kind: "tool_call",
        id: t.id,
        agentName: t.agent_name,
        toolName: t.tool_name,
        status: t.status,
        argumentsText: `${s}${t.arguments_chunk ?? ""}`,
        toolArguments: t.tool_arguments ?? void 0,
        display: t.display ?? void 0,
        timestamp: t.timestamp,
      };
    }
    default:
      return Z(t);
  }
}
function ts(t) {
  let e = t.activity;
  if (e != null) {
    if (zs(e)) return e;
    throw zt("transient_status_finished");
  }
  let s = Yt(t);
  if (typeof s?.id == "string")
    return {
      kind: "reasoning",
      id: s.id,
      agent_name: typeof s.agent_name == "string" ? s.agent_name : void 0,
      timestamp: typeof s.timestamp == "string" ? s.timestamp : "",
    };
}
var Zs = new Set(["LENS_RECIPE", "LENS_READY"]),
  en = new Set(["ASSET_RECIPE"]);
function ss(t) {
  return t !== null && typeof t == "object";
}
function tn(t) {
  return !ss(t) || !Array.isArray(t.blocks)
    ? !1
    : t.blocks.some((e) => {
        if (!ss(e)) return !1;
        if (e.kind === "visual_edit") return !0;
        let s = typeof e.name == "string" ? e.name : "";
        return e.supports_variations === !0 ||
          s.startsWith("Background Image") ||
          s.includes("Selfie Attachment")
          ? !0
          : e.supports_visual_edit === !1 || e.kind === "info"
            ? !1
            : "supports_visual_edit" in e || "key" in e || "name" in e;
      });
}
function sn(t) {
  let e =
    t.agent_name === oe ||
    t.message_type === "FROM_USER" ||
    t.message_type === "USER_INPUT"
      ? "USER"
      : "LLM";
  if (t.message_type === "LENS_FINISHED" || t.message === ht)
    return {
      type: "LENS_GENERATED",
      sender: e,
    };
  if (tn(t.payload))
    return {
      type: "VISUAL_EDIT",
      sender: e,
    };
  if (t.message_type === "ASK_USER" && (t.suggestions?.length ?? 0) > 0)
    return {
      type: "FOLLOW_UP_QUESTION",
      sender: e,
    };
  if (Zs.has(t.message_type))
    return {
      type: "LENS_STATUS_UPDATE",
      sender: e,
    };
  if (en.has(t.message_type))
    return {
      type: "ASSET_STATUS_UPDATE",
      sender: e,
    };
  switch (t.message_type) {
    case "ERROR":
    case "TERMINATED":
      return {
        type: "ERROR",
        sender: e,
      };
    default:
      return {
        type: "TEXT",
        sender: e,
      };
  }
}
var pe = class {
  events = new j();
  seenMessageEvents = new Set();
  recordPromptSent(e) {
    this.events.dispatchEvent(
      new p("prompt-sent", {
        timestampMs: e.timestampMs,
        conversationId: e.conversationId,
        checkpointId: e.checkpointId,
        type: e.type,
        numAttachments: e.numAttachments,
        skillCount: e.skillCount,
        hasRenderOrderChange: e.hasRenderOrderChange,
      }),
    );
  }
  recordMessageReceived(e, s) {
    let n = sn(e),
      i = `${e.message_id}:${n.type}:${e.timestamp ?? ""}`;
    this.seenMessageEvents.has(i) ||
      (this.seenMessageEvents.add(i),
      this.events.dispatchEvent(
        new p("message-received", {
          timestampMs: Date.now(),
          conversationId: e.conversation_id,
          checkpointId: e.payload?.checkpoint?.id ?? s,
          type: n.type,
          sender: n.sender,
        }),
      ));
  }
  recordSnapgenImageGenerated(e, s) {
    this.events.dispatchEvent(
      new p("snapgen-image-generated", {
        timestampMs: Date.now(),
        conversationId: e,
        checkpointId: s,
        hasInputImage: !1,
      }),
    );
  }
  recordStreamOpened(e, s) {
    this.events.dispatchEvent(
      new p("stream-opened", {
        timestampMs: Date.now(),
        conversationId: e,
        checkpointId: s,
      }),
    );
  }
  recordSSEAnomaly(e, s, n) {
    this.events.dispatchEvent(
      new p("backend-chat-sse-anomaly", {
        timestampMs: Date.now(),
        conversationId: s,
        checkpointId: n,
        type: e,
      }),
    );
  }
};
async function* ns(t, e) {
  let s = t.getReader(),
    n = new TextDecoder(),
    i = "",
    r = () => {
      s.cancel();
    };
  e.addEventListener("abort", r);
  try {
    for (;;) {
      e.throwIfAborted();
      let { done: a, value: d } = await s.read();
      if (a) break;
      let o = n.decode(d, {
        stream: !0,
      });
      i += o;
      let l = i.split(/\r?\n\r?\n/);
      i = l.pop();
      for (let u of l) {
        let m = u.split(/\r?\n/),
          g,
          f;
        for (let c of m) {
          let v = c.trimStart(),
            b = v.indexOf(":");
          if (b === -1) continue;
          let w = v.slice(0, b).trim(),
            M = v.slice(b + 1).trimStart();
          w === "event"
            ? (g = M)
            : w === "data" &&
              (f =
                f !== void 0
                  ? f +
                    `
` +
                    M
                  : M);
        }
        if (f)
          try {
            let c = JSON.parse(f);
            yield {
              event_type: g ?? "done",
              data: c,
            };
          } catch {}
      }
    }
  } finally {
    (e.removeEventListener("abort", r), s.releaseLock());
  }
}
var Y = A("BackendChat"),
  nn = 1e3,
  rn = 4.5 * 60 * 1e3,
  an = 1e4,
  ce = class {
    constructor(e) {
      this.config = e;
    }
    config;
    disposeController = new AbortController();
    reconnectTimeoutId;
    streamActive = !1;
    streamController;
    rotationTimeoutId;
    rotatingStream = !1;
    async connect(e) {
      let { signal: s } = this.disposeController;
      if (s.aborted || this.streamActive) return;
      this.streamActive = !0;
      let n = new AbortController(),
        i = () => n.abort();
      (s.addEventListener("abort", i, {
        once: !0,
      }),
        (this.streamController = n));
      try {
        let r = this.config.getLastMessageId(),
          a = await I(this.config.network, this.config.ailcBaseUrl, {
            path: `/assistant/v1/conversations/events/${encodeURIComponent(e)}`,
            method: "GET",
            query: r
              ? {
                  last_message_id: r,
                }
              : void 0,
            signal: n.signal,
          });
        if (!a.body) throw Et("SSE stream has no body");
        (Y.info(`SSE stream open conversation_id=${e}`),
          this.config.onStreamOpened(e),
          this.scheduleRotation(e),
          this.drain(a.body, e, n.signal).finally(() =>
            s.removeEventListener("abort", i),
          ));
      } catch (r) {
        if (
          (s.removeEventListener("abort", i),
          (this.streamActive = !1),
          s.aborted)
        )
          return;
        if (this.rotatingStream && n.signal.aborted) {
          ((this.rotatingStream = !1), this.connect(e));
          return;
        }
        (Y.error(
          new Error(`SSE connection failed conversation_id=${e}`, {
            cause: r,
          }),
        ),
          this.scheduleReconnect(e));
      }
    }
    refresh(e) {
      this.disposeController.signal.aborted ||
        (this.streamActive
          ? (this.clearRotationTimer(),
            (this.rotatingStream = !0),
            this.streamController?.abort())
          : (this.reconnectTimeoutId && clearTimeout(this.reconnectTimeoutId),
            (this.reconnectTimeoutId = void 0),
            this.connect(e)));
    }
    dispose() {
      (this.reconnectTimeoutId &&
        (clearTimeout(this.reconnectTimeoutId),
        (this.reconnectTimeoutId = void 0)),
        this.clearRotationTimer(),
        this.disposeController.abort());
    }
    async drain(e, s, n) {
      let { signal: i } = this.disposeController;
      try {
        for await (let r of ns(e, n)) this.config.onEvent(r);
        this.rotatingStream ||
          Y.info(`SSE stream closed by server conversation_id=${s}`);
      } catch (r) {
        if (i.aborted) return;
        this.rotatingStream ||
          Y.info(
            `SSE stream ended, will reconnect conversation_id=${s}: ${nt(r)}`,
          );
      }
      if (((this.streamActive = !1), this.clearRotationTimer(), !i.aborted)) {
        if (this.rotatingStream) {
          ((this.rotatingStream = !1),
            Y.info(
              `SSE stream rotated before lifetime cap conversation_id=${s}`,
            ),
            this.connect(s));
          return;
        }
        this.scheduleReconnect(s);
      }
    }
    scheduleReconnect(e) {
      if (this.reconnectTimeoutId) return;
      let { signal: s } = this.disposeController;
      this.reconnectTimeoutId = setTimeout(() => {
        ((this.reconnectTimeoutId = void 0), !s.aborted && this.connect(e));
      }, nn);
    }
    scheduleRotation(e) {
      let s = () => {
        if (
          ((this.rotationTimeoutId = void 0),
          !(this.disposeController.signal.aborted || !this.streamActive))
        ) {
          if (this.config.hasStreamingMessage()) {
            this.rotationTimeoutId = setTimeout(s, an);
            return;
          }
          (Y.info(`SSE stream rotation starting conversation_id=${e}`),
            (this.rotatingStream = !0),
            this.streamController?.abort());
        }
      };
      (this.clearRotationTimer(), (this.rotationTimeoutId = setTimeout(s, rn)));
    }
    clearRotationTimer() {
      this.rotationTimeoutId &&
        (clearTimeout(this.rotationTimeoutId),
        (this.rotationTimeoutId = void 0));
    }
  };
var as = "Package the current lens for publishing",
  me = "Train a model (3+ hours)",
  F = A("BackendChat"),
  un = {
    active: !1,
    phrase: De,
  },
  pn = {
    items: [],
    hasMore: !1,
    nextCursor: void 0,
    isLoadingMore: !1,
  },
  cn = ["SendPrompt"],
  gn = 3e4;
function mn(t) {
  let e = {};
  for (let [s, n] of Object.entries(t?.runtime_blocks ?? {})) {
    let { status: i, download_url: r } = n;
    !i ||
      i === "NOT_STARTED" ||
      (e[s] = r
        ? {
            status: i,
            download_url: r,
          }
        : {
            status: i,
          });
  }
  return e;
}
function is(t, e) {
  let s = t?.recipe;
  if (e !== void 0 && s !== void 0)
    return {
      kind: "placeholder",
      rawRecipe: JSON.stringify(s),
      runtimeBlocks: mn(e),
    };
  if (t && t.checksum)
    return {
      kind: "ready",
      lens: t,
    };
}
var ge = class {
  constructor(e) {
    this.config = e;
    ((this.telemetry = this.telemetryReporter.events),
      (this.conversationId = e.initial?.conversationId),
      (this.needsInitialSnapshot = !this.conversationId),
      (this.conversationIdPromise = e.initial?.conversationId
        ? Promise.resolve(e.initial.conversationId)
        : void 0));
    let s = e.initial?.lens
        ? {
            name: e.initial.lens.name,
            url: e.initial.lens.url,
            iconData: e.initial.lens.iconData,
            checksum: e.initial.lens.checksum,
            supportsFullscreen: e.initial.lens.supportsFullscreen,
            previews: void 0,
            recipe: void 0,
            assetManifest: e.initial.lens.assetManifest,
            featureMetadata: e.initial.lens.featureMetadata,
            lensDescriptors: e.initial.lens.lensDescriptors,
            webLensPreviewUrl: e.initial.lens.webLensPreviewUrl,
          }
        : void 0,
      n =
        e.initial?.checkpointId ??
        e.conversationOptions?.lens_checkpoint_id ??
        void 0;
    ((this.state = new y({
      conversationId: this.conversationId,
      conversationState: "Initial",
      version: 0,
      checkpointId: n,
      readyLens: s,
      previewLens: is(s, void 0),
      blocks: [],
      assets: {},
      pendingVisualEdits: void 0,
      allowedActions: new Set(this.conversationId ? [] : cn),
      publishEligibility: void 0,
      republishEligibility: void 0,
      lensBuildStatus: void 0,
    })),
      (this.messages = new y(pn)),
      (this.loadingMessage = new y(un)),
      (this.eventStream = new ce({
        network: e.network,
        ailcBaseUrl: e.ailcBaseUrl,
        getLastMessageId: () =>
          this.messages.value.items.findLast(
            (i) =>
              !this.optimisticMessageIds.has(i.messageId) && !i.isStreaming,
          )?.messageId,
        hasStreamingMessage: () =>
          this.messages.value.items.some((i) => i.isStreaming),
        onEvent: (i) => this.handleEvent(i),
        onStreamOpened: (i) =>
          this.telemetryReporter.recordStreamOpened(
            i,
            this.state.value.checkpointId,
          ),
      })),
      (this.loadingPhrasesManager = new de(
        this.state,
        (i) => Be(i.conversationState),
        (i) => this.emitLoadingMessage(i),
      )),
      this.loadingPhrasesManager.start(),
      this.state.addEventListener("changed", () =>
        this.emitLoadingMessage(this.loadingMessage.value.phrase),
      ),
      this.conversationId && this.eventStream.connect(this.conversationId));
  }
  config;
  state;
  messages;
  loadingMessage;
  telemetry;
  disposeController = new AbortController();
  eventStream;
  conversationId;
  needsInitialSnapshot;
  initialActionPending = !1;
  conversationIdPromise;
  loadingPhrasesManager;
  telemetryReporter = new pe();
  transientActivities = new Map();
  optimisticMessageIds = new Set();
  dispose() {
    (this.loadingPhrasesManager.stop(),
      this.eventStream.dispose(),
      this.disposeController.abort(),
      this.patchState({
        allowedActions: new Set(),
      }));
  }
  emitLoadingMessage(e) {
    let s = Be(this.state.value.conversationState) !== "idle";
    s || this.transientActivities.clear();
    let n = this.loadingMessage.value,
      i = s ? [...this.transientActivities.values()] : [],
      r = s
        ? {
            active: !0,
            phrase: e,
            ...(i.length > 0 && {
              transientActivities: i,
            }),
          }
        : {
            active: !1,
            phrase: e,
          },
      a = n.transientActivities ?? [];
    (n.active === r.active && n.phrase === r.phrase && U(a) === U(i)) ||
      this.loadingMessage.dispatchEvent(new p("changed", r));
  }
  handleEvent(e) {
    switch (e.event_type) {
      case "snapshot":
        this.handleSnapshot(e.data);
        break;
      case "conversation_state_changed":
        this.handleStateChanged(e.data);
        break;
      case "message_added":
      case "message_updated":
        (this.handleMessageUpserted(e.data),
          this.telemetryReporter.recordMessageReceived(
            e.data,
            this.state.value.checkpointId,
          ));
        break;
      case "message_streaming":
        this.handleMessageStreaming(e.data);
        break;
      case "transient_status_update":
        this.handleTransientStatusUpdate(e.data);
        break;
      case "transient_status_finished":
        this.handleTransientStatusFinished(e.data);
        break;
      case "lens_build_status_update":
        this.handleLensBuildStatusUpdate(e.data);
        break;
      case "asset_updated":
        this.handleAssetUpdated(e.data);
        break;
      case "error":
        break;
    }
  }
  handleLensBuildStatusUpdate(e) {
    if (this.state.value.conversationState !== "Awaiting") {
      this.telemetryReporter.recordSSEAnomaly(
        "late_lens_build_status_update",
        this.state.value.conversationId,
        this.state.value.checkpointId,
      );
      return;
    }
    this.patchState({
      lensBuildStatus: e,
    });
  }
  handleAssetUpdated(e) {
    let s = this.state.value.assets[e.asset_id]?.status === "SUCCEEDED";
    (this.patchState({
      assets: {
        ...this.state.value.assets,
        [e.asset_id]: e,
      },
    }),
      e.status === "SUCCEEDED" &&
        e.asset_kind === "SNAPGEN_IMAGE" &&
        this.state.value.conversationId &&
        !s &&
        this.telemetryReporter.recordSnapgenImageGenerated(
          this.state.value.conversationId,
          this.state.value.checkpointId,
        ));
  }
  handleSnapshot(e) {
    if (e.version < this.state.value.version) return;
    if (
      ((this.needsInitialSnapshot = !1),
      this.resetStreaming(),
      e.conversation_state === "Initial")
    ) {
      this.patchState({
        version: e.version,
      });
      return;
    }
    let s = Ht(e.recent_messages),
      n = this.messages.value,
      i = n?.items.some((a) => !this.optimisticMessageIds.has(a.messageId)),
      r;
    if (i) {
      let a = new Set(n?.items.map((o) => o.messageId)),
        d = new Map(s.items.map((o) => [o.messageId, o]));
      r = [
        ...(n?.items ?? []).map((o) => d.get(o.messageId) ?? o),
        ...s.items.filter((o) => !a.has(o.messageId)),
      ];
    } else
      r = [
        ...s.items,
        ...(n?.items.filter((a) =>
          this.optimisticMessageIds.has(a.messageId),
        ) ?? []),
      ];
    (this.messages.dispatchEvent(
      new p("changed", {
        items: r,
        hasMore: i ? (n?.hasMore ?? !1) : s.hasMore,
        nextCursor: i ? n?.nextCursor : s.nextCursor,
        isLoadingMore: i ? (n?.isLoadingMore ?? !1) : !1,
      }),
    ),
      this.patchState({
        ...Ge(e),
        assets: e.assets ?? {},
        ...(this.initialActionPending && this.optimisticMessageIds.size > 0
          ? {
              conversationState: "Awaiting",
            }
          : {}),
      }));
  }
  handleStateChanged(e) {
    e.version < this.state.value.version ||
      (e.reset_streaming && this.resetStreaming(), this.patchState(Ge(e)));
  }
  resetStreaming() {
    this.transientActivities.clear();
    let e = this.messages.value,
      s = e.items.filter((n) => !n.isStreaming);
    s.length !== e.items.length &&
      this.messages.dispatchEvent(
        new p("changed", {
          ...e,
          items: s,
        }),
      );
  }
  async loadMoreMessages() {
    let e = this.conversationId,
      s = this.messages.value.nextCursor;
    if (
      !(
        !e ||
        !s ||
        !this.messages.value.hasMore ||
        this.messages.value.isLoadingMore
      )
    ) {
      this.messages.dispatchEvent(
        new p("changed", {
          ...this.messages.value,
          isLoadingMore: !0,
        }),
      );
      try {
        let n = await I(this.config.network, this.config.ailcBaseUrl, {
          path: `assistant/conversations/${encodeURIComponent(e)}/messages`,
          method: "GET",
          query: {
            cursor: s,
            limit: "20",
          },
          signal: this.disposeController.signal,
        });
        this.disposeController.signal.throwIfAborted();
        let i = P(n.data()),
          r = i.messages
            .map(ue)
            .reverse()
            .map((l) => ({
              ...l,
              suggestions: [],
            })),
          a = this.messages.value,
          d = new Set(a.items.map((l) => l.messageId)),
          o = r.filter((l) => !d.has(l.messageId));
        (i.assets &&
          Object.keys(i.assets).length > 0 &&
          this.patchState({
            assets: {
              ...i.assets,
              ...this.state.value.assets,
            },
          }),
          this.messages.dispatchEvent(
            new p("changed", {
              items: [...o, ...a.items],
              hasMore: i.has_more,
              nextCursor: i.next_cursor ?? void 0,
              isLoadingMore: !1,
            }),
          ));
      } catch (n) {
        if (this.disposeController.signal.aborted) return;
        (F.error(
          `Failed to load more messages conversation_id=${e}: ${String(n)}`,
        ),
          this.messages.dispatchEvent(
            new p("changed", {
              ...this.messages.value,
              isLoadingMore: !1,
            }),
          ));
      }
    }
  }
  handleMessageUpserted(e) {
    this.upsertMessage(ue(e));
  }
  handleMessageStreaming(e) {
    let s = this.messages?.value?.items.find(
      (n) => n.messageId === e.message_id,
    );
    this.upsertMessage(Xt(e, s, this.conversationId));
  }
  handleTransientStatusUpdate(e) {
    let s = Zt(e);
    if (!s) {
      F.warn("Ignoring malformed transient_status_update event");
      return;
    }
    let n = Fe(s.kind, s.id);
    (this.transientActivities.set(n, es(s, this.transientActivities.get(n))),
      this.emitLoadingMessage(this.loadingMessage.value.phrase));
  }
  handleTransientStatusFinished(e) {
    let s = ts(e);
    if (!s) {
      F.warn("Ignoring malformed transient_status_finished event");
      return;
    }
    (this.transientActivities.delete(Fe(s.kind, s.id)),
      this.emitLoadingMessage(this.loadingMessage.value.phrase));
  }
  upsertMessage(e) {
    let s = this.messages.value,
      n = s?.items ?? [];
    if (e.messageType === "FROM_USER") {
      let a = n.find(
        (d) =>
          this.optimisticMessageIds.has(d.messageId) && d.message === e.message,
      );
      a &&
        (this.optimisticMessageIds.delete(a.messageId),
        (n = n.filter((d) => d.messageId !== a.messageId)));
    }
    let i = n.findIndex((a) => a.messageId === e.messageId),
      r = i === -1 ? [...n, e] : n.map((a, d) => (d === i ? e : a));
    this.messages.dispatchEvent(
      new p("changed", {
        ...s,
        items: r,
      }),
    );
  }
  sendPrompt(e, s = [], n = {}) {
    let i = Date.now(),
      r = this.state.value.checkpointId;
    return this.performAction(
      {
        action: "SendPrompt",
        action_id: S(),
        expected_version: this.state.value.version,
        payload: {
          ...n.message,
          prompt: e,
          attachments: [...(n.message?.attachments ?? []), ...Jt(s)],
          ...(n.visualEdits && {
            visual_edits: n.visualEdits,
          }),
          ...(n.lensError && {
            lens_error: n.lensError,
          }),
          ...(n.updateOnly && {
            update_only: !0,
          }),
          ...(n.planningAnswers !== void 0 && {
            planning_answers: n.planningAnswers,
          }),
          ...(n.skills?.length && {
            skills: n.skills,
          }),
          ...(n.clarificationId && {
            planning_question_message_id: n.clarificationId,
          }),
          ...(this.config.supportsResumableQuestions && {
            supports_resumable_questions: !0,
          }),
        },
        ...(n.agentMode && {
          agent_mode: n.agentMode,
        }),
      },
      s,
      {
        promptTelemetry: {
          timestampMs: i,
          checkpointId: r,
          type:
            n.telemetryType ??
            (n.visualEdits || n.updateOnly ? "VISUAL_EDIT" : "TEXT"),
          numAttachments: s.length,
          hasRenderOrderChange: (n.visualEdits?.render_order?.length ?? 0) > 0,
        },
      },
    );
  }
  restoreToVersion(e) {
    let s = Date.now(),
      n = this.state.value.checkpointId;
    this.performAction(
      {
        action: "SendPrompt",
        action_id: S(),
        expected_version: this.state.value.version,
        payload: {
          prompt: `Restore to V${e.version}`,
          restore_checkpoint_id: e.id,
        },
      },
      [],
      {
        promptTelemetry: {
          timestampMs: s,
          checkpointId: n,
          type: "TEXT",
          numAttachments: 0,
          hasRenderOrderChange: !1,
        },
      },
    );
  }
  startImmersiveTraining() {
    this.performAction({
      action: "StartImmersiveTraining",
      action_id: S(),
      expected_version: this.state.value.version,
      payload: {},
    });
  }
  regenerateImmersivePreview() {
    this.performAction({
      action: "RegenerateImmersivePreview",
      action_id: S(),
      expected_version: this.state.value.version,
      payload: {},
    });
  }
  async cancel() {
    if (
      this.initialActionPending ||
      !this.conversationId ||
      !this.state.value.allowedActions.has("Cancel")
    )
      return;
    let e = this.conversationId;
    try {
      await this.performAction(
        {
          action: "Cancel",
          action_id: S(),
          expected_version: this.state.value.version,
          payload: {},
        },
        [],
        {
          optimistic: "preserve-state",
        },
      );
    } finally {
      this.disposeController.signal.aborted || this.eventStream.refresh(e);
    }
  }
  getPendingVisualEdits() {
    return this.state.value.pendingVisualEdits;
  }
  patchState(e) {
    let s = {
      ...this.state.value,
      ...e,
    };
    (("readyLens" in e || "lensBuildStatus" in e) &&
      (s.previewLens = is(s.readyLens, s.lensBuildStatus)),
      this.state.dispatchEvent(new p("changed", s)));
  }
  applyOptimisticState(e, s = [], n, i, r) {
    if (r === "preserve-state")
      return (
        this.patchState({
          allowedActions: new Set(),
        }),
        {
          clear: () => {},
        }
      );
    let a = s.map((u) =>
      u.kind === "asset_ref"
        ? {
            name: u.assetRef.asset_type,
          }
        : {
            name:
              u.kind === "file" ? u.fileInfo.filename : u.assetInfo.filename,
            upload_uid: u.uploadResult?.uid,
            download_url: u.uploadResult?.url,
          },
    );
    if (
      (this.patchState({
        conversationState: "Awaiting",
        allowedActions: new Set(),
        pendingVisualEdits: i
          ? {
              user_provided_assets: a,
              visual_edits: i,
            }
          : void 0,
      }),
      !e && !n?.length && !s.length)
    )
      return {
        clear: () => {},
      };
    let d = S(),
      o = {
        conversationId: this.conversationId ?? "",
        messageId: d,
        messageType: "FROM_USER",
        agentName: oe,
        message: e ?? "",
        timestamp: new Date().toISOString(),
        payload: {
          prompt: e ?? "",
          ...(n?.length && {
            skills: n,
          }),
          user_provided_assets: a,
          visual_edits: i,
        },
        skills: n?.filter((u) => typeof u == "string"),
        suggestions: [],
      };
    this.optimisticMessageIds.add(d);
    let l = this.messages.value;
    return (
      this.messages.dispatchEvent(
        new p("changed", {
          ...l,
          items: [...l.items, o],
        }),
      ),
      {
        clear: () => this.removeOptimistic(d),
      }
    );
  }
  removeOptimistic(e) {
    if (!this.optimisticMessageIds.delete(e)) return;
    let s = this.messages.value;
    this.messages.dispatchEvent(
      new p("changed", {
        ...s,
        items: s.items.filter((n) => n.messageId !== e),
      }),
    );
  }
  publishLens(e) {
    return this.dispatchPublishAction("PublishLens", e);
  }
  republishLens(e) {
    return this.dispatchPublishAction("RepublishLens", e);
  }
  async dispatchPublishAction(e, s) {
    let n = await this.performAction(
      {
        action: e,
        action_id: S(),
        expected_version: this.state.value.version,
        payload: s,
      },
      [],
      {
        optimistic: "none",
        parseResponse: !0,
      },
    );
    if (!n?.result)
      throw new Error(
        `${e === "PublishLens" ? "Publish" : "Republish"} action did not return a result.`,
      );
    return n.result;
  }
  async performAction(e, s = [], n = {}) {
    if (this.initialActionPending) return n.parseResponse ? void 0 : !1;
    let i = this.needsInitialSnapshot;
    this.initialActionPending = i;
    let r = n.optimistic ?? "awaiting",
      { clear: a } =
        r !== "none"
          ? this.applyOptimisticState(fn(e), s, rs(e), vn(e), r)
          : {
              clear: () => {},
            };
    try {
      let d = await this.ensureConversationId();
      (await this.eventStream.connect(d),
        i &&
          (await this.waitForInitialSnapshot(),
          (e = {
            ...e,
            expected_version: this.state.value.version,
          })),
        this.disposeController.signal.throwIfAborted(),
        n.promptTelemetry &&
          e.action === "SendPrompt" &&
          this.telemetryReporter.recordPromptSent({
            ...n.promptTelemetry,
            conversationId: d,
            skillCount: rs(e)?.length,
          }));
      let o = await I(this.config.network, this.config.ailcBaseUrl, {
        path: `/assistant/v1/conversations/${encodeURIComponent(d)}/perform_action`,
        method: "POST",
        body: e,
        signal: this.disposeController.signal,
      });
      return n.parseResponse ? P(o.data()) : !0;
    } catch (d) {
      if (this.disposeController.signal.aborted)
        return n.parseResponse ? void 0 : !1;
      if (
        (F.warn(`performAction failed action=${e.action}: ${String(d)}`),
        a(),
        r === "awaiting")
      )
        return (
          this.patchState({
            conversationState: "Error",
          }),
          n.parseResponse ? void 0 : !1
        );
      throw d;
    } finally {
      this.initialActionPending = !1;
    }
  }
  async waitForInitialSnapshot() {
    let { signal: e } = this.disposeController;
    (e.throwIfAborted(),
      this.needsInitialSnapshot &&
        (await new Promise((s, n) => {
          let i = (o) => {
              (clearTimeout(d),
                this.state.removeEventListener("changed", r),
                e.removeEventListener("abort", a),
                o ? n(o) : s());
            },
            r = () => {
              this.needsInitialSnapshot || i();
            },
            a = () => i(e.reason),
            d = setTimeout(
              () => i(new Error("Initial conversation snapshot timed out")),
              gn,
            );
          (this.state.addEventListener("changed", r),
            e.addEventListener("abort", a, {
              once: !0,
            }));
        })));
  }
  async ensureConversation() {
    try {
      let e = await this.ensureConversationId();
      return (await this.eventStream.connect(e), e);
    } catch (e) {
      F.error(
        new Error("ensureConversation failed", {
          cause: e,
        }),
      );
      return;
    }
  }
  async ensureConversationId() {
    if (!this.conversationIdPromise) {
      let { signal: e } = this.disposeController;
      this.conversationIdPromise = (async () => {
        try {
          let s = this.config.conversationOptions,
            n = await I(this.config.network, this.config.ailcBaseUrl, {
              path: "assistant/new_conversation_v2",
              method: "POST",
              body: {
                contentful_stage: s?.contentful_stage ?? ft,
                contentful_environment: s?.contentful_environment ?? vt,
                model_ver: s?.model_ver ?? "",
                client: s?.client ?? "web",
                ls_ver: s?.ls_ver,
                plugin_ver: s?.plugin_ver ?? "1.0",
                lens_checkpoint_id: s?.lens_checkpoint_id,
                timezone: this.config.timezone,
                lscs_route_tag_override_preview:
                  s?.lscs_route_tag_override_preview,
                lscs_route_tag_override_publish:
                  s?.lscs_route_tag_override_publish,
                export_runtime_blocks: s?.export_runtime_blocks,
                supports_planning: !0,
                supports_reasoning_summaries: !0,
                supports_tool_calls: s?.supports_tool_calls ?? !1,
                lens_execution_environment: s?.lens_execution_environment,
              },
              signal: e,
            });
          e.throwIfAborted();
          let i = P(n.data());
          return (
            (this.conversationId = i.conversation_id),
            this.patchState({
              conversationId: this.conversationId,
            }),
            F.info(
              `New conversation created conversation_id=${i.conversation_id}`,
            ),
            this.conversationId
          );
        } catch (s) {
          throw (
            F.warn(`Failed to create new conversation: ${String(s)}`),
            (this.conversationIdPromise = void 0),
            s
          );
        }
      })();
    }
    return this.conversationIdPromise;
  }
};
function fn(t) {
  switch (t.action) {
    case "SendPrompt":
      return t.payload.prompt;
    case "StartImmersiveTraining":
      return me;
  }
}
function rs(t) {
  return t.action === "SendPrompt" ? (t.payload.skills ?? void 0) : void 0;
}
function vn(t) {
  return t.action === "SendPrompt"
    ? (t.payload.visual_edits ?? void 0)
    : void 0;
}
var hn = "IMMERSIVE_ML_PREVIEW",
  qe = "FACEGEN_LIVE_PREVIEW",
  yn = "Preview generation failed",
  En = "Change the prompt for the long generation preview",
  os = "Regenerate";
function ds(t) {
  return {
    asset_type: typeof t.asset_type == "string" ? t.asset_type : hn,
    asset_provider: {
      provider_id: "",
    },
  };
}
function _n(t) {
  return (
    t.status === "SUCCEEDED" ||
    t.status === "FAILED" ||
    t.status === "CANCELLED"
  );
}
function An(t) {
  return t
    .filter(
      (e) =>
        (e.asset_kind === "PREVIEW_AFTER" || e.asset_kind === qe) &&
        e.status === "SUCCEEDED",
    )
    .sort((e, s) => (e.pair_index ?? 0) - (s.pair_index ?? 0))
    .flatMap((e) => (e.download_url ? [e.download_url] : []));
}
function Sn(t) {
  return t.map((e) => e.failure_reason).find((e) => !!e) ?? yn;
}
function In(t, e, s) {
  let n = [
    {
      suggestionId: `${t}-train-immersive-model`,
      type: "FollowUpPrompt",
      isActive: !0,
      isApplied: !1,
      label: me,
      prompt: me,
      intent: "TRAIN_IMMERSIVE_MODEL",
    },
  ];
  return (
    e &&
      n.push({
        suggestionId: `${t}-reprompt-immersive`,
        type: "FollowUpPrompt",
        isActive: !0,
        isApplied: !1,
        label: "Reprompt",
        prompt: En,
        intent: "RESEND_IMMERSIVE_PROMPT",
      }),
    s &&
      n.push({
        suggestionId: `${t}-regenerate-immersive-preview`,
        type: "FollowUpPrompt",
        isActive: !0,
        isApplied: !1,
        label: os,
        prompt: os,
        intent: "REGENERATE_IMMERSIVE_PREVIEW",
      }),
    n
  );
}
function N(t, e, s, n = []) {
  return {
    message_id: t.messageId,
    message_type: e,
    timestamp: t.timestamp ?? x(),
    agent_name: t.agentName,
    message: "",
    immersive_asset_gen_status: s,
    suggestions: n,
  };
}
function ls(t, e, s) {
  if (e.length === 0) return;
  let n = e[0],
    i = e.map((u) => s[u]).filter((u) => u !== void 0),
    r = i.some((u) => u.asset_kind === qe),
    a = r
      ? {
          ...ds(t.payload),
          asset_type: qe,
        }
      : ds(t.payload);
  if (!(i.length === e.length && i.every(_n)))
    return N(t, "IMMERSIVE_PREVIEW", {
      status: "RUNNING",
      id: n,
      recipe: a,
      progress: 0,
    });
  if (i.some((u) => u.status === "CANCELLED"))
    return N(t, "IMMERSIVE_PREVIEW", {
      status: "CANCELLED",
      id: n,
      recipe: a,
    });
  let o = An(i),
    l = t.payload.preview_completion_policy === "allow_partial";
  return o.length > 0 && (l || i.every((u) => u.status === "SUCCEEDED"))
    ? N(
        t,
        "IMMERSIVE_PREVIEW_DONE",
        {
          status: "SUCCESS",
          id: n,
          recipe: a,
          urls: o,
        },
        In(t.messageId, !r, r),
      )
    : N(t, "IMMERSIVE_PREVIEW", {
        status: "FAILED",
        id: n,
        recipe: a,
        error: Sn(i),
      });
}
var bn = "IMMERSIVE_ML_GENERATION",
  wn = "Training failed",
  fe = {
    asset_type: bn,
    asset_provider: {
      provider_id: "",
    },
  };
function us(t, e) {
  let s = t.payload.model_asset_id,
    n = s ? e[s] : void 0;
  if (!n) return;
  if (n.status === "SUCCEEDED")
    return N(t, "IMMERSIVE_TRAINING_DONE", {
      status: "SUCCESS",
      id: t.messageId,
      recipe: fe,
      urls: [],
    });
  if (n.status === "CANCELLED")
    return N(t, "IMMERSIVE_TRAINING", {
      status: "CANCELLED",
      id: t.messageId,
      recipe: fe,
    });
  if (n.status === "FAILED")
    return N(t, "IMMERSIVE_TRAINING", {
      status: "FAILED",
      id: t.messageId,
      recipe: fe,
      error: n.failure_reason ?? wn,
    });
  let i = t.payload.preview_asset_id;
  return N(t, "IMMERSIVE_TRAINING", {
    status: "RUNNING",
    id: t.messageId,
    recipe: fe,
    previewImageUrl: (i ? e[i]?.download_url : void 0) ?? void 0,
  });
}
var kn = 3,
  ve = class {
    constructor(e) {
      this.config = e;
    }
    config;
    uploads = new y([]);
    _uploadControllers = new Map();
    hasActiveUploads() {
      let e = new Set(["uploaded", "failed", "canceled"]);
      return this.uploads.value.some(({ status: s }) => !e.has(s));
    }
    add(e) {
      let s = e
        .map((n) => {
          if ("assetRecipe" in n) return this.createUploadFromAsset(n);
          if ("data" in n)
            return bt(n.mimeType, n.data.byteLength)
              ? void 0
              : {
                  kind: "file",
                  fileInfo: n,
                  localId: R(),
                  status: "queued",
                  progress: 0,
                };
        })
        .filter((n) => n !== void 0);
      return (this.emit([...this.uploads.value, ...s]), this.pumpUploads(), s);
    }
    createUploadFromAsset(e) {
      return {
        kind: "asset",
        assetInfo: e,
        localId: R(),
        status: "uploaded",
        progress: 100,
        uploadResult: {
          uid: e.uploadUuid,
          url: e.url,
        },
      };
    }
    remove(e) {
      (this._uploadControllers.get(e)?.abort(),
        this._uploadControllers.delete(e),
        this.emit(this.uploads.value.filter((s) => s.localId !== e)));
    }
    removeMultiple(e) {
      let s = new Set(e);
      for (let n of s)
        (this._uploadControllers.get(n)?.abort(),
          this._uploadControllers.delete(n));
      this.emit(this.uploads.value.filter((n) => !s.has(n.localId)));
    }
    retry(e) {
      let s = this.uploads.value.find((n) => n.localId === e);
      s &&
        (this._uploadControllers.has(e) ||
          (this.updateDraft(s, {
            status: "queued",
            progress: 0,
            error: void 0,
          }),
          this.pumpUploads()));
    }
    clear() {
      for (let [, e] of this._uploadControllers)
        try {
          e.abort();
        } catch {}
      (this._uploadControllers.clear(), this.emit([]));
    }
    reset() {
      this.clear();
    }
    consumeReadyUploads() {
      let e = [],
        s = [];
      for (let n of this.uploads.value)
        (n.status === "uploaded" ? e : s).push(n);
      return (this.emit(s), e);
    }
    waitForUploads(e) {
      let s = new Set(e);
      return new Promise((n) => {
        let i = () =>
          this.uploads.value
            .filter((d) => s.has(d.localId))
            .every((d) => d.status === "uploaded" || d.status === "failed")
            ? (n(), !0)
            : !1;
        if (i()) return;
        let r = () => {
          i() && this.uploads.removeEventListener("changed", r);
        };
        this.uploads.addEventListener("changed", r);
      });
    }
    pumpUploads() {
      let e = this.uploads.value.filter((s) => s.kind === "file");
      for (; !(e.filter((i) => i.status === "uploading").length >= kn); ) {
        let n = e.find((i) => i.status === "queued");
        if (!n) break;
        this.upload(n).finally(() => this.pumpUploads());
      }
    }
    async upload(e) {
      this.updateDraft(e, {
        status: "uploading",
        progress: 0,
        error: void 0,
      });
      let s = new AbortController();
      this._uploadControllers.set(e.localId, s);
      try {
        let n = await I(this.config.network, this.config.snapMlBaseUrl, {
          path: "api/uploads",
          method: "POST",
          formData: {
            ...e.fileInfo,
            name: "media",
          },
          signal: s.signal,
        });
        s.signal.throwIfAborted();
        let i = P(n.data());
        (s.signal.throwIfAborted(),
          this.updateDraft(e, {
            status: "uploaded",
            progress: 100,
            uploadResult: i,
          }));
      } catch (n) {
        this.updateDraft(e, {
          status: s.signal.aborted ? "canceled" : "failed",
          progress: 100,
          error: n,
        });
      } finally {
        this._uploadControllers.delete(e.localId);
      }
    }
    emit(e = this.uploads.value) {
      this.uploads.dispatchEvent(new p("changed", [...e]));
    }
    updateDraft(e, s) {
      (Object.assign(e, s), this.emit());
    }
  };
var G = A("VariationGeneration"),
  cs = 3e3,
  Pn = 30,
  Rn = 60,
  Tn = 40;
function gs() {
  return {
    ...xt,
  };
}
async function ms(t, e, s, n, i, r) {
  for (let a = 0; a < i; a++) {
    (n.throwIfAborted(), await Me(cs));
    let d = await I(t, e, {
        path: `api/snap-video-gen/${s}`,
        method: "GET",
        signal: n,
      }),
      o = P(d.data());
    if (o.state === "SUCCESS") return o;
    if (o.state === "FAILED") throw new Error(`${r} generation failed`);
  }
  throw new Error(`${r} generation timed out`);
}
async function Ln(t, e, s, n, i) {
  let r = await I(t, e, {
    path: "api/snap-video-gen",
    method: "POST",
    body: {
      prompt: s.prompt,
      numberOfPreviews: 1,
      generateType: "snapgen-t2i-vanilla",
      generationArgs: gs(),
      uploadToBolt: !1,
      inputUploadUids: [],
    },
    signal: i,
  });
  i.throwIfAborted();
  let a = P(r.data()),
    d = await ms(t, e, a.id, i, Pn, "Image"),
    o = d.previews?.[0];
  if (!o) throw new Error("No preview generated");
  return {
    kind: "image",
    variationIndex: n,
    previewUrl: o.targetUrl || d.previewUrl || "",
    uploadUid: o.targetUploadUid || "",
    prompt: s.prompt,
  };
}
async function Mn(t, e, s, n, i) {
  let r = await I(t, e, {
    path: "api/snap-video-gen",
    method: "POST",
    body: {
      prompt: s.prompt,
      numberOfPreviews: 1,
      generateType: "snapvideo-t2v",
      generationArgs: gs(),
      uploadToBolt: !1,
      inputUploadUids: [],
    },
    signal: i,
  });
  i.throwIfAborted();
  let a = P(r.data()),
    d = await ms(t, e, a.id, i, Rn, "Video"),
    o = d.previews?.[0];
  if (!o) throw new Error("No video preview generated");
  return {
    kind: "video",
    variationIndex: n,
    previewUrl: o.targetUrl || d.previewUrl || "",
    uploadUid: o.targetUploadUid || "",
    prompt: s.prompt,
  };
}
async function ps(t, e, s, n, i) {
  for (let r = 0; r < Tn; r++) {
    (i.throwIfAborted(), await Me(cs));
    let a = await I(t, e, {
        path: n,
        method: "GET",
        signal: i,
      }),
      d = P(a.data());
    if (d.status === "SUCCESS" && d.result) return d.result;
    if (d.status === "FAILED")
      throw new Error(`Fast selfie generation failed for ${s}`);
  }
  throw new Error(`Fast selfie generation timed out for ${s}`);
}
async function Cn(t, e, s, n, i, r) {
  let a = String(n + 1);
  G.info(`generateSelfieVariationPreview: index=${n}, seed=${a}`);
  let d = await I(t, e, {
    path: "api/fast-selfie-attachments",
    method: "POST",
    body: {
      prompt: s.prompt,
      seed: a,
    },
    signal: i,
  });
  i.throwIfAborted();
  let { id: o } = P(d.data());
  G.info(`generateSelfieVariationPreview: started id=${o}`);
  let l = ps(t, e, o, `api/fast-selfie-attachments/${o}/preview`, i),
    u = ps(t, e, o, `api/fast-selfie-attachments/${o}`, i);
  u.catch(() => {});
  let m = await l;
  (i.throwIfAborted(),
    G.info(`generateSelfieVariationPreview: preview ready for id=${o}`));
  let g = {
    kind: "selfie",
    variationIndex: n,
    previewUrl: m,
    prompt: s.prompt,
    selfieAssetId: o,
  };
  r?.(g);
  let f = await u;
  return (
    i.throwIfAborted(),
    G.info(`generateSelfieVariationPreview: PLY ready for index=${n}`),
    (g.plyGcsUrl = f),
    r?.(g),
    g
  );
}
async function Un(t, e, s, n = "image", i, r, a) {
  return (
    G.info(`generateSingleVariationPreview: index=${e}, assetOutput=${n}`),
    n === "ply_base64"
      ? Cn(i, r, t, e, s, a)
      : n === "video"
        ? Mn(i, r, t, e, s)
        : Ln(i, r, t, e, s)
  );
}
async function fs(t, e, s = "image", n, i, r, a) {
  G.info(`generateVariationPreviews: count=${t.length}, assetOutput=${s}`);
  let d = new Array(t.length).fill(void 0),
    o = [],
    l = !1,
    u = t.map((g, f) =>
      Un(g, f, e, s, n, i, r)
        .then((c) => {
          ((d[c.variationIndex] = c), Ce[c.kind].progressOnResolve && r?.(c));
        })
        .catch((c) => {
          if (e.aborted) return;
          St(c) && (l = !0);
          let v = {
            variationIndex: f,
            error: c?.message || "Unknown error",
          };
          (o.push(v), a?.(v));
        }),
    );
  await Promise.all(u);
  let m = d.filter((g) => g !== void 0);
  return (
    G.info(
      `generateVariationPreviewsComplete: success=${m.length}, errors=${o.length}, contentViolation=${l}`,
    ),
    {
      previews: m,
      errors: o,
      hasContentViolation: l,
    }
  );
}
var vs = A("VariationPreviewManager"),
  he = class {
    constructor(e) {
      this.config = e;
    }
    config;
    states = new Map();
    controller;
    inFlight = Promise.resolve();
    start(e) {
      let { blockId: s, variations: n, assetKey: i, originalPrompt: r } = e;
      this.cancel();
      let a = new AbortController();
      this.controller = a;
      let d = a.signal,
        o = L(e.assetOutput),
        l = new Array(n.length).fill(void 0),
        u = new Set(),
        m = () => [...l];
      (this.setState(s, {
        previews: [],
        loading: !0,
        error: void 0,
        failedSlots: void 0,
        backendAssetKey: i ?? this.states.get(s)?.backendAssetKey,
        backendPrompt: r ?? this.states.get(s)?.backendPrompt,
      }),
        (this.inFlight = (async () => {
          let g = await fs(
            n,
            d,
            o,
            this.config.network,
            this.config.snapMlBaseUrl,
            (c) => {
              d.aborted ||
                ((l[c.variationIndex] = c),
                this.mergeState(s, {
                  previews: m(),
                  loading: !0,
                  error: void 0,
                  failedSlots: u,
                }));
            },
            (c) => {
              d.aborted ||
                (u.add(c.variationIndex),
                this.mergeState(s, {
                  previews: m(),
                  loading: !0,
                  error: void 0,
                  failedSlots: u,
                }),
                this.config.onVariationError?.(s, c.error));
            },
          );
          d.throwIfAborted();
          let f = g.hasContentViolation
            ? "This prompt may not meet our content guidelines. Try adjusting it and click More Options."
            : g.errors.length > 0 && g.previews.length === 0
              ? "Generation failed. Try More Options."
              : void 0;
          (f &&
            vs.warn(
              `[Variations] generation error (hidden from UI): ${f} [block=${s}, previews=${g.previews.length}, errors=${g.errors.length}, contentViolation=${g.hasContentViolation}]`,
            ),
            this.mergeState(s, {
              previews: m(),
              loading: !1,
              error: f,
              failedSlots: u,
            }));
        })().catch((g) => {
          d.aborted ||
            (vs.warn(
              `[Variations] generation rejected [block=${s}]: ${g?.message ?? g}`,
            ),
            this.mergeState(s, {
              loading: !1,
            }));
        })));
    }
    cancel() {
      this.controller?.abort();
      let e = !1;
      for (let [s, n] of this.states)
        n.loading &&
          (this.states.set(s, {
            ...n,
            loading: !1,
          }),
          (e = !0));
      (e || this.states.size > 0) && this.config.onChange();
    }
    applyTo(e) {
      if (this.states.size === 0) return e;
      let s = e.slice();
      for (let [n, i] of this.states) {
        let r = -1;
        for (let o = s.length - 1; o >= 0; o--)
          if (
            s[o].suggestions
              ?.filter((l) => l.type === "VisualEdit")
              .some((l) => l.blockKey === n)
          ) {
            r = o;
            break;
          }
        if (r === -1) continue;
        let a = s[r],
          d = a.variationsState?.[n];
        s[r] = {
          ...a,
          variationsState: {
            ...a.variationsState,
            [n]: {
              previews: i.previews,
              loading: i.loading,
              error: i.error,
              failedSlots: i.failedSlots,
              backendAssetKey: i.backendAssetKey ?? d?.backendAssetKey,
              backendPrompt: i.backendPrompt ?? d?.backendPrompt,
            },
          },
        };
      }
      return s;
    }
    whenIdle() {
      return this.inFlight;
    }
    setState(e, s) {
      (this.states.set(e, s), this.config.onChange());
    }
    mergeState(e, s) {
      let n = this.states.get(e) ?? {
        previews: [],
        loading: !1,
      };
      (this.states.set(e, {
        ...n,
        ...s,
      }),
        this.config.onChange());
    }
  };
var Ee = "visualEditsDrainCancelled",
  ye = class {
    constructor(e) {
      this.config = e;
    }
    config;
    visualEdits = new y(void 0);
    assetNameToFilename = new Map();
    pendingAssets = [];
    pendingAssetLocalIds = [];
    pendingStateGeneration = 0;
    queue(e, s) {
      let n = e.user_provided_assets ?? [];
      for (let o of n) {
        let l = It(o.file_ref.type),
          u = o.name.includes(".") ? o.name : o.name + l;
        this.assetNameToFilename.set(o.name, u);
      }
      let i = this.visualEdits.value?.visualEdits ?? {
          blocks: {},
        },
        r = Vn(i, e),
        a = this.visualEdits.value?.message,
        d = a && s ? Rt(a, s) : (s ?? a);
      this.setPendingVisualEdits(r, d);
    }
    setPendingVisualEdits(e, s) {
      if (((this.pendingAssets = e.user_provided_assets ?? []), xn(e))) {
        this.visualEdits.dispatchEvent(new p("changed", void 0));
        return;
      }
      this.visualEdits.dispatchEvent(
        new p("changed", {
          suggestionIds: this.visualEdits.value?.suggestionIds ?? [],
          visualEdits: e,
          lensPayload: $e(e),
          message: s,
        }),
      );
    }
    queueBlockVisibility(e, s) {
      if (!s) {
        this.queue({
          blocks: {
            [e]: {
              enabled: !1,
            },
          },
        });
        return;
      }
      let n = this.visualEdits.value?.visualEdits.blocks?.[e],
        i = n != null && Object.keys(n).some((r) => r !== "enabled");
      this.queue({
        blocks: {
          [e]: i
            ? {
                enabled: !0,
              }
            : void 0,
        },
      });
    }
    clear() {
      ((this.pendingStateGeneration += 1),
        this.pendingAssetLocalIds.length > 0 &&
          this.config.uploadManager.removeMultiple(this.pendingAssetLocalIds),
        this.visualEdits.dispatchEvent(new p("changed", void 0)),
        this.assetNameToFilename.clear(),
        (this.pendingAssets = []),
        (this.pendingAssetLocalIds = []));
    }
    drain() {
      let e = this.visualEdits.value;
      if (
        (this.visualEdits.dispatchEvent(new p("changed", void 0)),
        (this.pendingAssets = []),
        (this.pendingAssetLocalIds = []),
        e)
      ) {
        (this.assetNameToFilename.size > 0 &&
          (Nn(
            e.visualEdits.blocks,
            Object.fromEntries(this.assetNameToFilename),
          ),
          this.assetNameToFilename.clear()),
          wt(e.visualEdits, e.visualEdits.user_provided_assets),
          delete e.visualEdits.user_provided_assets);
        for (let [s, n] of Object.entries(e.visualEdits.blocks ?? {}))
          n?.enabled === !1 && (e.visualEdits.blocks[s] = null);
      }
      return e;
    }
    async drainWithAssets() {
      let e = this.pendingStateGeneration;
      if (this.pendingAssets.length > 0) {
        if (
          (await this.fetchAndUploadAssets(this.pendingAssets, e),
          e !== this.pendingStateGeneration)
        )
          return Ee;
        ((this.pendingAssets = []), (this.pendingAssetLocalIds = []));
      }
      return this.drain();
    }
    async fetchAndUploadAssets(e, s) {
      let n = new Set(
        this.config.uploadManager.uploads.value.map((d) => d.localId),
      );
      if (
        !(
          this.pendingAssetLocalIds.length === e.length &&
          this.pendingAssetLocalIds.every((d) => n.has(d))
        )
      ) {
        let d = await Promise.all(
          e.map((l) => kt(l, this.config.network, AbortSignal.timeout(3e4))),
        );
        if (s !== this.pendingStateGeneration) return;
        let o = this.config.uploadManager.add(d);
        this.pendingAssetLocalIds = o.map((l) => l.localId);
      }
      await this.config.uploadManager.waitForUploads(this.pendingAssetLocalIds);
      let r = new Set(
          this.config.uploadManager.uploads.value
            .filter((d) => d.status === "uploaded")
            .map((d) => d.localId),
        ),
        a = this.pendingAssetLocalIds.filter((d) => !r.has(d)).length;
      if (a > 0) throw new Error(`${a} asset upload(s) failed`);
    }
  };
function $e(t) {
  return {
    action: "apply_user_changes",
    data: {
      changesData: JSON.stringify(t),
    },
  };
}
function xn(t) {
  return !(
    (t.blocks && Object.keys(t.blocks).length > 0) ||
    (t.controller && Object.keys(t.controller).length > 0) ||
    (t.render_order && t.render_order.length > 0) ||
    (t.uiState && Object.keys(t.uiState).length > 0) ||
    (t.user_provided_assets && t.user_provided_assets.length > 0)
  );
}
function Vn(t, e) {
  if (
    (e?.uiState && (t.uiState = e.uiState),
    "render_order" in e &&
      (e.render_order
        ? (t.render_order = e.render_order)
        : delete t.render_order),
    e?.user_provided_assets)
  ) {
    let s = new Map((t.user_provided_assets ?? []).map((n) => [n.name, n]));
    for (let n of e.user_provided_assets) s.set(n.name, n);
    t.user_provided_assets = Array.from(s.values());
  }
  if (
    (e?.controller &&
      (t.controller
        ? (e.controller.code !== void 0 &&
            (t.controller.code = e.controller.code),
          e.controller.inputs &&
            (t.controller.inputs = {
              ...(t.controller.inputs || {}),
              ...e.controller.inputs,
            }))
        : (t.controller = e.controller)),
    !e?.blocks)
  )
    return t;
  if (!t.blocks) return ((t.blocks = e.blocks), t);
  for (let s in e.blocks) {
    let n = e.blocks[s];
    if (n === void 0) {
      delete t.blocks[s];
      continue;
    }
    if (n === null) {
      t.blocks[s] = null;
      continue;
    }
    let i = t.blocks[s];
    if (i !== null) {
      if (!i) t.blocks[s] = n;
      else if (
        ("enabled" in n && (i.enabled = n.enabled),
        n.blockId !== void 0 && (i.blockId = n.blockId),
        n.is_realtime_added_block !== void 0 &&
          (i.is_realtime_added_block = n.is_realtime_added_block),
        n.runtime_block_bundle_url !== void 0 &&
          (i.runtime_block_bundle_url = n.runtime_block_bundle_url),
        i.inputs || n.inputs)
      ) {
        let r = {
          ...(i.inputs || {}),
          ...(n.inputs || {}),
        };
        if (i.is_realtime_added_block)
          for (let [a, d] of Object.entries(r)) {
            let o = i.inputs?.[a]?.type;
            d.type === void 0 &&
              o !== void 0 &&
              (r[a] = {
                ...d,
                type: o,
              });
          }
        i.inputs = r;
      }
    }
  }
  return t;
}
function Nn(t, e) {
  if (!(!t || Object.keys(e).length === 0))
    for (let s of Object.keys(t)) {
      let n = t[s];
      if (n?.inputs)
        for (let i of Object.keys(n.inputs)) {
          let r = n.inputs[i];
          if (r?.type === "user_provided_asset" && r?.value?.id) {
            let a = e[r.value.id];
            a && (r.value.id = a);
          }
        }
    }
}
var On = "Building your Lens now, please wait...",
  We = A("BackendChatAdapter"),
  Dn = {
    loadingPhrase: "",
    conversationId: void 0,
    conversationIdPromise: void 0,
    messagesCursor: void 0,
    error: void 0,
    pendingVisualEdits: void 0,
    pendingLensError: void 0,
    preloadedAssets: [],
  },
  Bn = {
    messages: [],
    hasMore: !1,
    isLoadingMore: !1,
  };
function _e(t) {
  throw new Error(`BackendChatAdapter.${t} is not implemented yet`);
}
function Fn(t, e, s) {
  let n = Le(t.name),
    i = n.startsWith("image/") || n.startsWith("video/");
  if (!(!t.download_url && i))
    return {
      kind: "file",
      localId: `${e}-asset-${s}`,
      status: "uploaded",
      progress: 100,
      fileInfo: {
        filename: t.name,
        data: new ArrayBuffer(0),
        mimeType: n,
      },
      uploadResult: t.download_url
        ? {
            uid: t.upload_uid ?? "",
            url: t.download_url,
          }
        : void 0,
    };
}
function Gn(t, e) {
  let s = e.user_provided_assets;
  if (!s || s.length === 0) return;
  let n = s.map((i, r) => Fn(i, t, r)).filter((i) => i !== void 0);
  return n.length > 0 ? n : void 0;
}
function qn(t) {
  let e = t.messageType === "LENS_FINISHED",
    s = e ? (t.payload?.suggested_post_actions ?? []) : [],
    n = e ? "ASK_USER" : t.messageType,
    i = [
      ...t.suggestions.map((a, d) => ({
        suggestionId: `${t.messageId}-conv-${d}`,
        type: "ConversationalPrompt",
        prompt: a,
        label: a,
        isActive: !0,
        isApplied: !1,
      })),
      ...s.map((a) => ({
        suggestionId: `post-action-${a.prompt}`,
        type: "FollowUpPrompt",
        prompt: a.prompt,
        label: a.label,
        isActive: !0,
        isApplied: !1,
      })),
    ],
    r =
      t.messageType === "ERROR" && t.payload.error_code === At
        ? _t(t.message || "An error occurred while processing your request.")
        : void 0;
  return {
    message_id: t.messageId,
    showForkButton: t.payload.show_fork_button === !0,
    message_type: n,
    feedbackMessageId: t.canProvideFeedback ? t.messageId : void 0,
    agent_name: t.agentName,
    timestamp: t.timestamp ?? x(),
    message: t.message,
    payload: t.payload,
    clarification: t.clarification,
    attachments: Gn(t.messageId, t.payload),
    checkpoint: t.payload.checkpoint ?? void 0,
    skills: t.skills,
    suggestions: i,
    error: r,
    isStreaming: t.isStreaming,
  };
}
function $n(t, e) {
  return U(t) === U(e);
}
function Wn(t, e, s) {
  if (e.length === 0) return t;
  let n = -1;
  for (let r = t.length - 1; r >= 0; r--)
    if (t[r].message_type === "LENS_RECIPE") {
      n = r;
      break;
    }
  if (n === -1) {
    for (let r = t.length - 1; r >= 0; r--)
      if (t[r].message_type === "ASK_USER") {
        n = r;
        break;
      }
  }
  if (n === -1) return t;
  let i = e.map((r) => {
    let a =
      r.supports_variations === !0 ||
      r.label.startsWith("Background Image") ||
      r.label.includes("Selfie Attachment");
    if (r.kind === "visual_edit" || a) {
      let d = s
        ? Ve(
            r.block_id,
            s,
            r.variation_kind ?? void 0,
            r.input_variations ?? void 0,
          )
        : void 0;
      return {
        type: "VisualEdit",
        suggestionId: `block-${r.block_id}`,
        label: r.label,
        description: r.description ?? void 0,
        isExclusive: r.is_exclusive ?? void 0,
        community_creator_details: r.community_creator_details ?? void 0,
        isActive: !0,
        lensPayload: r.lens_payload ?? {
          action: "enable_gizmo",
          data: {
            block_id: r.block_id,
            enabled: !0,
          },
        },
        blockKey: r.block_id,
        isApplied: !1,
        supportsVariations: a,
        variationInfo: d,
      };
    }
    return {
      type: "VisualBlockInfo",
      suggestionId: `block-${r.block_id}`,
      label: r.label,
      description: r.description ?? void 0,
      isExclusive: r.is_exclusive ?? void 0,
      community_creator_details: r.community_creator_details ?? void 0,
      blockKey: r.block_id,
      isActive: !0,
      isApplied: !1,
    };
  });
  return t.map((r, a) =>
    a === n
      ? {
          ...r,
          suggestions: [...i, ...(r.suggestions ?? [])],
        }
      : r,
  );
}
function Kn(t) {
  let e = t?.variations_info,
    s = t,
    n = e?.variations ?? s?.variations,
    i = e?.block_id ?? s?.block_id;
  if (!(!n || !i))
    return {
      variations: n,
      blockId: i,
      assetOutput: e?.asset_output ?? s?.asset_output,
      assetKey: e?.asset_key ?? s?.asset_key,
      originalPrompt: e?.original_prompt ?? s?.original_prompt,
    };
}
function jn(t) {
  return t.messageType !== "FROM_USER"
    ? !1
    : t.payload.asset_variation_request != null;
}
function Qn(t) {
  return {
    message_id: R(),
    timestamp: x(),
    agent_name: X,
    message: t,
    message_type: "LOADING",
  };
}
function Yn(t) {
  if (!t) return;
  if (t.kind === "placeholder")
    return {
      kind: "placeholder",
      rawRecipe: t.rawRecipe,
      runtimeBlocks: zn(t.runtimeBlocks),
    };
  let e = hs(t.lens);
  return e
    ? {
        kind: "ready",
        lens: e,
      }
    : void 0;
}
function zn(t) {
  let e = {};
  for (let [s, n] of Object.entries(t ?? {})) {
    let { status: i, download_url: r } = n;
    !i ||
      i === "NOT_STARTED" ||
      (e[s] = r
        ? {
            status: i,
            download_url: r,
          }
        : {
            status: i,
          });
  }
  return e;
}
function Hn(t, e) {
  return {
    message_id: t,
    timestamp: x(),
    agent_name: X,
    message: On,
    message_type: "LENS_GENERATION",
    lens_generation_statuses: e,
  };
}
function hs(t) {
  if (!(!t || !t.checksum || (!Ze(t) && (!t.name || !t.url))))
    return {
      name: t.name,
      url: t.url,
      checksum: t.checksum,
      iconData: t.iconData,
      supportsFullscreen: t.supportsFullscreen,
      previews: t.previews?.map((e) => ({
        download_url: e.downloadUrl,
        label: e.label,
        status: e.status,
      })),
      recipe: Pt(JSON.stringify(t.recipe)),
      hasFailedAssets: !1,
      assetManifest: t.assetManifest,
      featureMetadata: t.featureMetadata,
      lensDescriptors: t.lensDescriptors,
      webLensPreviewUrl: t.webLensPreviewUrl,
    };
}
var Ae = class {
  state;
  messages;
  loadingMessage;
  uploads;
  visualEdits;
  lens;
  previewLens;
  telemetry;
  innerChat;
  allowedActions;
  blocks = [];
  lensBuildMessageId;
  context;
  uploadManager;
  visualEditsManager;
  pendingAssetRefs;
  variationPreviewManager;
  handledVariationMessageIds = new Set();
  awaitingVariationsForBlocks = new Set();
  variationRequestInFlight = !1;
  constructor(e) {
    ((this.innerChat = new ge(e)),
      (this.pendingAssetRefs = e.conversationOptions?.asset_refs ?? void 0),
      (this.allowedActions = new Set(
        this.innerChat.state.value.allowedActions,
      )),
      (this.context = {
        ...Dn,
        conversationId: this.innerChat.state.value.conversationId,
      }),
      (this.uploadManager = new ve({
        network: e.network,
        snapMlBaseUrl: W,
      })),
      (this.visualEditsManager = new ye({
        network: e.network,
        uploadManager: this.uploadManager,
      })),
      (this.variationPreviewManager = new he({
        network: e.network,
        snapMlBaseUrl: W,
        onChange: () => this.emitMessagesFromInner(),
        onVariationError: (s, n) =>
          this.telemetry.dispatchEvent(
            new p("variation-error", {
              blockKey: s,
              errorType: n,
            }),
          ),
      })),
      (this.state = new y({
        current: e.initial?.state ?? "Initial",
        previous: void 0,
        context: this.context,
      })),
      (this.messages = new y(e.initial?.messages ?? Bn)),
      (this.loadingMessage = new y({
        active: !1,
        message: void 0,
      })),
      (this.uploads = this.uploadManager.uploads),
      (this.visualEdits = this.visualEditsManager.visualEdits),
      (this.lens = new y(e.initial?.lens)),
      (this.previewLens = new y(
        e.initial?.lens
          ? {
              kind: "ready",
              lens: e.initial.lens,
            }
          : void 0,
      )),
      (this.telemetry = this.innerChat.telemetry),
      this.innerChat.state.addEventListener("changed", (s) =>
        this.onBackendStateChanged(s.detail),
      ),
      this.innerChat.messages.addEventListener("changed", (s) =>
        this.onBackendMessagesChanged(s.detail),
      ),
      this.innerChat.loadingMessage.addEventListener("changed", (s) =>
        this.onBackendLoadingMessageChanged(s.detail),
      ));
  }
  publishLens(e) {
    return this.innerChat.publishLens(e);
  }
  republishLens(e) {
    return this.innerChat.republishLens(e);
  }
  canRepublish() {
    return (
      this.innerChat.state.value.republishEligibility?.can_republish === !0
    );
  }
  onBackendLoadingMessageChanged(e) {
    if (!e.active) this.variationRequestInFlight = !1;
    else if (this.variationRequestInFlight) return;
    let s = e.active ? e.transientActivities : void 0,
      n = s?.findLast((i) => i.kind === "reasoning")?.summary;
    this.loadingMessage.dispatchEvent(
      new p(
        "changed",
        e.active && n
          ? {
              active: !0,
              reasoning: n,
              ...(s && {
                transientActivities: s,
              }),
            }
          : e.active
            ? {
                active: !0,
                message: Qn(e.phrase),
                ...(s && {
                  transientActivities: s,
                }),
              }
            : {
                active: !1,
                message: void 0,
              },
      ),
    );
  }
  onBackendStateChanged(e) {
    ((this.allowedActions = e.allowedActions),
      e.conversationId &&
        !this.context.conversationId &&
        (this.context.conversationId = e.conversationId));
    let s = this.state.value;
    this.state.dispatchEvent(
      new p("changed", {
        ...s,
        previous: s.current,
        current: e.conversationState,
      }),
    );
    let n = hs(e.readyLens),
      i = !this.lens.value?.previews?.length && !!n?.previews?.length,
      r = !this.lens.value?.url && !!n?.url;
    ((i || r || !n?.checksum || n?.checksum !== this.lens.value?.checksum) &&
      this.lens.dispatchEvent(new p("changed", n)),
      !$n(this.blocks, e.blocks) && (this.blocks = e.blocks),
      e.lensBuildStatus !== void 0 && this.lensBuildMessageId === void 0
        ? (this.lensBuildMessageId = R())
        : e.lensBuildStatus === void 0 &&
          this.lensBuildMessageId !== void 0 &&
          (this.lensBuildMessageId = void 0),
      this.emitMessagesFromInner());
    let d = Yn(e.previewLens);
    this.shouldEmitPreviewLens(d) &&
      this.previewLens.dispatchEvent(new p("changed", d));
  }
  shouldEmitPreviewLens(e) {
    let s = this.previewLens.value;
    return e?.kind === "placeholder"
      ? !0
      : e?.kind === "ready"
        ? s?.kind !== "ready" || s.lens.checksum !== e.lens.checksum
        : s !== void 0;
  }
  onBackendMessagesChanged(e) {
    this.emitMessagesFromInner();
  }
  startVariationPreviewsForNewMessages(e) {
    for (let s of e.items) {
      if (
        s.messageType !== "ASSET_VARIATIONS" ||
        this.handledVariationMessageIds.has(s.messageId)
      )
        continue;
      this.handledVariationMessageIds.add(s.messageId);
      let n = Kn(s.payload);
      if (!n || !this.awaitingVariationsForBlocks.has(n.blockId)) continue;
      this.awaitingVariationsForBlocks.delete(n.blockId);
      let i = Dt(this.lens.value?.recipe, n.blockId) ?? L(n.assetOutput);
      this.variationPreviewManager.start({
        blockId: n.blockId,
        variations: n.variations,
        assetOutput: i,
        assetKey: n.assetKey,
        originalPrompt: n.originalPrompt,
      });
    }
  }
  emitMessagesFromInner() {
    let e = this.innerChat.messages.value;
    this.startVariationPreviewsForNewMessages(e);
    let s = this.innerChat.state.value.assets,
      n = e.items.flatMap((o) => {
        if (jn(o)) return [];
        if (o.messageType === "ASSET_VARIATIONS") return [];
        if (o.messageType === "ASSET_RECIPE") {
          let l = $t(o, Oe(o.payload), s);
          return l ? [l] : [];
        }
        if (o.messageType === "LONG_GENERATION_RECIPE") {
          let l = ls(o, Oe(o.payload), s);
          if (l) return [l];
        }
        if (o.messageType === "IMMERSIVE_ML_TRAINING") {
          let l = us(o, s);
          return l ? [l] : [];
        }
        return [qn(o)];
      }),
      i = this.innerChat.state.value.lensBuildStatus,
      r = i ? n : Wn(n, this.blocks, this.lens.value?.recipe),
      a =
        i && this.lensBuildMessageId
          ? [...r, Hn(this.lensBuildMessageId, i)]
          : r,
      d = this.variationPreviewManager.applyTo(a);
    (Wt(d),
      !(d.length === 0 && this.messages.value.messages.length > 0) &&
        this.messages.dispatchEvent(
          new p("changed", {
            messages: d,
            hasMore: e.hasMore,
            isLoadingMore: e.isLoadingMore,
          }),
        ));
  }
  canPerformAction(e) {
    return this.getAllowedActions().has(e);
  }
  getAllowedActions() {
    let e = new Set(this.allowedActions);
    return (this.uploadManager.hasActiveUploads() && e.delete("SendPrompt"), e);
  }
  sendPrompt(e, s) {
    this.sendPromptWithTelemetry(e, s);
  }
  sendPromptWithTelemetry(e, s, n) {
    (async () => {
      let i;
      try {
        i = await this.visualEditsManager.drainWithAssets();
      } catch (l) {
        We.error(
          `Failed to prepare visual edit assets: ${l instanceof Error ? l.message : String(l)}`,
        );
        return;
      }
      if (i === Ee) return;
      let r = this.drainPendingLensError(),
        a = this.pendingAssetRefs,
        d = [
          ...this.uploadManager.consumeReadyUploads(),
          ...(a?.map((l) => ({
            kind: "asset_ref",
            assetRef: l,
          })) ?? []),
        ];
      (await this.innerChat.sendPrompt(e, d, {
        message: s?.message,
        visualEdits: i?.visualEdits,
        lensError: r
          ? {
              error_message: r.errorMessage,
            }
          : void 0,
        planningAnswers: s?.planningAnswers,
        clarificationId: s?.clarificationId,
        agentMode: s?.agentMode,
        skills: s?.skills,
        telemetryType: n ?? (i?.visualEdits ? "VISUAL_EDIT" : "TEXT"),
      })) &&
        a === this.pendingAssetRefs &&
        (this.pendingAssetRefs = void 0);
    })();
  }
  applySuggestedPrompt(e, s) {
    let n = Ue(this.messages.value.messages, e);
    if (
      (n.type !== "ConversationalPrompt" &&
        n.type !== "FollowUpPrompt" &&
        _e(`applySuggestedPrompt for ${n.type}`),
      !n.isActive)
    ) {
      We.warn(`applySuggestedPrompt skipped: suggestion ${e} is inactive`);
      return;
    }
    if (n.intent === "TRAIN_IMMERSIVE_MODEL") {
      this.innerChat.startImmersiveTraining();
      return;
    }
    if (n.intent === "REGENERATE_IMMERSIVE_PREVIEW") {
      this.innerChat.regenerateImmersivePreview();
      return;
    }
    let i = this.uploadManager.uploads.value.some(
      (r) => r.status === "uploaded",
    );
    (n.type === "FollowUpPrompt" &&
      n.asset?.status === "SUCCESS" &&
      !i &&
      this.uploadManager.add([n.asset]),
      this.sendPromptWithTelemetry(
        n.prompt,
        s,
        n.type === "FollowUpPrompt"
          ? "POST_ACTION_SUGGESTION"
          : "FOLLOW_UP_QUESTION",
      ));
  }
  queueVisualEdit(e, s) {
    this.visualEditsManager.queue(s);
  }
  queueBlockVisibility(e, s) {
    let n = Ue(this.messages.value.messages, e);
    if (n.type !== "VisualEdit" && n.type !== "VisualBlockInfo")
      throw new Error(
        `queueBlockVisibility: unexpected suggestion type ${n.type}`,
      );
    let i = n.blockKey;
    if (!i)
      throw new Error(`queueBlockVisibility: suggestion ${e} has no blockKey`);
    this.visualEditsManager.queueBlockVisibility(i, s);
  }
  queueBlockVisibilityByKey(e, s) {
    this.visualEditsManager.queueBlockVisibility(e, s);
  }
  queueBlockRenderOrder(e) {
    let s =
      this.innerChat.getPendingVisualEdits()?.visual_edits.render_order ??
      this.lens.value?.recipe?.renderOrder;
    if (U(s) === U(e)) {
      this.visualEditsManager.queue({
        render_order: void 0,
      });
      return;
    }
    this.visualEditsManager.queue({
      render_order: e,
    });
  }
  getPendingRenderOrder() {
    let s =
      this.visualEdits.value?.visualEdits.render_order ??
      this.innerChat.getPendingVisualEdits()?.visual_edits.render_order;
    return s && s.length > 0 ? s : void 0;
  }
  submitQueuedVisualEdits(e) {
    this.doSubmitQueuedVisualEdits(e);
  }
  async doSubmitQueuedVisualEdits(e) {
    let s;
    try {
      s = await this.visualEditsManager.drainWithAssets();
    } catch (n) {
      We.error(
        `Failed to prepare visual edit assets: ${n instanceof Error ? n.message : String(n)}`,
      );
      return;
    }
    s === Ee ||
      !s ||
      (await this.innerChat.sendPrompt(
        s?.message ?? as,
        this.uploadManager.consumeReadyUploads(),
        {
          visualEdits: s?.visualEdits,
          updateOnly: !0,
          agentMode: e?.agentMode,
          telemetryType: "VISUAL_EDIT",
        },
      ));
  }
  queueVariation(e, s) {
    let n = this.visualEdits.value;
    if (n && e.blocks)
      for (let i of Object.keys(e.blocks)) {
        let r = n.visualEdits.blocks?.[i]?.inputs;
        r &&
          (delete r.positionOffset,
          delete r.rotationOffset,
          delete r.scaleOffset);
      }
    this.visualEditsManager.queue(e, s);
  }
  requestVariations(e) {
    (this.awaitingVariationsForBlocks.add(e.block_id),
      (this.variationRequestInFlight = !0),
      this.innerChat.performAction(
        {
          action: "SendPrompt",
          action_id: S(),
          expected_version: this.innerChat.state.value.version,
          payload: {
            prompt: e.prompt ?? "",
            asset_variation_request: e,
          },
        },
        [],
        {
          optimistic: "none",
        },
      ));
  }
  cancelVariationRequest() {
    this.variationPreviewManager.cancel();
  }
  cancel() {
    return this.innerChat.cancel();
  }
  async ensureConversation() {
    if (this.context.conversationId) return this.context.conversationId;
    let e = await this.innerChat.ensureConversation();
    return (
      e && !this.context.conversationId && (this.context.conversationId = e),
      e
    );
  }
  loadMoreMessages() {
    this.innerChat.loadMoreMessages();
  }
  dispose() {
    (this.uploadManager.clear(), this.innerChat.dispose());
  }
  retry() {
    _e("retry");
  }
  pause() {
    _e("pause");
  }
  resume() {
    _e("resume");
  }
  addUploads(e) {
    this.uploadManager.add(e);
  }
  removeUpload(e) {
    this.uploadManager.remove(e);
  }
  retryUpload(e) {
    this.uploadManager.retry(e);
  }
  clearUploads() {
    this.uploadManager.clear();
  }
  restoreToVersion(e, s) {
    (this.visualEditsManager.clear(),
      this.innerChat.restoreToVersion({
        id: e,
        version: s,
      }));
  }
  getLensBuildStatus() {
    return this.innerChat.state.value.lensBuildStatus;
  }
  getActiveCheckpointId(e) {
    return this.innerChat.state.value.checkpointId ?? e;
  }
  getPendingVisualEditsAsLensPayload() {
    let e = this.visualEdits.value?.lensPayload;
    if (e) return e;
    let s = this.innerChat.getPendingVisualEdits();
    if (!s) return;
    let i = (s.user_provided_assets ?? [])
        .filter((a) => !!a.download_url)
        .map((a) => ({
          name: a.name,
          file_ref: {
            type: Le(a.name),
            url: a.download_url,
          },
        })),
      r = {
        ...s.visual_edits,
        ...(i.length > 0
          ? {
              user_provided_assets: i,
            }
          : {}),
      };
    return $e(r);
  }
  queueLensError(e) {
    this.context.pendingLensError = {
      errorMessage: e,
    };
  }
  drainPendingLensError() {
    let e = this.context.pendingLensError;
    return ((this.context.pendingLensError = void 0), e);
  }
};
function ys(t) {
  return t === "fast" || t === "thinking" || t === "agent";
}
function To(t) {
  return t || !1;
}
function Es(t) {
  return t === "native" || t === "web";
}
var Zn = A("useInitChat"),
  ei = [
    {
      group: "appearance",
      label: "Try a New Look",
      message: {
        prompt: "Give me ideas for changing my look in a Lens",
      },
    },
    {
      group: "appearance",
      label: "Put Something on Me",
      message: {
        prompt: "Give me ideas for a Lens using Selfie Attachments",
      },
    },
    {
      group: "generativeAi",
      label: "Record & Transform Me With AI",
      message: {
        prompt: "Give me ideas for a Lens using AI Video Transform",
      },
    },
    {
      group: "generativeAi",
      label: "Star in an AI Clip",
      message: {
        prompt: "Give me ideas for a Lens using AI Clips",
      },
    },
    {
      group: "effects",
      label: "Make Text React to Me",
      message: {
        prompt: "Give me ideas for using text in a Lens",
      },
    },
    {
      group: "effects",
      label: "Add Animated Particles",
      message: {
        prompt: "Give me ideas for a particle effect",
      },
    },
    {
      group: "interaction",
      label: "Make a Lens React to Gestures",
      message: {
        prompt: "Give me ideas for an interactive Lens",
      },
    },
    {
      group: "experiences",
      label: "Make a Game",
      message: {
        prompt: "Give me ideas for a game using CanvasAPI",
      },
    },
    {
      group: "experiences",
      label: "Create an AI Photo With a Friend",
      message: {
        prompt: "Give me ideas for a Lens using Photo Duo",
      },
    },
  ];
function ti(t) {
  let e = new Set();
  return Xe(t).filter(({ group: s }) =>
    s ? (e.has(s) ? !1 : (e.add(s), !0)) : !0,
  );
}
function ud(t) {
  let e = rt(),
    s = pt((_) => _.isAuthenticated),
    n = Te("EASYLENS_TOOL_CALL_STREAMING_COF"),
    i = Te("EASYLENS_WEB_RESUMABLE_QUESTIONS_COF"),
    [r] = ie(),
    { conversationId: a, checkpointId: d } = Vt(),
    o = r.get(Pe) ?? void 0,
    l = r.has(Pe),
    {
      data: u,
      isLoading: m,
      isError: g,
      error: f,
    } = Mt(d, {
      enabled: !a,
      refetchOnMount: "always",
    }),
    {
      data: c,
      isLoading: v,
      isError: b,
      error: w,
    } = ke({
      queryKey: ["conversation", a],
      queryFn: () => ct(a),
      enabled: !!a,
      refetchOnMount: "always",
    }),
    {
      data: M,
      isLoading: q,
      isError: z,
      isFetching: ee,
    } = ke({
      queryKey: ["conversation-messages", a],
      queryFn: async () => {
        let _ = await gt({
          conversation_id: a,
          cursor: void 0,
          limit: 50,
        });
        return {
          messages: _.messages,
          next_cursor: _.next_cursor,
          has_more: _.has_more,
        };
      },
      enabled: !!a,
      refetchOnMount: "always",
    }),
    E = !!d && !a,
    h = !!a,
    te = E && m,
    _s = h && (v || q),
    se = (!E && !h) || (h && !v && !q) || (E && !m),
    je = r.get(tt),
    Qe = Es(je) ? je : void 0,
    Ye = r.get(et),
    As = !h && l && ys(Ye) ? Ye : void 0,
    H = E ? (m || g ? void 0 : u) : void 0,
    $ =
      !h || v || q || b || z || !M
        ? void 0
        : {
            conversationId: a,
            cursor: M.next_cursor,
            hasMore: M.has_more,
            messages: [...M.messages].reverse(),
          },
    Se = t !== void 0 && !E && !h,
    [T, ze] = (0, k.useState)(() =>
      Se
        ? t
        : Ke({
            tweaks: e,
            skipInitialMessage: !E && !h && !!o,
            supportsToolCalls: n,
            supportsResumableQuestions: i,
            lensExecutionEnvironment: Qe,
          }),
    );
  (0, k.useEffect)(() => {
    if (
      E ||
      h ||
      T.messages.value.messages[0]?.message !== "Want to add something?"
    )
      return;
    let _ = !1,
      Ie = (D) => {
        if (
          _ ||
          T.state.value.current !== "Initial" ||
          T.state.value.context.conversationId
        )
          return;
        let C = T.messages.value,
          [B] = C.messages;
        C.messages.length !== 1 ||
          B.message !== "Want to add something?" ||
          B.suggestions?.some((be) => be.isApplied) ||
          T.messages.dispatchEvent(
            new p("changed", {
              ...C,
              messages: [
                {
                  ...B,
                  suggestions: D,
                },
              ],
            }),
          );
      };
    return (
      Nt(s, {
        contentful_stage:
          (s && e.easyLensContentfulStage !== J && e.easyLensContentfulStage) ||
          void 0,
        contentful_environment:
          (s &&
            e.easyLensContentfulEnvironment !== Re &&
            e.easyLensContentfulEnvironment) ||
          void 0,
      })
        .catch(
          (D) => (
            Zn.warn(`Failed to fetch starter suggestions: ${String(D)}`),
            {
              suggestions: ei,
            }
          ),
        )
        .then(({ suggestions: D }) =>
          Ie(
            ti(D).map(({ message: { prompt: C, ...B }, ...be }) => ({
              label: be.label,
              prompt: C,
              payload: B,
              suggestionId: S(),
              type: "FollowUpPrompt",
              isActive: !0,
              isApplied: !1,
            })),
          ),
        ),
      () => {
        _ = !0;
      }
    );
  }, [T, E, h, s, e.easyLensContentfulStage, e.easyLensContentfulEnvironment]);
  let Ss = (0, k.useRef)(Se ? void 0 : t);
  (0, k.useEffect)(() => {
    Ss.current?.dispose();
  }, []);
  let O = (0, k.useRef)(null),
    He = (0, k.useRef)(0);
  ((0, k.useEffect)(() => {
    se &&
      E &&
      H &&
      O.current !== d &&
      (ze(
        (_) => (
          _.dispose(),
          Ke({
            tweaks: e,
            checkpoint: H,
            supportsToolCalls: n,
            supportsResumableQuestions: i,
          })
        ),
      ),
      (O.current = d));
  }, [se, E, d, H, e, n, i]),
    (0, k.useEffect)(() => {
      let _ = T.state.value.context.conversationId;
      if (!se || !h || !$ || ee) return;
      let Ie = _ === $.conversationId,
        D = O.current === a,
        C = $.messages.length;
      if (Ie) {
        ((O.current = a), (He.current = C));
        return;
      }
      D ||
        (it(a, c?.lens_execution_environment ?? void 0),
        ze(
          (B) => (
            B.dispose(),
            Ke({
              tweaks: e,
              backendConversation: $,
              supportsToolCalls: n,
              supportsResumableQuestions: i,
            })
          ),
        ),
        (O.current = a),
        (He.current = C));
    }, [se, h, a, $, c, e, T, ee, n, i]));
  let ne =
      !((E && !m && !g && !!H) || (h && !v && !q && !b && !z && !!$)) ||
      O.current === d ||
      O.current === a,
    Is = h && T.state.value.context.conversationId === a,
    bs =
      E && g
        ? "checkpoint-error"
        : h && (b || z)
          ? "conversation-error"
          : Is
            ? "ready"
            : te || _s || !ne
              ? "loading"
              : "ready",
    ws = (0, k.useMemo)(() => (ne && h ? c : void 0), [ne, h, c]);
  return {
    chat: T,
    checkpoint: ne && E ? H : void 0,
    conversation: ws,
    chatLoadingState: bs,
    checkpointError: f || w,
    promptToSubmit: Se || h ? void 0 : o,
    promptAgentMode: As,
    urlLensExecutionEnvironment: Qe,
  };
}
function Ke({
  tweaks: t,
  checkpoint: e,
  skipInitialMessage: s,
  backendConversation: n,
  assetRefs: i,
  supportsToolCalls: r = !1,
  supportsResumableQuestions: a = !1,
  lensExecutionEnvironment: d,
}) {
  let o;
  if (n)
    o = {
      conversationId: n.conversationId,
      checkpointId: e?.checkpoint_id,
    };
  else {
    let u = e
        ? Ot({
            suggestedPostActions: e.suggestions,
            recipeBlocks: e.blocks,
          })
        : [],
      m = e?.lens_bundle_data?.lens_archive_url
        ? {
            name: e.lens_name ?? S() + ".lns",
            url: e.lens_bundle_data.lens_archive_url,
            checksum: e.lens_bundle_data.checksum ?? "",
            supportsFullscreen: e.supports_fullscreen,
            recipe: e.controller_code
              ? {
                  controllerCode: e.controller_code,
                }
              : void 0,
            assetManifest: e.lens_bundle_data.asset_manifest,
            featureMetadata: e.lens_bundle_data.feature_metadata,
            lensDescriptors: e.lens_bundle_data.lens_descriptors,
            webLensPreviewUrl:
              e.lens_bundle_data.web_lens_preview_url ?? void 0,
          }
        : void 0,
      g = e
        ? "Want to add something? I'll build your version of this Lens so it's ready to publish."
        : "Want to add something?";
    o = {
      messages: {
        messages: s
          ? []
          : [
              {
                message_id: S(),
                message_type: "ASK_USER",
                timestamp: new Date().toISOString(),
                message: g,
                agent_name: X,
                suggestions: u,
              },
            ],
        hasMore: !1,
        isLoadingMore: !1,
      },
      lens: m,
      checkpointId: e?.checkpoint_id,
    };
  }
  return new Ae({
    network: {
      async request(u) {
        try {
          let { uri: m, method: g, signal: f, ...c } = u,
            v,
            b = {};
          if ("formData" in c && c.formData) {
            let { name: z, data: ee, mimeType: E, filename: h } = c.formData,
              te = new FormData();
            (te.append(
              z,
              new Blob([ee], {
                type: E,
              }),
              h,
            ),
              (v = te));
          } else
            "body" in c &&
              ((v = JSON.stringify(c.body)),
              (b["Content-Type"] = "application/json"));
          let w = await ae(m, {
            method: g,
            body: v,
            signal: f,
            headers: b,
          });
          if (
            (w.headers.get("Content-Type") || "").includes("text/event-stream")
          )
            return {
              status: w.status,
              data: () => {
                throw new Error(
                  "data() is not available for streamed responses",
                );
              },
              body: w.body ?? void 0,
            };
          let q = await w.arrayBuffer();
          return {
            status: w.status,
            data: () => q,
          };
        } catch (m) {
          throw m;
        }
      },
    },
    ailcBaseUrl: re,
    initial: o,
    conversationOptions: {
      lens_checkpoint_id: o.checkpointId,
      contentful_stage: t.easyLensContentfulStage || J,
      contentful_environment: t.easyLensContentfulEnvironment || Re,
      model_ver: t.easyLensModelVer,
      client: "web",
      asset_refs: i,
      ls_ver: t.easyLensLsVer || st().lensCore.version,
      plugin_ver: "1.0",
      lscs_route_tag_override_preview: t.lscsRouteTagOverridePreview,
      lscs_route_tag_override_publish: t.lscsRouteTagOverridePublish,
      export_runtime_blocks: !0,
      supports_tool_calls: r,
      lens_execution_environment: d,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    supportsResumableQuestions: a,
  });
}
export {
  ai as a,
  gi as b,
  mi as c,
  Ii as d,
  bi as e,
  wi as f,
  Ts as g,
  Ce as h,
  ki as i,
  Pi as j,
  Ri as k,
  Ti as l,
  Li as m,
  Mi as n,
  Ci as o,
  Ui as p,
  $i as q,
  tr as r,
  sr as s,
  ys as t,
  To as u,
  Vt as v,
  ud as w,
  Ke as x,
};
//# sourceMappingURL=/chunks/chunk-AEB6R4WG.js.map
