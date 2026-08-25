(function runGame(window, document) {
  "use strict";

  const DATA = window.CDI_DATA || {};
  const ENGINE = window.CDI_ENGINE;
  if (!ENGINE) throw new Error("No se ha cargado js/engine.js");

  const SAVE_KEY = "carrera-indias-prototipo-v01";
  const PHASES = ["despacho", "ida", "mercado", "tornaviaje", "liquidacion"];
  const configuredRates = DATA.config && DATA.config.defaultRates ? DATA.config.defaultRates : {};
  const GAME_RULES = {
    averiaPerMerchant: Number(configuredRates.averiaPerMerchant) || 1200,
    tributeRate: (Number(configuredRates.royalTributeProfitPercent) || 10) / 100,
    cargoInsuranceRate: (Number(configuredRates.cargoInsurancePercent) || 10) / 100,
    hullInsuranceRate: (Number(configuredRates.hullInsurancePercent) || 10) / 100,
  };
  const PORT_EFFECTS = Object.freeze({
    cadiz: {
      name: "Cádiz",
      portAdjustment: -800,
      cargoMultiplier: 1,
      initialDelay: 0,
      informationBonus: 6,
      description: "Cádiz: salida oceánica más ágil, 800 reales menos de apresto y +6 de información naval.",
    },
    sevilla: {
      name: "Sevilla y barra de Sanlúcar",
      portAdjustment: 0,
      cargoMultiplier: 1.06,
      initialDelay: 2,
      informationBonus: 2,
      description: "Sevilla: la red mercantil mejora un 6 % el valor de la carga, pero el descenso del Guadalquivir y la barra añaden 2 jornadas.",
    },
  });
  const PROFILES = {
    equilibrada: { name: "Flota equilibrada", merchantCount: 3, escortCount: 2, avisoCount: 1, shipValue: 105000 },
    mercante: { name: "Gran convoy mercante", merchantCount: 5, escortCount: 2, avisoCount: 0, shipValue: 145000 },
    armada: { name: "Escolta reforzada", merchantCount: 2, escortCount: 3, avisoCount: 1, shipValue: 150000 },
    avisos: { name: "Convoy con avisos", merchantCount: 3, escortCount: 0, avisoCount: 2, shipValue: 90000 },
    registro: { name: "Expedición de registro", merchantCount: 2, escortCount: 1, avisoCount: 1, shipValue: 72000 },
    suelto: { name: "Navío suelto", merchantCount: 1, escortCount: 0, avisoCount: 0, shipValue: 30000 },
  };
  const MAP_ROUTES = Object.freeze({
    nueva_espana: {
      destinationPort: "veracruz",
      outboundPath: "M 84 28 C 80 33, 77 39, 72 42 S 39 56, 17 62 S 10 64, 7 65",
      returnPath: "M 7 65 C 10 62, 12 61, 17 62 S 45 39, 62 23 S 77 25, 84 28",
      outbound: [{ x: 84, y: 28 }, { x: 72, y: 42 }, { x: 17, y: 62 }, { x: 7, y: 65 }],
      return: [{ x: 7, y: 65 }, { x: 12, y: 61 }, { x: 62, y: 23 }, { x: 84, y: 28 }],
    },
    tierra_firme: {
      destinationPort: "cartagena",
      outboundPath: "M 84 28 C 80 33, 77 39, 72 42 S 42 58, 19 77",
      returnPath: "M 19 77 C 17 69, 14 64, 12 61 S 44 39, 62 23 S 77 25, 84 28",
      outbound: [{ x: 84, y: 28 }, { x: 72, y: 42 }, { x: 19, y: 77 }],
      return: [{ x: 19, y: 77 }, { x: 12, y: 61 }, { x: 62, y: 23 }, { x: 84, y: 28 }],
    },
  });
  const MAP_PORT_INFO = Object.freeze({
    spain: "Puerto de despacho, matrícula, registro y apresto de la expedición.",
    canarias: "Escala de aguada y ajuste del convoy antes del cruce atlántico.",
    azores: "Referencia decisiva del tornaviaje y zona de vigilancia enemiga.",
    habana: "Punto de reunión de las flotas antes del regreso a España.",
    veracruz: "Terminal principal de la Flota de Nueva España.",
    cartagena: "Escala fortificada de los Galeones de Tierra Firme y enlace con Portobelo.",
  });

  const FALLBACK_ROUTES = [
    {
      id: "nueva-espana",
      name: "Flota de Nueva España",
      destination: "Veracruz",
      marketMultiplier: 1.34,
      outboundLegs: ["Sanlúcar → Canarias", "Canarias → Antillas", "Antillas → Veracruz"],
      returnLegs: ["Veracruz → La Habana", "Canal de Bahamas → Azores", "Azores → España"],
    },
    {
      id: "tierra-firme",
      name: "Galeones de Tierra Firme",
      destination: "Cartagena y Portobelo",
      marketMultiplier: 1.42,
      outboundLegs: ["Sanlúcar → Canarias", "Canarias → Cartagena", "Cartagena → Portobelo"],
      returnLegs: ["Portobelo → La Habana", "Canal de Bahamas → Azores", "Azores → España"],
    },
  ];

  const FALLBACK_GOODS = [
    { id: "plata", name: "Plata", basePrice: 210, returnGood: true },
    { id: "grana", name: "Grana cochinilla", basePrice: 150, returnGood: true },
    { id: "cacao", name: "Cacao", basePrice: 110, returnGood: true },
    { id: "tabaco", name: "Tabaco", basePrice: 90, returnGood: true },
    { id: "anil", name: "Añil", basePrice: 125, returnGood: true },
    { id: "cuero", name: "Cueros", basePrice: 70, returnGood: true },
  ];

  const FALLBACK_EVENTS = [
    {
      id: "mar-calma",
      title: "Mar en calma",
      category: "general",
      phases: ["ida", "tornaviaje"],
      weight: 2,
      text: "La flota conserva la formación y adelanta la singladura sin novedad.",
      choices: [{ label: "Mantener el rumbo", effects: { morale: 3, delay: -1 } }],
    },
    {
      id: "temporal",
      title: "Temporal atlántico",
      category: "storm",
      phases: ["ida", "tornaviaje"],
      weight: 2,
      text: "El viento abre la formación y castiga jarcias y cascos.",
      choices: [
        { label: "Salvar los mercantes", effects: { hull: -9, sails: -12, delay: 1, cargoLossPercent: 4 } },
        { label: "Correr el temporal", effects: { hull: -5, sails: -16, morale: -4, cargoLossPercent: 7 } },
      ],
    },
    {
      id: "corsarios",
      title: "Velas enemigas",
      category: "enemy",
      phases: ["ida", "tornaviaje"],
      weight: 2,
      text: "Los avisos señalan una fuerza corsaria que busca separar a los rezagados.",
      choices: [
        { label: "Cerrar la formación", effects: { hull: -5, sails: -3, delay: 1, reputation: 2 } },
        { label: "Proteger la carga principal", effects: { hull: -2, cargoLossPercent: 10, morale: -3, dispute: true } },
      ],
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);
  const formatNumber = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
  const formatMoney = { format: (value) => `${formatNumber.format(Number(value) || 0)} reales` };

  function collection(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") return Object.values(value);
    return [];
  }

  function routes() {
    const source = collection(DATA.routes);
    return source.length ? source : FALLBACK_ROUTES;
  }

  function goods() {
    const source = collection(DATA.goods).filter((good) =>
      good.returnGood || good.direction === "return" || good.direction === "vuelta" || good.route === "return" || good.category === "american"
    );
    return source.length ? source : FALLBACK_GOODS;
  }

  function eventsFor(phase) {
    const source = collection(DATA.events);
    const available = source.filter((event) => {
      const phases = event.phases || (event.when && event.when.phases) || (event.phase ? [event.phase] : []);
      const when = event.when || {};
      const phaseMatches = !phases.length || phases.includes(phase) || phases.includes(phase === "ida" ? "outbound" : "return");
      const routeMatches = !when.routeIds || when.routeIds.includes(state.routeId);
      const threatMatches = when.minThreat == null || state.threat >= when.minThreat;
      const delayMatches = when.minDelayDays == null || state.delay >= when.minDelayDays;
      const cohesionMatches = when.maxCohesion == null || state.cohesion <= when.maxCohesion;
      const informationMatches = when.minInformation == null || state.information >= when.minInformation;
      const requiredRoles = when.requiresAnyRole || [];
      const profile = PROFILES[state.profile] || PROFILES.equilibrada;
      const roleMatches = !requiredRoles.length || requiredRoles.some((role) =>
        (role === "merchant" && profile.merchantCount > 0)
          || (role === "escort" && profile.escortCount > 0)
          || (role === "aviso" && profile.avisoCount > 0)
      );
      return phaseMatches && routeMatches && threatMatches && delayMatches && cohesionMatches && informationMatches && roleMatches;
    });
    return available.length ? available : FALLBACK_EVENTS.filter((event) => event.phases.includes(phase));
  }

  function defaultState(overrides) {
    return Object.assign({
      version: 1,
      expedition: 1,
      phase: "despacho",
      treasury: 180000,
      reputation: 55,
      fleetValue: 0,
      routeId: routes()[0].id,
      departure: "cadiz",
      mode: "flota",
      profile: "equilibrada",
      cargoBudget: 36000,
      participations: 12000,
      loan: 0,
      debtDue: 0,
      universityPassed: true,
      strategicMission: "comercio",
      incorporation: "ordinaria",
      secrecy: 70,
      diplomacy: 0,
      strategicMerit: 0,
      memberStatus: "mercader",
      wintered: false,
      insurance: true,
      dispatch: null,
      cargoValue: 0,
      returnCargoValue: 0,
      cargoLost: 0,
      shipsLost: 0,
      hull: 100,
      sails: 100,
      morale: 75,
      threat: 20,
      supplies: 100,
      cohesion: 70,
      information: 35,
      delay: 0,
      negligence: false,
      disputes: 0,
      outboundIndex: 0,
      returnIndex: 0,
      outboundSold: false,
      marketDay: 1,
      settlement: null,
      audienceResolved: false,
      eventCounter: 0,
      seed: Math.floor(Math.random() * 1000000000),
      log: [],
      flags: [],
    }, overrides || {});
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (parsed && parsed.version === 1) {
        if (!parsed.memberStatus || parsed.memberStatus === "aspirante") parsed.memberStatus = "mercader";
        return defaultState(parsed);
      }
    } catch (error) {
      console.warn("No se pudo leer la partida guardada", error);
    }
    return defaultState();
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setText(id, value) {
    const element = byId(id);
    if (element) element.textContent = value;
  }

  function setStatus(message, tone) {
    const target = byId("status-message");
    if (!target) return;
    target.textContent = message;
    target.dataset.tone = tone || "info";
    target.classList.toggle("is-warning", tone === "warning");
    target.classList.toggle("is-success", tone === "success");
    setText("map-status", message);
  }

  function addLog(message, category) {
    state.log.unshift({
      id: `${Date.now()}-${state.log.length}`,
      message,
      category: category || "registro",
    });
    state.log = state.log.slice(0, 60);
    renderLog();
  }

  function renderLog() {
    const list = byId("scribe-log-list");
    if (!list) return;
    if (!state.log.length) {
      list.innerHTML = "<li class=\"empty-state\">El Escribano abrirá el registro al despachar la expedición.</li>";
      return;
    }
    list.innerHTML = state.log.map((entry) =>
      `<li><span>${escapeHtml(entry.category)}</span>${escapeHtml(entry.message)}</li>`
    ).join("");
  }

  function currentRoute() {
    return routes().find((route) => route.id === state.routeId) || routes()[0];
  }

  function currentMapRoute() {
    const normalized = String(state.routeId || "nueva_espana").replaceAll("-", "_");
    if (MAP_ROUTES[normalized]) return MAP_ROUTES[normalized];
    return normalized.includes("firme") ? MAP_ROUTES.tierra_firme : MAP_ROUTES.nueva_espana;
  }

  function interpolateMapPosition(points, progress) {
    const safePoints = points && points.length ? points : [{ x: 84, y: 28 }];
    const scaled = ENGINE.clamp(progress, 0, 1) * Math.max(0, safePoints.length - 1);
    const startIndex = Math.min(Math.floor(scaled), safePoints.length - 1);
    const endIndex = Math.min(startIndex + 1, safePoints.length - 1);
    const localProgress = scaled - startIndex;
    return {
      x: safePoints[startIndex].x + (safePoints[endIndex].x - safePoints[startIndex].x) * localProgress,
      y: safePoints[startIndex].y + (safePoints[endIndex].y - safePoints[startIndex].y) * localProgress,
    };
  }

  function eventIcon(category) {
    const icons = {
      meteorologia: "☂",
      storm: "☂",
      navegacion: "✦",
      salud: "⚕",
      averia: "⚒",
      institucional: "§",
      amenaza: "⚔",
      combate: "⚔",
      enemy: "⚔",
      disciplina: "⚖",
      informacion: "✉",
      dilema: "◈",
      oportunidad: "✧",
      logistica: "⚓",
    };
    return icons[category] || "⛵";
  }

  function effectsSummary(effects, combat) {
    if (combat) {
      const combatLabels = {
        line: "Máxima presión sobre el enemigo · riesgo para la escolta",
        protect: "Menor pérdida mercante · maniobra más lenta",
        evade: "Evita el choque · depende de velamen y cohesión",
      };
      return combatLabels[combat] || "Resolución táctica";
    }
    const labels = {
      hull: "casco",
      sails: "velamen",
      morale: "moral",
      delay: "demora",
      reputation: "reputación",
      cohesion: "cohesión",
      information: "información",
      supplies: "víveres",
      threat: "amenaza",
      cargoLossPercent: "% de carga en riesgo",
    };
    const details = Object.entries(effects || {}).flatMap(([key, value]) => {
      if (key === "shipDamage" && value && typeof value === "object") {
        return Object.entries(value).map(([part, amount]) => `${Number(amount) > 0 ? "+" : ""}${amount} ${labels[part] || part}`);
      }
      if (labels[key] && typeof value === "number") return [`${value > 0 ? "+" : ""}${value} ${labels[key]}`];
      if (key === "dispute" && value) return ["posible pleito"];
      if (key === "negligence" && value) return ["riesgo de negligencia"];
      return [];
    });
    return details.length ? details.join(" · ") : "Consecuencia sujeta a la travesía";
  }

  function goodIcon(good) {
    if (good && good.icon) return good.icon;
    const icons = { plata: "●", grana: "◆", cochinilla: "◆", cacao: "◒", tabaco: "❧", anil: "●", indigo: "●", cuero: "◧", cueros: "◧" };
    return icons[(good && good.id) || ""] || "◇";
  }

  function portName(portId) {
    const port = collection(DATA.ports).find((candidate) => candidate.id === portId);
    return port ? port.name : portId;
  }

  function renderCampaignMap() {
    const map = byId("campaign-map");
    const fleet = byId("map-fleet");
    if (!map || !fleet) return;
    const mapRoute = currentMapRoute();
    const route = currentRoute();
    const outboundLegs = routeLegs(route, "ida");
    const returnLegs = routeLegs(route, "tornaviaje");
    const seasonByPhase = { despacho: "primavera", ida: "verano", mercado: "otono", tornaviaje: "invierno", liquidacion: "cierre" };
    const seasonLabels = {
      despacho: ["❧", "Primavera · despacho"],
      ida: ["☀", "Verano · Mar Océano"],
      mercado: ["⌁", "Otoño · feria americana"],
      tornaviaje: ["☁", "Invierno · invernada y regreso"],
      liquidacion: ["⚓", "Cierre · España"],
    };
    const weatherSymbols = { despacho: "☀", ida: "☀", mercado: "❧", tornaviaje: "☁", liquidacion: "☀" };
    let position = mapRoute.outbound[0];
    let fleetLabel = "Flota en despacho";
    if (state.phase === "ida") {
      position = interpolateMapPosition(mapRoute.outbound, state.outboundIndex / Math.max(1, outboundLegs.length));
      fleetLabel = `Travesía de ida · ${state.outboundIndex}/${outboundLegs.length}`;
    } else if (state.phase === "mercado") {
      position = mapRoute.outbound[mapRoute.outbound.length - 1];
      fleetLabel = `En ${portName(route.destination) || "América"}`;
    } else if (state.phase === "tornaviaje") {
      position = interpolateMapPosition(mapRoute.return, state.returnIndex / Math.max(1, returnLegs.length));
      fleetLabel = `Tornaviaje · ${state.returnIndex}/${returnLegs.length}`;
    } else if (state.phase === "liquidacion") {
      position = mapRoute.return[mapRoute.return.length - 1];
      fleetLabel = "Flota de regreso";
    }

    map.dataset.season = seasonByPhase[state.phase] || "primavera";
    const season = seasonLabels[state.phase] || seasonLabels.despacho;
    const badge = byId("map-season-badge");
    if (badge) badge.innerHTML = `<span aria-hidden="true">${season[0]}</span> ${season[1]}`;
    const weather = byId("map-weather");
    if (weather) {
      const symbol = weather.querySelector(".weather-symbol");
      if (symbol) symbol.textContent = weatherSymbols[state.phase] || "☀";
    }
    const outboundPath = byId("map-route-outbound");
    const returnPath = byId("map-route-return");
    if (outboundPath) {
      outboundPath.setAttribute("d", mapRoute.outboundPath);
      outboundPath.classList.toggle("is-current", state.phase === "despacho" || state.phase === "ida");
      outboundPath.classList.toggle("is-complete", ["mercado", "tornaviaje", "liquidacion"].includes(state.phase));
    }
    if (returnPath) {
      returnPath.setAttribute("d", mapRoute.returnPath);
      returnPath.classList.toggle("is-current", state.phase === "tornaviaje");
      returnPath.classList.toggle("is-complete", state.phase === "liquidacion");
    }

    fleet.style.setProperty("--fleet-x", `${position.x}%`);
    fleet.style.setProperty("--fleet-y", `${position.y}%`);
    fleet.setAttribute("aria-label", `${fleetLabel}. Posición aproximada en la carta atlántica.`);
    setText("map-fleet-label", fleetLabel);
    setText("map-port-spain", state.departure === "cadiz" ? "Cádiz" : "Sevilla · Sanlúcar");
    const spain = document.querySelector('[data-map-port="spain"]');
    if (spain) spain.setAttribute("aria-label", `Puerto de despacho: ${state.departure === "cadiz" ? "Cádiz" : "Sevilla y Sanlúcar"}`);

    const veracruz = document.querySelector('[data-map-port="veracruz"]');
    const cartagena = document.querySelector('[data-map-port="cartagena"]');
    if (veracruz) veracruz.hidden = mapRoute.destinationPort !== "veracruz";
    if (cartagena) cartagena.hidden = mapRoute.destinationPort !== "cartagena";
    $$("[data-map-port]").forEach((port) => port.classList.remove("is-active", "is-reached"));
    const mark = (name, className) => {
      const port = document.querySelector(`[data-map-port="${name}"]`);
      if (port && !port.hidden) port.classList.add(className);
    };
    if (state.phase !== "despacho" || state.outboundIndex > 0) mark("spain", "is-reached");
    if (state.outboundIndex >= 1 || ["mercado", "tornaviaje", "liquidacion"].includes(state.phase)) mark("canarias", "is-reached");
    if (["mercado", "tornaviaje", "liquidacion"].includes(state.phase)) mark(mapRoute.destinationPort, "is-reached");
    if (state.returnIndex >= Math.max(1, returnLegs.length - 1) || state.phase === "liquidacion") mark("azores", "is-reached");
    if (state.returnIndex >= 1 || state.phase === "liquidacion" || (state.routeId.includes("nueva") && state.outboundIndex >= 3)) mark("habana", "is-reached");
    if (state.phase === "despacho") mark("spain", "is-active");
    if (state.phase === "mercado") mark(mapRoute.destinationPort, "is-active");
    if (state.phase === "liquidacion") mark("spain", "is-active");
    if (state.phase === "ida" && state.outboundIndex === 1) mark("canarias", "is-active");
    if (state.phase === "ida" && state.outboundIndex >= Math.max(2, outboundLegs.length - 1)) mark(mapRoute.destinationPort, "is-active");
    if (state.phase === "tornaviaje" && state.returnIndex === 0) mark(mapRoute.destinationPort, "is-active");
    if (state.phase === "tornaviaje" && state.returnIndex === 1) mark("habana", "is-active");
    if (state.phase === "tornaviaje" && state.returnIndex >= Math.max(2, returnLegs.length - 1)) mark("azores", "is-active");

    const status = byId("status-message");
    setText("map-status", status && status.textContent.trim()
      ? status.textContent.trim()
      : `Ruta prevista hacia ${portName(route.destination) || "América"}.`);
    const vignette = byId("port-vignette");
    if (vignette) {
      vignette.dataset.port = state.departure;
      vignette.setAttribute("aria-label", state.departure === "cadiz" ? "Vista simbólica del puerto de Cádiz" : "Vista simbólica de Sevilla y el Guadalquivir");
    }
    const vignetteCaption = byId("port-vignette-caption");
    if (vignetteCaption) {
      vignetteCaption.innerHTML = state.departure === "cadiz"
        ? "<strong>Bahía de Cádiz</strong><span>Arsenales y salida directa al Mar Océano.</span>"
        : "<strong>Sevilla y Sanlúcar</strong><span>Red mercantil y descenso por el Guadalquivir.</span>";
    }
  }

  function routeLegs(route, direction) {
    const direct = direction === "ida"
      ? route.outboundLegs || route.outbound || route.ida
      : route.returnLegs || route.return || route.tornaviaje;
    if (Array.isArray(direct) && direct.length) {
      const normalized = direct.map((leg) => typeof leg === "string"
        ? leg
        : leg.name || leg.label || (leg.from && leg.to ? `${portName(leg.from)} → ${portName(leg.to)}` : leg.id));
      if (state.departure === "sevilla" && normalized.length) {
        if (direction === "ida") normalized[0] = normalized[0].replace(/^.*?→/, "Sanlúcar →");
        else normalized[normalized.length - 1] = normalized[normalized.length - 1].replace(/→.*$/, "→ Sanlúcar/Sevilla");
      }
      return normalized;
    }
    const stops = route.stops || route.ports;
    if (Array.isArray(stops) && stops.length > 1) {
      const names = stops.map((stop) => typeof stop === "string" ? stop : stop.name || stop.id);
      if (direction === "ida") return names.slice(0, 4).map((name, index) => index ? `${names[index - 1]} → ${name}` : name).slice(1);
      return names.slice().reverse().slice(0, 4).map((name, index, list) => index ? `${list[index - 1]} → ${name}` : name).slice(1);
    }
    return direction === "ida" ? FALLBACK_ROUTES[0].outboundLegs : FALLBACK_ROUTES[0].returnLegs;
  }

  function ensureDispatchControls() {
    const panel = byId("phase-despacho");
    const button = byId("dispatch-button");
    if (!panel || !button || byId("voyage-mode-select") || byId("regime-control")) return;
    const wrapper = document.createElement("section");
    wrapper.className = "dispatch-extras card inset-card";
    wrapper.innerHTML = `
      <h3>Régimen e instituciones</h3>
      <div class="form-grid compact-grid">
        <label>Puerto de despacho
          <select id="departure-select">
            <option value="cadiz">Cádiz</option>
            <option value="sevilla">Sevilla / Sanlúcar</option>
          </select>
        </label>
        <label>Régimen de navegación
          <select id="voyage-mode-select">
            <option value="flota">Flota inscrita</option>
            <option value="registro">Navíos de registro</option>
            <option value="suelto">Navío suelto</option>
          </select>
        </label>
        <label>Participaciones emitidas
          <input id="participation-input" type="number" min="0" max="50000" step="1000" value="12000">
        </label>
      </div>
      <div id="institution-status" class="institution-strip" aria-live="polite"></div>
      <div id="dispatch-costs" class="cost-breakdown"></div>
      <div id="certification-box" class="certification-box"></div>`;
    button.parentNode.insertBefore(wrapper, button);
  }

  function ensureAdvancedControls() {
    if (byId("historical-systems") || !byId("dispatch-button")) return;
    const section = document.createElement("section");
    section.id = "historical-systems";
    section.className = "game-card game-card--wide historical-systems";
    section.innerHTML = `
      <div class="game-card__heading"><span class="step-marker">5</span><div>
        <p class="kicker">Gobierno, financiación y servicio</p><h3>Consejo estratégico</h3>
      </div></div>
      <div class="advanced-grid">
        <label>Incorporación del navío<select id="incorporation-select">
          <option value="ordinaria">Inscripción ordinaria</option><option value="asiento">Navío de asiento · doble avería</option>
          <option value="beneficencia">Beneficencia · exige aprobación</option><option value="conserva">En conserva · sin privilegios</option>
        </select></label>
        <label>Servicio principal<select id="mission-select">
          <option value="comercio">Comercio y tornaviaje</option><option value="socorro">Socorro y pertrechos de plaza</option>
          <option value="defensa">Defensa de puerto y convoy</option><option value="presa">Presa autorizada</option>
        </select></label>
        <label>Préstamo particular limitado<select id="loan-select">
          <option value="0">Sin préstamo</option><option value="10000">10.000 reales</option><option value="20000">20.000 reales</option><option value="30000">30.000 reales</option>
        </select></label>
        <label>Custodia del secreto<select id="secrecy-select">
          <option value="90">Secreto estricto</option><option value="70">Reserva ordinaria</option><option value="45">Noticias a aliados</option>
        </select></label>
      </div>
      <div class="council-actions">
        <button class="button button--secondary" id="university-exam-button" type="button">Examen de Mareantes</button>
        <button class="button button--secondary" id="admission-button" type="button">Solicitar ingreso</button>
        <span id="advanced-status">Examen y acuerdos pendientes.</span>
      </div>`;
    const order = byId("dispatch-button").closest("section");
    order.parentNode.insertBefore(section, order);
  }

  function populateSelectors() {
    const routeSelect = byId("route-select");
    if (routeSelect) {
      routeSelect.innerHTML = routes().map((route) =>
        `<option value="${escapeHtml(route.id)}">${escapeHtml(route.name || route.label || route.id)}</option>`
      ).join("");
      routeSelect.value = state.routeId;
    }
    const shipSelect = byId("ship-select");
    if (shipSelect) {
      shipSelect.innerHTML = Object.entries(PROFILES).map(([id, profile]) =>
        `<option value="${id}">${escapeHtml(profile.name)} · ${profile.merchantCount} M / ${profile.escortCount} E / ${profile.avisoCount} A</option>`
      ).join("");
      shipSelect.value = state.profile;
    }
    const cargoBudget = byId("cargo-budget");
    if (cargoBudget) cargoBudget.value = state.cargoBudget;
    const insurance = byId("insurance-check");
    if (insurance) insurance.checked = state.insurance;
    const departure = byId("departure-select");
    if (departure) departure.value = state.departure;
    const mode = byId("voyage-mode-select");
    if (mode) mode.value = state.mode;
    const regimeRadio = document.querySelector(`input[name="trade-regime"][value="${state.mode}"]`);
    if (regimeRadio) regimeRadio.checked = true;
    const participations = byId("participation-input");
    if (participations) participations.value = state.participations;
    const participationSelect = byId("participation-select");
    if (participationSelect) participationSelect.value = "25";
    const university = byId("university-certification");
    if (university) university.checked = state.universityPassed;
    if (byId("incorporation-select")) byId("incorporation-select").value = state.incorporation;
    if (byId("mission-select")) byId("mission-select").value = state.strategicMission;
    if (byId("loan-select")) byId("loan-select").value = String(state.loan || 0);
    if (byId("secrecy-select")) byId("secrecy-select").value = String(state.secrecy || 70);
  }

  function planFromControls() {
    const profileId = byId("ship-select") ? byId("ship-select").value : state.profile;
    const profile = PROFILES[profileId] || PROFILES.equilibrada;
    const checkedRegime = document.querySelector('input[name="trade-regime"]:checked');
    const selectedMode = byId("voyage-mode-select")
      ? byId("voyage-mode-select").value
      : checkedRegime ? checkedRegime.value : state.mode;
    const cargoBudget = Number(byId("cargo-budget") ? byId("cargo-budget").value : state.cargoBudget);
    const participationPercent = Number(byId("participation-select") ? byId("participation-select").value : 0);
    const escortEnabled = !byId("escort-check") || byId("escort-check").checked;
    const avisoEnabled = Boolean(byId("mail-check") && byId("mail-check").checked);
    const adjusted = Object.assign({}, profile);
    if (!escortEnabled) adjusted.escortCount = 0;
    if (avisoEnabled) adjusted.avisoCount = Math.max(adjusted.avisoCount, selectedMode === "flota" ? 2 : 1);
    return Object.assign({}, adjusted, {
      mode: selectedMode,
      cargoBudget,
      participations: byId("participation-input")
        ? Number(byId("participation-input").value)
        : cargoBudget * participationPercent / 100,
      insurance: Boolean(byId("insurance-check") && byId("insurance-check").checked),
      incorporation: byId("incorporation-select") ? byId("incorporation-select").value : state.incorporation,
    });
  }

  function currentPortEffect() {
    return PORT_EFFECTS[state.departure] || PORT_EFFECTS.cadiz;
  }

  function adjustedDispatch(plan) {
    const calculation = ENGINE.calculateDispatch(plan, GAME_RULES);
    if (plan.incorporation === "asiento") calculation.averia *= 2;
    if (plan.incorporation === "conserva") {
      calculation.averia = 0;
      calculation.insurance = 0;
    }
    calculation.portAdjustment = currentPortEffect().portAdjustment;
    calculation.grossCost = ENGINE.money(plan.cargoBudget + calculation.averia + calculation.tribute + calculation.escort + calculation.supplies + calculation.insurance + calculation.portAdjustment);
    calculation.treasuryCost = ENGINE.money(calculation.grossCost - calculation.acceptedParticipations);
    return calculation;
  }

  function syncPlanState() {
    const plan = planFromControls();
    state.routeId = byId("route-select") ? byId("route-select").value : state.routeId;
    state.departure = byId("departure-select") ? byId("departure-select").value : state.departure;
    state.mode = plan.mode;
    state.profile = byId("ship-select") ? byId("ship-select").value : state.profile;
    state.cargoBudget = plan.cargoBudget;
    state.participations = plan.participations;
    state.insurance = plan.insurance;
    state.incorporation = plan.incorporation || "ordinaria";
    state.strategicMission = byId("mission-select") ? byId("mission-select").value : state.strategicMission;
    state.loan = Number(byId("loan-select") ? byId("loan-select").value : state.loan) || 0;
    state.secrecy = Number(byId("secrecy-select") ? byId("secrecy-select").value : state.secrecy) || 70;
    const output = byId("cargo-budget-output");
    if (output) output.textContent = formatMoney.format(state.cargoBudget);
    renderDispatch();
    saveState();
  }

  function renderDispatch() {
    const plan = planFromControls();
    const certification = ENGINE.certifyPlan(plan, "outbound");
    const universityAccepted = !byId("university-certification") || byId("university-certification").checked;
    if (plan.mode === "flota" && !universityAccepted) {
      certification.approved = false;
      certification.problems.push("Falta la certificación obligatoria de la Universidad de Mareantes.");
    }
    const calculation = adjustedDispatch(plan);
    const finance = ENGINE.calculateFinance({ loan: state.loan }, state.treasury, GAME_RULES);
    const budgetOutput = byId("cargo-budget-output");
    if (budgetOutput) budgetOutput.textContent = formatMoney.format(plan.cargoBudget);
    const profile = PROFILES[state.profile] || PROFILES.equilibrada;
    const manifest = byId("cargo-manifest");
    if (manifest) {
      manifest.innerHTML = `
        <strong>${escapeHtml(profile.name)}</strong>
        <span>${plan.merchantCount} mercantes</span>
        <span>${plan.escortCount} escoltas</span>
        <span>${plan.avisoCount} avisos</span>
        <span>Carga declarada: ${formatMoney.format(plan.cargoBudget)}</span>`;
    }
    const costs = byId("dispatch-costs");
    if (costs) {
      costs.innerHTML = `
          <div><dt>Carga</dt><dd>${formatMoney.format(plan.cargoBudget)}</dd></div>
          <div><dt>Avería</dt><dd>${formatMoney.format(calculation.averia)}</dd></div>
          <div><dt>Tributo Real</dt><dd>${formatMoney.format(calculation.tribute)}</dd></div>
          <div class="tax-detail"><dt>↳ Corona / almojarifazgo / alcabala / palmeo</dt><dd>${formatMoney.format(calculation.taxes.tributoCorona)} / ${formatMoney.format(calculation.taxes.almojarifazgo)} / ${formatMoney.format(calculation.taxes.alcabala)} / ${formatMoney.format(calculation.taxes.palmeoTonelada)}</dd></div>
          <div><dt>Escolta y avisos</dt><dd>${formatMoney.format(calculation.escort)}</dd></div>
          <div><dt>Pertrechos</dt><dd>${formatMoney.format(calculation.supplies)}</dd></div>
          <div><dt>Seguro</dt><dd>${formatMoney.format(calculation.insurance)}</dd></div>
          <div><dt>Participaciones</dt><dd>−${formatMoney.format(calculation.acceptedParticipations)}</dd></div>
          <div><dt>Préstamo particular</dt><dd>−${formatMoney.format(finance.loan)} · deuda ${formatMoney.format(finance.debtDue)}</dd></div>
          <div><dt>Ajuste del puerto</dt><dd>${calculation.portAdjustment < 0 ? "−" : ""}${formatMoney.format(Math.abs(calculation.portAdjustment))}</dd></div>
          <div class="total cost-ledger__total"><dt>Cargo a tesorería</dt><dd>${formatMoney.format(calculation.treasuryCost)}</dd></div>`;
    }
    const institutions = byId("institution-status");
    if (institutions) {
      institutions.innerHTML = [
        "Consulado: financiación y carga",
        "Universidad: certificación",
        "Correo marítimo: informe de ruta",
        "Juzgado de Arribadas: despacho habilitado",
      ].map((text) => `<span>✓ ${text}</span>`).join("");
    }
    const box = byId("certification-box");
    if (box) {
      const messages = certification.approved
        ? ["Universidad de Mareantes: despacho certificado."].concat(certification.warnings)
        : certification.problems.concat(certification.warnings);
      box.className = `certification-box ${certification.approved ? "approved" : "rejected"}`;
      box.innerHTML = messages.map((message) => `<p>${escapeHtml(message)}</p>`).join("");
    }
    const certificationStatus = byId("certification-status");
    if (certificationStatus) {
      certificationStatus.textContent = certification.approved
        ? "Casco, aparejo, carga y composición certificados."
        : certification.problems.join(" ");
    }
    const validation = byId("dispatch-validation");
    if (validation) {
      validation.textContent = certification.approved
        ? `Despacho disponible: ${formatMoney.format(calculation.treasuryCost)} a cargo de la tesorería.`
        : certification.problems.join(" ");
    }
    const button = byId("dispatch-button");
    if (button) {
      const specialApproved = plan.incorporation !== "beneficencia" || state.memberStatus === "miembro";
      button.disabled = !certification.approved || !specialApproved || calculation.treasuryCost > finance.available;
      if (calculation.treasuryCost > finance.available) {
        setStatus("La tesorería no puede financiar este despacho.", "warning");
      }
    }
    const advanced = byId("advanced-status");
    if (advanced) advanced.textContent = `Universidad: ${state.universityPassed ? "examen aprobado" : "pendiente"} · condición: ${state.memberStatus} · secreto ${state.secrecy}/100 · misión: ${state.strategicMission}.`;
    const departureEffect = byId("departure-effect");
    if (departureEffect) departureEffect.textContent = currentPortEffect().description;
    const routeCalendar = byId("route-calendar");
    if (routeCalendar) {
      routeCalendar.textContent = String(state.routeId).replaceAll("-", "_") === "tierra_firme"
        ? "Salida histórica de agosto; invernada en Indias; concentración en La Habana y regreso desde marzo."
        : "Salida histórica de mayo; invernada en Indias; concentración en La Habana y regreso desde marzo.";
    }
    renderCampaignMap();
  }

  function updateHeader() {
    setText("turn-display", `Expedición ${state.expedition}`);
    setText("player-role-display", state.memberStatus === "miembro" ? "Mercader · miembro" : "Mercader");
    setText("treasury-display", formatNumber.format(state.treasury));
    setText("reputation-display", Math.round(state.reputation));
    setText("fleet-value-display", formatNumber.format(state.fleetValue));
    const seasons = { despacho: "Primavera", ida: "Verano", mercado: "Otoño", tornaviaje: "Invierno → primavera", liquidacion: "Cierre del ciclo" };
    setText("season-display", seasons[state.phase] || "Primavera");
    updateFleetSidebar();
  }

  function showPhase(phase) {
    state.phase = PHASES.includes(phase) ? phase : "despacho";
    const seasons = { despacho: "Primavera", ida: "Verano", mercado: "Otoño", tornaviaje: "Invierno → primavera", liquidacion: "Cierre del ciclo" };
    setText("season-display", seasons[state.phase] || "Primavera");
    PHASES.forEach((name) => {
      const panel = byId(`phase-${name}`);
      if (panel) {
        panel.hidden = name !== state.phase;
        panel.classList.toggle("is-active", name === state.phase);
      }
    });
    $$(".phase-tab[data-phase]").forEach((tab) => {
      const active = tab.dataset.phase === state.phase;
      tab.classList.toggle("active", active);
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.disabled = !active;
    });
    renderPhase();
    saveState();
  }

  function renderProgress(kind) {
    const outbound = kind === "ida";
    const route = currentRoute();
    const legs = routeLegs(route, outbound ? "ida" : "tornaviaje");
    const index = outbound ? state.outboundIndex : state.returnIndex;
    const target = byId(outbound ? "outbound-progress" : "return-progress");
    if (target) target.style.width = `${Math.round(index / legs.length * 100)}%`;
    const waypoints = byId(outbound ? "outbound-waypoints" : "return-waypoints");
    if (waypoints) {
      waypoints.innerHTML = [outbound ? (state.departure === "cadiz" ? "Cádiz" : "Sanlúcar") : "La Habana"]
        .concat(legs.map((leg) => leg.split("→").pop().trim()))
        .map((name, legIndex) => `<li class="${legIndex <= index ? "is-reached" : ""}"><span></span>${escapeHtml(name)}</li>`)
        .join("");
    }
    const sail = byId(outbound ? "sail-button" : "return-sail-button");
    if (sail) {
      sail.disabled = index >= legs.length;
      sail.textContent = index >= legs.length
        ? (outbound ? "Arribada completada" : "Tornaviaje completado")
        : `Navegar: ${legs[index]}`;
    }
  }

  function normalizeEventChoice(event, choice) {
    const selected = choice || {};
    return {
      label: selected.label || selected.text || selected.name || "Continuar",
      effects: Object.assign({}, event.effects || {}, selected.effects || {}),
      outcome: selected.outcome || selected.result || event.outcome || "La decisión queda asentada por el Escribano.",
    };
  }

  function showDialog(dialog, html) {
    dialog.innerHTML = html;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function resolveVoyageEvent(kind, formation, onDone) {
    const phase = kind === "ida" ? "ida" : "tornaviaje";
    const candidates = eventsFor(phase);
    const random = ENGINE.createRng(state.seed + state.eventCounter * 7919);
    const event = ENGINE.chooseWeighted(candidates, random) || FALLBACK_EVENTS[0];
    state.eventCounter += 1;
    let choices = (event.choices && event.choices.length ? event.choices : [{ label: "Continuar", effects: event.effects || {} }])
      .map((choice) => normalizeEventChoice(event, choice));
    if (["combate", "amenaza"].includes(event.category)) {
      const profile = PROFILES[state.profile] || PROFILES.equilibrada;
      choices = [
        { label: "Formar línea y batir al enemigo", combat: "line", effects: {}, outcome: "La escolta sostiene la línea de combate." },
        { label: "Cerrar sobre los mercantes", combat: "protect", effects: {}, outcome: "La Capitana protege el cuerpo del convoy." },
        { label: "Evadir con toda vela", combat: "evade", effects: {}, outcome: "La flota intenta romper el contacto." },
      ].map((choice) => Object.assign(choice, { escortStrength: 25 + profile.escortCount * 22 + profile.avisoCount * 4 }));
    }
    const dialog = byId("event-dialog");
    const encounter = byId("map-encounter");
    if (encounter) {
      encounter.hidden = false;
      const encounterTitle = encounter.querySelector("b");
      if (encounterTitle) encounterTitle.textContent = event.title || event.name || "Incidencia";
    }

    const applyChoice = (choice) => {
      if (choice.combat) {
        const battle = ENGINE.resolveCombat({
          escortStrength: choice.escortStrength,
          enemyStrength: 42 + state.threat / 3,
          cargoValue: state.returnCargoValue || state.cargoValue,
          hull: state.hull,
          cohesion: state.cohesion,
        }, choice.combat, random());
        state.hull = battle.hull;
        state.cohesion = battle.cohesion;
        const cargoKey = state.returnCargoValue > 0 ? "returnCargoValue" : "cargoValue";
        state[cargoKey] = Math.max(0, ENGINE.money(state[cargoKey] - battle.cargoLoss));
        state.cargoLost = ENGINE.money(state.cargoLost + battle.cargoLoss);
        state.reputation = ENGINE.clamp(state.reputation + (battle.won ? 5 : battle.escaped ? 0 : -4), 0, 100);
        if (battle.won && state.strategicMission === "presa") {
          state.treasury = ENGINE.money(state.treasury + 6000);
          state.strategicMerit += 12;
          state.flags.push("presa_autorizada");
        }
        choice.outcome = `${choice.outcome} Fuerza propia ${Math.round(battle.escortStrength)}, enemiga ${Math.round(battle.enemyStrength)}; pérdida de carga ${formatMoney.format(battle.cargoLoss)}.`;
      }
      const riskCategory = ["combate", "amenaza"].includes(event.category)
        ? "enemy"
        : event.category === "meteorologia" ? "storm" : "general";
      const multiplier = ENGINE.riskMultiplier(formation, riskCategory, state.mode);
      state = Object.assign(state, ENGINE.applyEffects(state, choice.effects, multiplier));
      state.supplies = Math.max(0, state.supplies - 7);
      const hullEffect = (choice.effects.hull || 0)
        + ((choice.effects.shipDamage && choice.effects.shipDamage.hull) || 0);
      state.fleetValue = Math.max(0, state.fleetValue - Math.max(0, -hullEffect) * 180);
      addLog(`${event.title || event.name}: ${choice.label}.`, event.category || "incidencia");
      setStatus(choice.outcome, "info");
      updateHeader();
      saveState();
      if (dialog) closeDialog(dialog);
      if (encounter) encounter.hidden = true;
      onDone();
    };

    if (!dialog) {
      applyChoice(choices[0]);
      return;
    }

    const category = event.category || "navegacion";
    const combatScene = ["combate", "amenaza", "enemy"].includes(category);
    showDialog(dialog, `
      <article class="event-card event-card--${escapeHtml(category)}">
        <div class="event-card__scene" aria-hidden="true">
          <span class="event-card__category">${escapeHtml(category.replaceAll("_", " "))}</span>
          ${combatScene
            ? `<div class="combat-board">
                <div class="combat-line combat-line--enemy"><span>☠</span><span>⛵</span><span>⛵</span></div>
                <div class="combat-line combat-line--escort"><span>⛵</span><span>⚓</span><span>⛵</span></div>
                <div class="combat-line combat-line--merchant"><span>⛵</span><span>⛵</span><span>⛵</span></div>
              </div>`
            : `<span class="event-card__scene-icon">${eventIcon(category)}</span>`}
        </div>
        <div class="event-card__body">
          <p class="eyebrow">Incidencia de ${phase === "ida" ? "ida" : "tornaviaje"}</p>
          <h2>${escapeHtml(event.title || event.name || "Incidencia")}</h2>
          <p>${escapeHtml(event.text || event.description || "La travesía exige una decisión.")}</p>
          <div class="event-choices">
            ${choices.map((choice, index) => `<button class="event-choice" type="button" data-event-choice="${index}">
              <span class="event-choice__number">${index + 1}</span>
              <span class="event-choice__copy"><strong>${escapeHtml(choice.label)}</strong><small>${escapeHtml(effectsSummary(choice.effects, choice.combat))}</small></span>
            </button>`).join("")}
          </div>
        </div>
      </article>`);
    dialog.querySelectorAll("[data-event-choice]").forEach((button) => {
      button.addEventListener("click", () => applyChoice(choices[Number(button.dataset.eventChoice)]));
    });
  }

  function openUniversityExam() {
    const dialog = byId("event-dialog");
    if (!dialog) return;
    showDialog(dialog, `<article class="event-card"><p class="eyebrow">Universidad de Mareantes</p>
      <h2>Examen de despacho y navegación</h2><p>Responded conforme a la Real Cédula.</p>
      <label>Mínimo ordinario de ida<select data-exam="escort"><option value="">Elegir</option><option value="2">Dos escoltas o dos avisos</option><option value="1">Una escolta</option></select></label>
      <label>Posición de la Almiranta<select data-exam="almiranta"><option value="">Elegir</option><option value="rear">Retaguardia y auxilio</option><option value="front">Siempre en vanguardia</option></select></label>
      <label>Navío en conserva<select data-exam="conserva"><option value="">Elegir</option><option value="none">No adquiere privilegios automáticos</option><option value="all">Obtiene plena cobertura</option></select></label>
      <button class="button button--primary" type="button" id="grade-exam-button">Presentar respuestas</button></article>`);
    byId("grade-exam-button").addEventListener("click", () => {
      const answers = Array.from(dialog.querySelectorAll("[data-exam]")).map((control) => control.value);
      state.universityPassed = answers.join("|") === "2|rear|none";
      const certificate = byId("university-certification");
      if (certificate) certificate.checked = state.universityPassed;
      addLog(state.universityPassed ? "Examen de Mareantes aprobado y revista certificada." : "Examen de Mareantes no aprobado.", "Universidad");
      closeDialog(dialog); renderDispatch(); saveState();
      setStatus(state.universityPassed ? "La Universidad expide certificación." : "Debe repetir el examen de Mareantes.", state.universityPassed ? "success" : "warning");
    });
  }

  function requestAdmission() {
    const admitted = state.reputation >= 50 && state.secrecy >= 70;
    state.memberStatus = admitted ? "miembro" : "mercader";
    if (admitted) state.reputation = ENGINE.clamp(state.reputation + 2, 0, 100);
    addLog(admitted ? "El mercader ingresa como miembro por buena fama, propuesta y compromiso de secreto." : "El mercader conserva su condición: falta reputación o compromiso de secreto para ingresar como miembro.", "Compañía");
    renderDispatch(); updateHeader(); saveState();
  }

  function sail(kind) {
    const outbound = kind === "ida";
    const route = currentRoute();
    const legs = routeLegs(route, outbound ? "ida" : "tornaviaje");
    const indexKey = outbound ? "outboundIndex" : "returnIndex";
    if (state[indexKey] >= legs.length) return;
    const formationSelect = byId(outbound ? "formation-select" : "return-formation-select");
    const formationMap = { closed: "cerrada", ordinary: "ordinaria", dispersed: "dispersa" };
    const formation = formationMap[formationSelect ? formationSelect.value : "ordinary"] || "ordinaria";
    resolveVoyageEvent(kind, formation, () => {
      state[indexKey] += 1;
      renderProgress(kind);
      updateHeader();
      if (state[indexKey] >= legs.length) {
        if (outbound) {
          setStatus(`La expedición ha arribado a ${portName(currentRoute().destination) || "América"}.`, "success");
          enterMarket();
        } else {
          setStatus("La flota ha regresado a España. Se abre la liquidación.", "success");
          enterSettlement();
        }
      }
      saveState();
    });
  }

  function dispatchFleet() {
    syncPlanState();
    const plan = planFromControls();
    const certification = ENGINE.certifyPlan(plan, "outbound");
    const calculation = adjustedDispatch(plan);
    const finance = ENGINE.calculateFinance({ loan: state.loan }, state.treasury, GAME_RULES);
    const universityAccepted = !byId("university-certification") || byId("university-certification").checked;
    if (plan.mode === "flota" && !universityAccepted) certification.approved = false;
    if (!certification.approved) {
      setStatus("La Universidad de Mareantes ha denegado el despacho.", "warning");
      return;
    }
    if (plan.incorporation === "beneficencia" && state.memberStatus !== "miembro") {
      setStatus("La incorporación por beneficencia necesita aprobación de la Compañía.", "warning");
      return;
    }
    if (calculation.treasuryCost > finance.available) {
      setStatus("No hay fondos suficientes para despachar la expedición.", "warning");
      return;
    }
    state.dispatch = calculation;
    state.treasury = ENGINE.money(finance.available - calculation.treasuryCost);
    state.debtDue = finance.debtDue;
    const port = currentPortEffect();
    state.cargoValue = ENGINE.money(plan.cargoBudget * port.cargoMultiplier);
    state.returnCargoValue = 0;
    state.fleetValue = plan.shipValue;
    state.hull = 100;
    state.sails = 100;
    state.morale = 75;
    state.supplies = 100;
    state.delay = port.initialDelay;
    state.information = ENGINE.clamp(35 + port.informationBonus, 0, 100);
    state.cargoLost = 0;
    state.shipsLost = 0;
    state.outboundIndex = 0;
    state.returnIndex = 0;
    state.negligence = false;
    state.disputes = 0;
    state.flags = [];
    if (state.incorporation !== "ordinaria") state.flags.push(`incorporacion_${state.incorporation}`);
    if (state.strategicMission !== "comercio") state.flags.push(`mision_${state.strategicMission}`);
    if (state.secrecy < 60) {
      state.threat += 8;
      state.diplomacy += 8;
    }
    state.outboundSold = false;
    state.marketDay = 1;
    state.settlement = null;
    state.audienceResolved = false;
    state.wintered = false;
    addLog(
      `Despachada ${PROFILES[state.profile].name} desde ${state.departure === "cadiz" ? "Cádiz" : "Sevilla/Sanlúcar"} por el régimen de ${state.mode}.`,
      "despacho"
    );
    addLog(port.description, "puerto de despacho");
    addLog(
      `Avería ${formatMoney.format(calculation.averia)}; Tributo Real ${formatMoney.format(calculation.tribute)}; seguro ${formatMoney.format(calculation.insurance)}.`,
      "cuentas"
    );
    if (state.debtDue) addLog(`Préstamo particular recibido; vencimiento ${formatMoney.format(state.debtDue)}.`, "financiación");
    addLog(`Incorporación ${state.incorporation}; misión ${state.strategicMission}; secreto ${state.secrecy}/100.`, "acuerdo");
    updateHeader();
    showPhase("ida");
    setStatus("La Universidad certifica el despacho. Comienza la travesía de ida.", "success");
  }

  function goodPrice(good, index) {
    const base = Number(good.buy || good.basePrice || good.price || good.value || 100);
    const random = ENGINE.createRng(state.seed + state.expedition * 101 + state.marketDay * 1009 + index * 17);
    return Math.max(20, Math.round(base * (0.82 + random() * 0.42)));
  }

  function renderMarket() {
    const body = byId("market-table-body");
    if (!body) return;
    body.innerHTML = goods().slice(0, 8).map((good, index) => {
      const price = goodPrice(good, index);
      const demand = price > Number(good.buy || good.basePrice || good.price || 100) ? "Alta" : "Ordinaria";
      return `<tr>
        <td><span class="commodity-cell"><span class="commodity-icon" aria-hidden="true">${goodIcon(good)}</span><strong>${escapeHtml(good.name || good.label || good.id)}</strong></span></td>
        <td>${state.returnCargoValue > 0 ? "Lotes registrados" : "0"}</td>
        <td>${formatMoney.format(price)}</td>
        <td><span class="demand-pill ${demand === "Alta" ? "demand-pill--high" : ""}">${demand}</span></td>
        <td><button type="button" class="small-button" data-buy-good="${escapeHtml(good.id)}" data-price="${price}">Cargar lote</button></td>
      </tr>`;
    }).join("");
    body.querySelectorAll("[data-buy-good]").forEach((button) => {
      button.addEventListener("click", () => buyReturnCargo(button.dataset.buyGood, Number(button.dataset.price)));
    });
    const depart = byId("depart-america-button");
    if (depart) depart.disabled = !state.outboundSold || state.returnCargoValue <= 0;
    setText("market-cash-display", formatNumber.format(state.treasury));
    setText("return-cargo-value", formatNumber.format(state.returnCargoValue));
    setText("market-day-display", state.marketDay);
  }

  function enterMarket() {
    showPhase("mercado");
    renderMarket();
    setStatus("Los agentes de puerto han remitido precios y noticias mediante el correo marítimo.", "info");
  }

  function sellOutboundCargo() {
    if (state.outboundSold) return;
    const remaining = Math.max(0, state.cargoValue);
    const routeDemand = currentRoute().demand || {};
    const demandAverage = Object.keys(routeDemand).length
      ? Object.values(routeDemand).reduce((sum, value) => sum + Number(value || 1), 0) / Object.keys(routeDemand).length
      : 1.12;
    const revenue = ENGINE.money(remaining * Math.max(1.18, demandAverage + 0.16));
    state.treasury = ENGINE.money(state.treasury + revenue);
    state.cargoValue = 0;
    state.outboundSold = true;
    addLog(`Los agentes vendieron la carga de ida por ${formatMoney.format(revenue)}.`, "mercado");
    setStatus("Venta coordinada completada. Ya puede adquirirse la carga de retorno.", "success");
    updateHeader();
    renderMarket();
    saveState();
  }

  function buyReturnCargo(goodId, unitPrice) {
    if (!state.outboundSold) {
      setStatus("Primero debe liquidarse la carga de ida.", "warning");
      return;
    }
    const lotCost = Math.min(5000, Math.floor(state.treasury / 100) * 100);
    if (lotCost < 1000) {
      setStatus("La tesorería no dispone de fondos para otro lote.", "warning");
      return;
    }
    state.treasury = ENGINE.money(state.treasury - lotCost);
    state.returnCargoValue = ENGINE.money(state.returnCargoValue + lotCost);
    const selected = goods().find((good) => good.id === goodId);
    const units = Math.max(1, Math.round(lotCost / unitPrice));
    addLog(`Cargadas ${units} unidades de ${(selected && (selected.name || selected.label)) || goodId} por ${formatMoney.format(lotCost)}.`, "mercado");
    setStatus(`Carga de tornaviaje: ${formatMoney.format(state.returnCargoValue)}.`, "info");
    updateHeader();
    renderMarket();
    saveState();
  }

  function buySupplies() {
    const cost = 4000;
    if (state.treasury < cost) {
      setStatus("No hay fondos para carenar y reaprovisionar la flota.", "warning");
      return;
    }
    state.treasury -= cost;
    state.hull = ENGINE.clamp(state.hull + 18, 0, 100);
    state.sails = ENGINE.clamp(state.sails + 18, 0, 100);
    state.supplies = ENGINE.clamp(state.supplies + 25, 0, 100);
    addLog(`Pagados ${formatMoney.format(cost)} en carena, víveres y reparaciones.`, "pertrechos");
    updateHeader();
    setStatus("La flota ha sido reparada y reaprovisionada.", "success");
    saveState();
  }

  function waitMarketDay() {
    if (state.marketDay >= 3) {
      setStatus("La feria concluye hoy; debe cerrar el registro de retorno.", "warning");
      return;
    }
    state.marketDay += 1;
    state.delay += 1;
    renderMarket();
    addLog(`La compañía esperó al día ${state.marketDay} de feria para conocer nuevos precios.`, "mercado");
    setStatus("Los precios de la plaza han variado.", "info");
    saveState();
  }

  async function exportLog() {
    const text = state.log.slice().reverse().map((entry) => `[${entry.category}] ${entry.message}`).join("\n");
    try {
      await navigator.clipboard.writeText(text || "Registro del Escribano sin asientos.");
      setStatus("Relación del Escribano copiada al portapapeles.", "success");
    } catch (error) {
      window.prompt("Copie la relación del Escribano:", text);
    }
  }

  function departAmerica() {
    if (!state.outboundSold || state.returnCargoValue <= 0) {
      setStatus("Debe vender la carga de ida y embarcar mercancías de retorno.", "warning");
      return;
    }
    const returnCertification = ENGINE.certifyPlan(state.dispatch.plan, "return");
    if (!returnCertification.approved) {
      setStatus("La flota no cumple la composición mínima del tornaviaje.", "warning");
      return;
    }
    const winteringCost = 3000;
    if (state.treasury < winteringCost) {
      setStatus(`Se necesitan ${formatMoney.format(winteringCost)} para mantener, carenar y aprovisionar la flota durante la invernada.`, "warning");
      return;
    }
    state.treasury = ENGINE.money(state.treasury - winteringCost);
    state.hull = ENGINE.clamp(state.hull + 6, 0, 100);
    state.sails = ENGINE.clamp(state.sails + 8, 0, 100);
    state.supplies = ENGINE.clamp(state.supplies + 20, 0, 100);
    state.wintered = true;
    addLog(`La flota invernó en América; carena y aprovisionamiento: ${formatMoney.format(winteringCost)}.`, "invernada");
    addLog(`Al abrirse la primavera se inicia el tornaviaje con carga declarada por ${formatMoney.format(state.returnCargoValue)}.`, "tornaviaje");
    showPhase("tornaviaje");
    setStatus("Tras la invernada, la Almiranta cierra la formación y la flota parte en primavera.", "success");
  }

  function enterSettlement() {
    const saleMultiplier = 1.52;
    const saleRevenue = ENGINE.money(state.returnCargoValue * saleMultiplier);
    state.settlement = ENGINE.calculateSettlement(state, state.dispatch, saleRevenue);
    const missionReward = state.strategicMission === "socorro" ? 4500
      : state.strategicMission === "defensa" ? 3500 + state.strategicMerit * 100
        : state.strategicMission === "presa" && state.flags.includes("presa_autorizada") ? 3000 : 0;
    state.settlement.missionReward = missionReward;
    state.settlement.debtPayment = Math.min(state.debtDue || 0, Math.max(0, state.treasury + state.settlement.net + missionReward));
    state.settlement.net = ENGINE.money(state.settlement.net + missionReward - state.settlement.debtPayment);
    state.treasury = ENGINE.money(state.treasury + state.settlement.net);
    state.returnCargoValue = 0;
    addLog(`Carga de retorno liquidada por ${formatMoney.format(saleRevenue)}.`, "liquidación");
    if (state.settlement.insuranceClaim) {
      addLog(`Seguro reconocido por ${formatMoney.format(state.settlement.insuranceClaim)}.`, "seguro");
    }
    if (state.settlement.investorPayment) {
      addLog(`Partícipes satisfechos con ${formatMoney.format(state.settlement.investorPayment)}.`, "participaciones");
    }
    if (missionReward) addLog(`Servicio de ${state.strategicMission} reconocido con ${formatMoney.format(missionReward)}.`, "servicio real");
    if (state.settlement.debtPayment) addLog(`Préstamo particular amortizado por ${formatMoney.format(state.settlement.debtPayment)}.`, "financiación");
    showPhase("liquidacion");
    updateHeader();
    renderSettlement();
  }

  function renderSettlement() {
    if (!state.settlement) return;
    const settlement = state.settlement;
    const summary = byId("settlement-summary");
    const score = Math.round(
      state.treasury / 2500 + state.reputation + state.hull / 2 - state.delay * 3 - state.shipsLost * 15
    );
    if (summary) {
      summary.innerHTML = `
        <div class="result-seal ${settlement.companySolvent ? "success" : "failure"}">
          <span>${settlement.companySolvent ? "Expedición liquidada" : "Compañía insolvente"}</span>
          <strong>${score} puntos</strong>
        </div>
        <p>Casco ${Math.round(state.hull)} %, reputación ${Math.round(state.reputation)}/100,
        retraso ${state.delay} y pérdidas de carga ${formatMoney.format(state.cargoLost)}.</p>`;
    }
    const body = byId("settlement-table-body");
    if (body) {
      body.innerHTML = [
        ["Venta en España", settlement.saleRevenue],
        ["Indemnización del seguro", settlement.insuranceClaim],
        ["Pago a partícipes", -settlement.investorPayment],
        ["Merced por servicio", settlement.missionReward || 0],
        ["Amortización de préstamo", -(settlement.debtPayment || 0)],
        ["Resultado neto", settlement.net],
        ["Tesorería final", state.treasury],
      ].map(([label, value]) => `<tr><th>${label}</th><td>${value < 0 ? formatMoney.format(Math.abs(value)) : "—"}</td><td>${value >= 0 ? formatMoney.format(value) : "—"}</td></tr>`).join("");
    }
    const audience = byId("open-audience-button");
    if (audience) {
      audience.disabled = state.audienceResolved;
      audience.textContent = state.audienceResolved ? "Expediente resuelto" : "Abrir Real Audiencia";
    }
    const next = byId("next-expedition-button");
    if (next) next.disabled = false;
    setText("net-result-display", formatMoney.format(settlement.net));
  }

  function openAudience() {
    if (state.audienceResolved) return;
    const dialog = byId("event-dialog");
    const hasLoss = state.cargoLost > 0 || state.shipsLost > 0;
    const title = hasLoss ? "Reclamación por avería y seguro" : "Disputa sobre el premio de la escolta";
    const text = hasLoss
      ? "La Real Audiencia debe valorar el registro del Escribano, la buena fe y la diligencia del capitán."
      : "La escolta solicita una gratificación extraordinaria por haber preservado intacto el convoy.";
    const rulings = hasLoss ? [
      { label: "Aplicar estrictamente la Cédula", money: 0, reputation: 3, note: "Se mantiene la liquidación documentada." },
      { label: "Conceder indemnización equitativa", money: -Math.round(state.cargoLost * 0.25), reputation: 1, note: "La Compañía cubre una cuarta parte adicional de la pérdida." },
    ] : [
      { label: "Premiar a la escolta", money: -2500, reputation: 4, note: "La escolta recibe una merced extraordinaria." },
      { label: "Ingresar el sobrante en el Consulado", money: 0, reputation: -1, note: "La Audiencia rechaza el pago extraordinario." },
    ];
    const applyRuling = (ruling) => {
      state.treasury = ENGINE.money(state.treasury + ruling.money);
      state.reputation = ENGINE.clamp(state.reputation + ruling.reputation, 0, 100);
      state.audienceResolved = true;
      addLog(`${title}: ${ruling.note}`, "Real Audiencia");
      if (dialog) closeDialog(dialog);
      updateHeader();
      renderSettlement();
      setStatus(ruling.note, "success");
      saveState();
    };
    if (!dialog) {
      applyRuling(rulings[0]);
      return;
    }
    showDialog(dialog, `
      <article class="event-card audience-card">
        <p class="eyebrow">Real Audiencia</p>
        <h2>${title}</h2><p>${text}</p>
        <div class="event-choices">
          ${rulings.map((ruling, index) => `<button type="button" data-ruling="${index}">${ruling.label}</button>`).join("")}
        </div>
      </article>`);
    dialog.querySelectorAll("[data-ruling]").forEach((button) => {
      button.addEventListener("click", () => applyRuling(rulings[Number(button.dataset.ruling)]));
    });
  }

  function nextExpedition() {
    const retained = Math.max(100000, state.treasury);
    const reputation = state.reputation;
    const expedition = state.expedition + 1;
    state = defaultState({ treasury: retained, reputation, expedition, seed: Math.floor(Math.random() * 1000000000) });
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    populateSelectors();
    renderAll();
    setStatus("Se abre la matrícula de una nueva expedición.", "success");
  }

  function resetGame() {
    if (!window.confirm("Se perderá la partida guardada. ¿Desea comenzar de nuevo?")) return;
    localStorage.removeItem(SAVE_KEY);
    state = defaultState();
    populateSelectors();
    renderAll();
    setStatus("Nueva partida creada.", "success");
  }

  function renderRulesDialog() {
    const dialog = byId("help-dialog");
    if (!dialog) return;
    const regulations = collection(DATA.regulations).slice(0, 12);
    const rulesHtml = regulations.length
      ? regulations.map((rule) => `<li><strong>${escapeHtml(rule.year || rule.period || "Cédula")}</strong> ${escapeHtml(rule.name || rule.title || rule.text || rule.id)}</li>`).join("")
      : `<li><strong>1561–1564</strong> flotas, armada y rutas.</li>
         <li><strong>1717–1720</strong> Cádiz, registros, avisos y reforma del despacho.</li>
         <li><strong>1741</strong> convivencia con navíos de registro.</li>
         <li><strong>1764–1765</strong> correo marítimo y puertos habilitados.</li>
         <li><strong>1778–1790</strong> comercio directo y Juzgados de Arribadas.</li>`;
    dialog.innerHTML = `
      <article class="help-card">
        <button type="button" class="dialog-close" aria-label="Cerrar">×</button>
        <p class="eyebrow">Compendio histórico simultáneo</p>
        <h2>Instituciones y normas activas</h2>
        <p>Este prototipo no separa las reformas por eras. Las integra en un orden compuesto, tal como propone la Real Cédula del proyecto.</p>
        <ul>${rulesHtml}</ul>
        <p>Las cifras de balance procedentes del apartado 15 son experimentales y están identificadas en la documentación.</p>
      </article>`;
    const close = dialog.querySelector(".dialog-close");
    if (close) close.addEventListener("click", () => closeDialog(dialog));
  }

  function renderPhase() {
    if (state.phase === "despacho") renderDispatch();
    if (state.phase === "ida") renderProgress("ida");
    if (state.phase === "mercado") renderMarket();
    if (state.phase === "tornaviaje") renderProgress("tornaviaje");
    if (state.phase === "liquidacion") renderSettlement();
    renderCampaignMap();
  }

  function updateFleetSidebar() {
    const route = currentRoute();
    setText("route-origin", state.departure === "cadiz" ? "Cádiz" : "Sevilla/Sanlúcar");
    setText("route-destination", portName(route.destination) || route.name || "América");
    setText("fleet-status", state.phase === "despacho" ? "En despacho" : state.phase === "liquidacion" ? "En puerto" : "En navegación");
    const profile = PROFILES[state.profile] || PROFILES.equilibrada;
    const fleetList = byId("fleet-list");
    if (fleetList) {
      const planned = !state.dispatch;
      const rows = [
        { count: profile.merchantCount, role: "merchant", name: "Mercantes", detail: planned ? "proyecto de carga" : `${Math.round(state.hull)} % de casco`, health: planned ? 100 : state.hull, icon: "⛵" },
        { count: profile.escortCount, role: "escort", name: "Escoltas", detail: "defensa a barlovento", health: planned ? 100 : state.cohesion, icon: "⚓" },
        { count: profile.avisoCount, role: "aviso", name: "Avisos", detail: "correo y descubierta", health: planned ? 100 : state.information, icon: "➶" },
      ].filter((row) => row.count > 0);
      fleetList.innerHTML = rows.length ? rows.map((row) => `
        <li class="fleet-vessel fleet-vessel--${row.role} ${planned ? "is-planned" : ""}">
          <div class="fleet-vessel__identity">
            <span class="fleet-vessel__icon" aria-hidden="true">${row.icon}</span>
            <span class="fleet-vessel__title"><strong>${row.count} × ${row.name}</strong><small>${row.detail}</small></span>
          </div>
          <span class="fleet-vessel__condition" aria-hidden="true"><i style="width:${ENGINE.clamp(row.health, 0, 100)}%"></i></span>
          <span class="fleet-vessel__meta"><span>${planned ? "Proyecto" : "En servicio"}</span><span>${Math.round(row.health)} %</span></span>
        </li>`).join("") : `<li class="fleet-list__empty"><span aria-hidden="true">◇</span>Sin navíos disponibles.</li>`;
    }
    setText("escort-display", state.dispatch ? `${profile.escortCount} escoltas` : "0 escoltas");
    setText("supplies-display", `${Math.round(state.supplies)} %`);
    setText("averia-display", state.dispatch ? formatMoney.format(state.dispatch.averia) : "0 reales");
    setText("morale-display", state.morale >= 70 ? "Serena" : state.morale >= 40 ? "Inquieta" : "Quebrantada");
    const totalLegs = routeLegs(route, "ida").length + routeLegs(route, "tornaviaje").length;
    const completed = state.outboundIndex + state.returnIndex;
    const ship = byId("route-ship");
    if (ship) ship.style.left = `${ENGINE.clamp(completed / Math.max(1, totalLegs) * 100, 0, 100)}%`;
    const routeCaptions = {
      despacho: `Ruta prevista hacia ${portName(route.destination) || "América"}.`,
      ida: `Travesía de ida: ${state.outboundIndex} de ${routeLegs(route, "ida").length} tramos.`,
      mercado: `Flota fondeada en ${portName(route.destination) || "América"}.`,
      tornaviaje: `Regreso: ${state.returnIndex} de ${routeLegs(route, "tornaviaje").length} tramos.`,
      liquidacion: `Expedición de vuelta en ${state.departure === "cadiz" ? "Cádiz" : "Sevilla/Sanlúcar"}.`,
    };
    setText("route-caption", routeCaptions[state.phase] || routeCaptions.despacho);
    renderCampaignMap();
  }

  function renderAll() {
    updateHeader();
    renderLog();
    showPhase(state.phase);
  }

  function bindEvents() {
    ["route-select", "ship-select", "cargo-budget", "insurance-check", "escort-check", "mail-check", "departure-select", "voyage-mode-select", "participation-input", "participation-select", "university-certification", "incorporation-select", "mission-select", "loan-select", "secrecy-select"]
      .forEach((id) => {
        const element = byId(id);
        if (element) element.addEventListener("change", syncPlanState);
        if (element && element.tagName === "INPUT") element.addEventListener("input", syncPlanState);
      });
    document.querySelectorAll('input[name="trade-regime"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        if (radio.value === "suelto") state.profile = "suelto";
        else if (radio.value === "registro") state.profile = "registro";
        else if (state.profile === "suelto" || state.profile === "registro") state.profile = "equilibrada";
        const ship = byId("ship-select");
        if (ship) ship.value = state.profile;
        syncPlanState();
      });
    });
    const dispatch = byId("dispatch-button");
    if (dispatch) dispatch.addEventListener("click", dispatchFleet);
    const exam = byId("university-exam-button");
    if (exam) exam.addEventListener("click", openUniversityExam);
    const admission = byId("admission-button");
    if (admission) admission.addEventListener("click", requestAdmission);
    const applyComposition = byId("add-ship-button");
    if (applyComposition) applyComposition.addEventListener("click", () => {
      syncPlanState();
      setStatus("Composición incorporada al proyecto de despacho.", "success");
    });
    const sailOut = byId("sail-button");
    if (sailOut) sailOut.addEventListener("click", () => sail("ida"));
    const sell = byId("sell-all-button");
    if (sell) sell.addEventListener("click", sellOutboundCargo);
    const supplies = byId("buy-supplies-button");
    if (supplies) supplies.addEventListener("click", buySupplies);
    const refreshMarket = byId("refresh-market-button");
    if (refreshMarket) refreshMarket.addEventListener("click", waitMarketDay);
    const depart = byId("depart-america-button");
    if (depart) depart.addEventListener("click", departAmerica);
    const sailReturn = byId("return-sail-button");
    if (sailReturn) sailReturn.addEventListener("click", () => sail("tornaviaje"));
    const audience = byId("open-audience-button");
    if (audience) audience.addEventListener("click", openAudience);
    const next = byId("next-expedition-button");
    if (next) next.addEventListener("click", nextExpedition);
    const openHelp = () => {
      const dialog = byId("help-dialog");
      if (dialog) {
        renderRulesDialog();
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      }
    };
    [byId("help-button"), byId("ordinance-button")].filter(Boolean).forEach((help) => help.addEventListener("click", openHelp));
    const reset = byId("reset-button") || byId("new-game-button") || $("[data-reset-game]");
    if (reset) reset.addEventListener("click", resetGame);
    const exportButton = byId("export-log-button");
    if (exportButton) exportButton.addEventListener("click", exportLog);
    $$("[data-map-port]").forEach((port) => {
      port.addEventListener("click", () => {
        const name = port.querySelector("b");
        setStatus(`${name ? name.textContent : "Puerto"}: ${MAP_PORT_INFO[port.dataset.mapPort] || "Escala de la Carrera de Indias."}`, "info");
      });
    });
    const filterButton = byId("scribe-filter-button");
    if (filterButton) filterButton.hidden = true;
  }

  function init() {
    ensureDispatchControls();
    ensureAdvancedControls();
    populateSelectors();
    bindEvents();
    renderRulesDialog();
    renderAll();
    if (!state.log.length) {
      setStatus("Configure la expedición y solicite la certificación de la Universidad de Mareantes.", "info");
    } else {
      setStatus("Partida restaurada desde el registro local.", "info");
    }
    document.documentElement.dataset.gameReady = "true";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window, document);
