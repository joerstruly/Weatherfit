# RW-5 "FERRET" — Rotorwheel Hybrid Ground–Air Vehicle

**Concept Specification, Rev B** · 2026-09-05 · Unarmed ISR / scout mobility platform

Rev B supersedes Rev A: coaxial two-stage fans in smaller wheels, two-axis
tilt (flip + fore/aft pitch), lift fan embedded in the hull with a thrust-
vectoring vane box, and a delta lifting-body hull.

---

## 1. Concept

A hybrid unmanned vehicle with four small road wheels, each carrying a pair of
contra-rotating ducted fans in its hubless center, and a fifth lift fan buried
in the rear of a wing-shaped hull. On the ground it is a skid-steered scout
narrow enough for doorways. To fly, the wheels flip outboard to horizontal;
once flat they can also pitch fore and aft, so the vehicle transitions from
hover into fast forward flight with the hull itself generating lift.

Design thesis: **ground for endurance, air for obstacles and speed.** Wheel-sized
rotors are aerodynamically expensive (§8.1), so hover is a transition state, not
a loiter mode; the airframe is built to get *through* hover into cruise, where
tilted rotors and the lifting body make flight far cheaper.

### Mission profile (design case)

| Segment | Mode | Notes |
|---|---|---|
| Approach, patrol, interior traverse | Ground | ~85% of distance, ~3 h available |
| Obstacle hops, floor/roof transfers | Hover / low-speed | ≤ 9 min total hover budget |
| Repositioning, dash to next vantage | Cruise | ~110 km/h, ~17 min, ~30 km |

## 2. Hull — delta lifting body

- **Planform:** F1-style narrow nose (160 mm at the sensor tip) between the front
  wheels, widening in a straight delta to 440 mm hull / **680 mm overall** at the
  rear wheels. Blunt (Kamm) tail.
- **Section:** cambered thick airfoil front-to-back — low nose, maximum
  thickness (~200 mm) ahead of mid-chord, tapering to a 70 mm trailing edge.
  Chord 1,200 mm.
- **Aerodynamics (calc.):** planform ≈ 0.25 m², effective aspect ratio ~0.7. At
  110 km/h and ~8° angle of attack (C_L ≈ 0.7) the hull carries ~26% of weight;
  at 145 km/h ~46%. Low aspect ratio means it never carries the whole vehicle —
  the point is unloading the rotors, not gliding.
- **Ground role:** the same shape gives a low, sloped signature and a flat belly
  for skid landings; ground clearance 150 mm.

## 3. Rotor-wheel module (×4)

Hubless Ø 400 mm wheel; the open center holds two contra-rotating fans.

From outside in:

1. **Airless shear-band tire** — Ø 400 mm, 130 mm wide, non-pneumatic.
2. **Rim drive ring motor** — in-rim stator, direct drive, 1.2 kW continuous.
3. **Structural hubless rim** — doubles as the duct wall (100 mm deep).
4. **Two tip-drive fan rings** — one per stage, independent.
5. **Two 7-blade fan stages, Ø 320 mm, contra-rotating** — stage spacing 55 mm.
6. **Debris mesh**, both faces (~5% thrust penalty, rejects > 8 mm).
7. **Static hub** — no shaft through the center; nav light and sonar.
8. **Two-axis mount:** *flip* 95° about the fore-aft axis (wheel vertical →
   horizontal outboard), then *pitch* −20° to +70° about the lateral axis.
   Both axes have mechanical endpoint locks.

### Why coaxial

- **Torque-neutral per wheel.** The two stages cancel reaction torque, so no
  CW/CCW pairing across the vehicle and no yaw upset when one wheel fails.
- **~35% more thrust from the same Ø 320 disc** than a single stage (at roughly
  1.7× the power). This is what lets the wheel shrink from Ø 520 to Ø 400.
- **Graceful degradation:** one dead stage leaves ~60% of that wheel's thrust.
- Cost: ~10% worse figure of merit than a single rotor of the same disc area,
  and a second motor, mesh, and controller per wheel.

### Why two-axis tilt

Coaxial units produce no reaction torque, so yaw *must* come from vectoring.
Differential fore/aft pitch (left discs forward, right discs back) provides yaw
in hover; symmetric forward pitch provides cruise propulsion. Pitch authority
also trims the lifting body across the speed range.

## 4. Embedded lift fan + vane box

- **Fan:** Ø 380 mm, 7 blades, fixed vertical in the rear hull at ~62% chord,
  between the rear wheels. Top inlet with two doors (closed in drive mode — the
  wing surface stays clean and the fan protected).
- **Vane box:** a cascade of pivoting vanes under the fan deflects the exhaust
  from straight down to **50° aft**. This is how the rear fan "tilts forward":
  the fan does not move; its thrust does. Precedent: the F-35B lift-fan vane box.
- **Roles:** ~25% of hover thrust and direct pitch trim at liftoff; forward
  thrust in transition; unloads toward pure propulsion in cruise.
- **Why not physically tilt the fan:** a Ø 380 fan tilting inside a 200 mm thick
  hull needs a cutout that removes most of the rear planform and the wing's
  upper surface. Vanes cost ~4% thrust and zero structure.

## 5. Dimensions & masses

| Item | Value |
|---|---|
| Length / width / height, drive mode | 1,200 / **680** / 460 mm |
| Nose width at sensor | 160 mm |
| Flight footprint (discs deployed) | 1,510 × 1,200 mm |
| Wheel Ø / tire width | 400 / 130 mm |
| Wheel fans | 4 × (2 × Ø 320, coaxial) |
| Embedded lift fan | 1 × Ø 380 |
| Ground clearance | 150 mm |
| Gross takeoff mass (GTOW) | 38 kg |
| Payload (EO/IR + radio fit), in GTOW | 3.0 kg |

### Mass budget (target, kg)

| Group | kg |
|---|---|
| Lifting-body hull / structure | 8.0 |
| Rotor-wheel modules, 4 × 3.6 | 14.4 |
| Lift fan + inlet doors + vane box | 3.0 |
| Battery (2.0 kWh Li-ion, 250 Wh/kg) | 8.0 |
| Avionics, comms, ISR payload | 3.0 |
| Wiring, thermal, misc | 1.6 |
| **GTOW** | **38.0** |

## 6. Performance (calculated, ISA sea level)

**Hover.** Disc area = 4·π(0.16)² + π(0.19)² = 0.435 m². Disc loading =
**87 kg/m²** (Rev A: 64 — smaller wheels made hover worse). Ideal hover power
= T^1.5/√(2ρA) ≈ 7.0 kW; coaxial figure of merit 0.60 with mesh → **≈ 11.6 kW**
electrical.

**Cruise.** At 110 km/h the hull carries ~26% of weight, and the tilted discs
operate at high advance ratio where rotor efficiency roughly doubles versus
hover. Estimated cruise power ≈ 6.5 kW.

| Metric | Value |
|---|---|
| Hover endurance (90% usable) | **≈ 9 min** |
| Cruise speed / endurance / range | **~110 km/h / ~17 min / ~30 km** |
| Max dash | ~145 km/h (hull at ~46% of lift) |
| Ground speed, max / patrol | 45 / 20 km/h |
| Ground endurance @ 20 km/h | ≈ 3 h, ~50 km |
| Rolled step (Ø 400 wheels) | ≤ 130 mm; anything above is flown |
| Transition, drive → airborne | ≈ 3 s (flip 1.8 s, spool 1.2 s) |
| Transition, hover → cruise | ≈ 6 s, discs pitching 0 → 60° |
| Acoustic (hover) | ~88–92 dBA @ 10 m est.; quiet only on wheels |

## 7. Subsystems

- **Autonomy/nav:** GNSS + visual-inertial odometry; lidar ring for doorway
  centering; operator-in-the-loop for flight in Gen-1.
- **Comms:** 2 W MANET mesh; fiber-spool option for RF-silent interior work.
- **Payload:** nose EO/IR sensor (drive) + stowable-mast gimbal; two powered
  accessory rails.
- **Power:** hot-swap battery cassette forward of the lift fan; 100 V bus for
  13 motors (4 rim, 8 fan stages, 1 lift fan) and 9 actuators (8 tilt, 1 vane box).

## 8. The hard problems (honest assessment)

**8.1 Disc loading got worse, cruise got better.** Smaller wheels cut disc area
by a third; coaxial stages recover the thrust but not the efficiency, so hover
now costs 11.6 kW for 38 kg. The lifting body and pitching discs are the
counterweight: cruise at ~6.5 kW. Net: hover is a 9-minute transition budget;
useful flight is forward flight. Do not design missions around hovering.

**8.2 Complexity is now the dominant risk.** 13 motors, 9 actuators, 8 mesh
faces, 4 two-axis mounts. Each rotor-wheel is a small tilt-rotor nacelle that
also has to survive being a wheel. Mitigation: module-level replaceability
(one connector, four bolts), drive mode fully functional with any flight
subsystem dead, land-and-drive as the universal abort.

**8.3 Low-aspect-ratio lifting body.** AR ~0.7 gives a shallow lift slope and
heavy induced drag; it will not glide. The hull earns its keep only above
~90 km/h. Below that it is a fairing, and at hover it is a flat plate in the
downwash of four discs (expect ~4–6% download on the outboard hull edges).

**8.4 Vane box in the mud.** The vane cascade is under the vehicle, exactly where
mud packs. Vanes park closed in drive mode behind a belly door; deep-mud VTOL is
degraded until a spin-clean cycle.

**8.5 CG and pitch trim.** The lift fan sits at ~62% chord, aft of the CG (~45%).
That is deliberate — the vane box and disc pitch give strong pitch authority —
but it means the lift fan is *mandatory* for hover, not a helper: lose it and
the vehicle must land within seconds on the four discs alone (~75% thrust,
descending). Rev A's tail fan was optional; Rev B's is not.

**8.6 Why not a caged quadcopter?**

| | RW-5 rotorwheel | Caged / rolling quadcopter |
|---|---|---|
| Cruise speed / efficiency | ~110 km/h, lifting body + tilted discs | Slow, rotors drag the cage |
| Hover efficiency | Poor (87 kg/m²) | Good |
| Ground endurance | ~3 h powered wheels | Low; rotors turn to roll |
| Ground signature | Quiet, low profile | Rotors always audible |
| Mechanical complexity | High | Low |
| Doorways | 680 mm drive mode | Cage ≥ rotor span |

## 9. Development path

1. **Gen-0 (bench):** one coaxial rotor-wheel on a thrust stand and dyno —
   validate FoM ≥ 0.55 with mesh, both stages' thermals, two-axis mount loads.
2. **Gen-0.3 (tunnel):** 1:2 lifting-body model — confirm C_L ≈ 0.7 at 8° and
   pitch behaviour with the lift-fan inlet open and closed.
3. **Gen-0.5 (surrogate):** COTS tilt-rotor quad on a skid-steer chassis — fly
   the mission profile to test the ground/air doctrine before integration.
4. **Gen-1:** full airframe; tethered hover; free transitions; hover → cruise.
5. **Gen-2:** environmental hardening (mud, sand, EMI); autonomous doorway and
   stairwell traversal.

## 10. Renderings

Rendering set in [`renderings/`](renderings/):

| File | View |
|---|---|
| `01-side-elevation-drive.svg` | Side elevation, centerline section, drive mode |
| `02-plan-flight.svg` | Plan view, flight mode, discs deployed, lift fan open |
| `03-wheel-module-cutaway.svg` | Rotor-wheel module: face-on cutaway + axle section |
| `04-flight-modes.svg` | Drive / hover / cruise, side view |
