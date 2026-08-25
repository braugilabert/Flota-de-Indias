/*
 * Reglas puras del prototipo. No toca el DOM, por lo que puede probarse con
 * Node y reutilizarse si más adelante se cambia la interfaz.
 */
(function attachEngine(globalScope) {
  "use strict";

  const DEFAULT_RULES = Object.freeze({
    averiaPerMerchant: 1200,
    tributeRate: 0.10,
    cargoInsuranceRate: 0.08,
    hullInsuranceRate: 0.015,
    escortCharter: 2400,
    avisoCharter: 1000,
    suppliesPerShip: 600,
    participationReturnRate: 0.10,
    maxParticipationRate: 0.50,
    almojarifazgoRate: 0.025,
    alcabalaRate: 0.02,
    portDuesRate: 0.01,
    loanInterestRate: 0.12,
  });

  const FORMATIONS = Object.freeze({
    cerrada: { enemy: 0.68, storm: 1.14, general: 0.90, delay: 1 },
    ordinaria: { enemy: 1, storm: 1, general: 1, delay: 0 },
    dispersa: { enemy: 1.38, storm: 0.84, general: 1.10, delay: -1 },
  });

  const MODES = Object.freeze({
    flota: { risk: 0.86, averia: true, insurance: true, protection: true },
    registro: { risk: 1.02, averia: true, insurance: true, protection: true },
    suelto: { risk: 1.28, averia: false, insurance: false, protection: false },
  });

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, Number(value) || 0));
  }

  function money(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function normalizePlan(rawPlan) {
    const plan = rawPlan || {};
    return {
      mode: MODES[plan.mode] ? plan.mode : "flota",
      merchantCount: Math.round(clamp(plan.merchantCount, 1, 8)),
      escortCount: Math.round(clamp(plan.escortCount, 0, 5)),
      avisoCount: Math.round(clamp(plan.avisoCount, 0, 4)),
      cargoBudget: money(clamp(plan.cargoBudget, 5000, 100000)),
      participations: money(Math.max(0, Number(plan.participations) || 0)),
      insurance: Boolean(plan.insurance),
      shipValue: money(Math.max(0, Number(plan.shipValue) || 0)),
    };
  }

  function certifyPlan(rawPlan, leg) {
    const plan = normalizePlan(rawPlan);
    const problems = [];
    const warnings = [];
    const voyageLeg = leg === "return" ? "return" : "outbound";

    if (plan.mode === "flota") {
      const hasMinimum = voyageLeg === "outbound"
        ? plan.escortCount >= 2 || plan.avisoCount >= 2
        : plan.escortCount >= 1 || plan.avisoCount >= 2;
      if (!hasMinimum) {
        problems.push(
          voyageLeg === "outbound"
            ? "La Flota necesita dos escoltas o dos navíos de aviso para la ida."
            : "El tornaviaje necesita una escolta o dos navíos de aviso."
        );
      }
    }

    if (plan.mode === "registro" && plan.escortCount + plan.avisoCount < 1) {
      warnings.push("El navío de registro partirá sin exploración ni apoyo armado.");
    }
    if (plan.mode === "suelto") {
      warnings.push("El navío suelto queda fuera de la avería, escolta y seguro de la Compañía.");
    }
    if (plan.cargoBudget < plan.merchantCount * 3000) {
      warnings.push("Parte de la capacidad mercante zarpará sin aprovecharse.");
    }

    return { approved: problems.length === 0, problems, warnings, plan };
  }

  function calculateDispatch(rawPlan, customRules) {
    const rules = Object.assign({}, DEFAULT_RULES, customRules || {});
    const plan = normalizePlan(rawPlan);
    const mode = MODES[plan.mode];
    const maximumParticipation = money(plan.cargoBudget * rules.maxParticipationRate);
    const acceptedParticipations = money(Math.min(plan.participations, maximumParticipation));
    const averia = mode.averia ? money(plan.merchantCount * rules.averiaPerMerchant) : 0;
    const tribute = money(plan.cargoBudget * rules.tributeRate);
    /* Desglose jugable de cargas fiscales. No se suma otra vez al total: el
       Tributo Real compuesto ya representa la carga fiscal agregada. */
    const taxes = {
      almojarifazgo: money(plan.cargoBudget * rules.almojarifazgoRate),
      alcabala: money(plan.cargoBudget * rules.alcabalaRate),
      palmeoTonelada: money(plan.cargoBudget * rules.portDuesRate),
    };
    taxes.tributoCorona = money(Math.max(0, tribute - taxes.almojarifazgo - taxes.alcabala - taxes.palmeoTonelada));
    const escort = money(
      plan.escortCount * rules.escortCharter + plan.avisoCount * rules.avisoCharter
    );
    const supplies = money(
      (plan.merchantCount + plan.escortCount + plan.avisoCount) * rules.suppliesPerShip
    );
    const insurance = plan.insurance && mode.insurance
      ? money(
        plan.cargoBudget * rules.cargoInsuranceRate
          + plan.shipValue * rules.hullInsuranceRate
      )
      : 0;
    const grossCost = money(plan.cargoBudget + averia + tribute + escort + supplies + insurance);
    const treasuryCost = money(grossCost - acceptedParticipations);

    return {
      plan,
      averia,
      tribute,
      taxes,
      escort,
      supplies,
      insurance,
      acceptedParticipations,
      rejectedParticipations: money(plan.participations - acceptedParticipations),
      grossCost,
      treasuryCost,
      participationLiability: money(
        acceptedParticipations * (1 + rules.participationReturnRate)
      ),
    };
  }

  function calculateFinance(rawRequest, treasury, customRules) {
    const rules = Object.assign({}, DEFAULT_RULES, customRules || {});
    const request = rawRequest || {};
    const loan = money(clamp(request.loan, 0, 30000));
    const donation = money(clamp(request.donation, 0, 12000));
    const prize = money(clamp(request.prize, 0, 20000));
    return {
      loan,
      donation,
      prize,
      available: money((treasury || 0) + loan + donation + prize),
      debtDue: money(loan * (1 + rules.loanInterestRate)),
    };
  }

  function resolveCombat(rawState, action, randomValue) {
    const battle = Object.assign({ escortStrength: 40, enemyStrength: 45, cargoValue: 0, hull: 100, cohesion: 70 }, rawState || {});
    const tactics = {
      line: { attack: 18, defence: 0.88, cargoLoss: 0.02, cohesion: -3 },
      protect: { attack: 10, defence: 0.68, cargoLoss: 0.005, cohesion: 2 },
      evade: { attack: 5, defence: 1.08, cargoLoss: 0.05, cohesion: -8 },
    };
    const tactic = tactics[action] || tactics.line;
    const roll = clamp(randomValue == null ? 0.5 : randomValue, 0, 1);
    const enemyDamage = money(tactic.attack * (0.75 + roll * 0.5));
    const ownDamage = money(Math.max(2, battle.enemyStrength / 7 * tactic.defence * (1.25 - roll * 0.5)));
    const enemyStrength = Math.max(0, money(battle.enemyStrength - enemyDamage));
    const escortStrength = Math.max(0, money(battle.escortStrength - ownDamage));
    const cargoLoss = money(battle.cargoValue * tactic.cargoLoss * (1.25 - roll * 0.5));
    return {
      escortStrength,
      enemyStrength,
      hull: clamp(battle.hull - ownDamage * 0.55, 0, 100),
      cohesion: clamp(battle.cohesion + tactic.cohesion, 0, 100),
      cargoLoss,
      won: enemyStrength <= 0 || (enemyStrength < escortStrength * 0.35),
      escaped: action === "evade" && roll >= 0.45,
    };
  }

  function riskMultiplier(formation, category, mode) {
    const formationRules = FORMATIONS[formation] || FORMATIONS.ordinaria;
    const modeRules = MODES[mode] || MODES.flota;
    const key = category === "enemy" || category === "storm" ? category : "general";
    return formationRules[key] * modeRules.risk;
  }

  function createRng(seed) {
    let value = (Number(seed) || Date.now()) >>> 0;
    return function random() {
      value += 0x6D2B79F5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function chooseWeighted(items, random) {
    const candidates = (items || []).filter(Boolean);
    if (!candidates.length) return null;
    const total = candidates.reduce((sum, item) => sum + Math.max(0, item.weight || 1), 0);
    let roll = (random || Math.random)() * total;
    for (const item of candidates) {
      roll -= Math.max(0, item.weight || 1);
      if (roll <= 0) return item;
    }
    return candidates[candidates.length - 1];
  }

  function applyEffects(currentState, effects, multiplier) {
    const state = Object.assign({}, currentState);
    const effect = effects || {};
    const scale = Number(multiplier) || 1;
    const cargoBefore = Math.max(0, Number(state.cargoValue) || 0);
    const returnCargoBefore = Math.max(0, Number(state.returnCargoValue) || 0);
    const cargoPool = returnCargoBefore > 0 ? "returnCargoValue" : "cargoValue";
    const activeCargo = cargoPool === "returnCargoValue" ? returnCargoBefore : cargoBefore;
    const cargoLoss = money(
      activeCargo * clamp((effect.cargoLossPercent || 0) * scale, 0, 100) / 100
    );

    state.treasury = money((state.treasury || 0) + (effect.treasury || 0) * scale);
    state[cargoPool] = money(Math.max(0, activeCargo - cargoLoss));
    const structuredDamage = effect.shipDamage || {};
    state.hull = clamp(
      (state.hull == null ? 100 : state.hull)
        + ((effect.hull || 0) + (structuredDamage.hull || 0)) * scale,
      0,
      100
    );
    state.sails = clamp(
      (state.sails == null ? 100 : state.sails)
        + ((effect.sails || 0) + (structuredDamage.sails || 0)) * scale,
      0,
      100
    );
    state.morale = clamp((state.morale == null ? 70 : state.morale) + (effect.morale || 0), 0, 100);
    state.cohesion = clamp((state.cohesion == null ? 70 : state.cohesion) + (effect.cohesion || 0), 0, 100);
    state.information = clamp((state.information || 0) + (effect.information || 0), 0, 100);
    state.reputation = clamp((state.reputation == null ? 50 : state.reputation) + (effect.reputation || 0), 0, 100);
    state.threat = clamp((state.threat || 0) + (effect.threat || 0), 0, 100);
    state.delay = Math.max(0, (state.delay || 0) + (effect.delay || 0) + (effect.delayDays || 0));
    state.supplies = Math.max(0, money((state.supplies || 0) + (effect.supplies || 0) * scale));
    state.cargoLost = money((state.cargoLost || 0) + cargoLoss);
    state.shipsLost = Math.max(0, (state.shipsLost || 0) + (effect.shipsLost || 0));
    if (effect.negligence) state.negligence = true;
    if (effect.dispute) state.disputes = (state.disputes || 0) + 1;
    if (Array.isArray(effect.flags) && effect.flags.length) {
      state.flags = Array.from(new Set((state.flags || []).concat(effect.flags)));
      if (effect.flags.some((flag) => flag.includes("reclamacion") || flag.includes("presa"))) {
        state.disputes = (state.disputes || 0) + 1;
      }
      if (effect.flags.some((flag) => flag.includes("contrabando") || flag.includes("sin_cobertura"))) {
        state.negligence = true;
      }
    }
    return state;
  }

  function calculateInsuranceClaim(state, dispatch) {
    if (!dispatch || !dispatch.plan.insurance || dispatch.plan.mode === "suelto") return 0;
    if (state.negligence) return 0;
    const insuredCargoLoss = money((state.cargoLost || 0) * 0.75);
    const insuredHullLoss = state.shipsLost > 0
      ? money(dispatch.plan.shipValue * 0.33 * Math.min(1, state.shipsLost))
      : 0;
    return money(insuredCargoLoss + insuredHullLoss);
  }

  function calculateSettlement(state, dispatch, saleRevenue) {
    const revenue = money(saleRevenue);
    const insuranceClaim = calculateInsuranceClaim(state, dispatch);
    const investorPayment = Math.min(
      money(dispatch ? dispatch.participationLiability : 0),
      money(Math.max(0, revenue + insuranceClaim))
    );
    const net = money(revenue + insuranceClaim - investorPayment);
    return {
      saleRevenue: revenue,
      insuranceClaim,
      investorPayment,
      net,
      companySolvent: money((state.treasury || 0) + net) >= 0,
    };
  }

  const api = {
    DEFAULT_RULES,
    FORMATIONS,
    MODES,
    clamp,
    money,
    normalizePlan,
    certifyPlan,
    calculateDispatch,
    calculateFinance,
    resolveCombat,
    riskMultiplier,
    createRng,
    chooseWeighted,
    applyEffects,
    calculateInsuranceClaim,
    calculateSettlement,
  };

  globalScope.CDI_ENGINE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
