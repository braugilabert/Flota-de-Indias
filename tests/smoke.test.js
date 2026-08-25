"use strict";

const assert = require("node:assert/strict");
const engine = require("../js/engine.js");

function test(name, callback) {
  try {
    callback();
    console.log(`OK  ${name}`);
  } catch (error) {
    console.error(`ERR ${name}`);
    throw error;
  }
}

test("una Flota insuficientemente escoltada no recibe certificación", () => {
  const result = engine.certifyPlan({
    mode: "flota",
    merchantCount: 3,
    escortCount: 1,
    avisoCount: 0,
    cargoBudget: 20000,
  });
  assert.equal(result.approved, false);
});

test("dos avisos satisfacen el mínimo de la ida", () => {
  const result = engine.certifyPlan({
    mode: "flota",
    merchantCount: 3,
    escortCount: 0,
    avisoCount: 2,
    cargoBudget: 20000,
  });
  assert.equal(result.approved, true);
});

test("las participaciones nunca superan la mitad de la carga", () => {
  const result = engine.calculateDispatch({
    mode: "flota",
    merchantCount: 3,
    escortCount: 2,
    avisoCount: 1,
    cargoBudget: 20000,
    participations: 50000,
    insurance: true,
    shipValue: 50000,
  });
  assert.equal(result.acceptedParticipations, 10000);
  assert.equal(result.rejectedParticipations, 40000);
});

test("el navío suelto no paga avería ni obtiene seguro", () => {
  const result = engine.calculateDispatch({
    mode: "suelto",
    merchantCount: 1,
    escortCount: 0,
    avisoCount: 0,
    cargoBudget: 10000,
    participations: 0,
    insurance: true,
    shipValue: 15000,
  });
  assert.equal(result.averia, 0);
  assert.equal(result.insurance, 0);
});

test("la negligencia impide cobrar el seguro", () => {
  const dispatch = engine.calculateDispatch({
    mode: "flota",
    merchantCount: 3,
    escortCount: 2,
    avisoCount: 0,
    cargoBudget: 20000,
    participations: 0,
    insurance: true,
    shipValue: 50000,
  });
  const claim = engine.calculateInsuranceClaim(
    { cargoLost: 8000, shipsLost: 1, negligence: true },
    dispatch
  );
  assert.equal(claim, 0);
});

console.log("Pruebas de humo completadas.");

