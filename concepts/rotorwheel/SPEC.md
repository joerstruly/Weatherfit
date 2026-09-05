# RW-5 "FERRET" — Rotorwheel Hybrid Ground–Air Vehicle

**Concept Specification, Rev C** · 2026-09-05 · Unarmed ISR / scout mobility platform

Rev C adds the staggered rotor arrangement (§3.1), the two-seat variant RW-2S
(§11) and the turbine analysis at human scale (§12).

Rev B superseded Rev A: coaxial two-stage fans in smaller wheels, two-axis
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

### 3.1 Staggered discs (Rev C)

In cruise the rear discs sit directly behind the front pair. Coplanar, they fly
in the front discs' wake: ~10–15% thrust loss on the rear pair plus vibration
and noise (the reason the CH-47's rear pylon is taller than its front one).
Over the 720 mm wheelbase at 110 km/h the front wake descends ~0.2 m under its
own induced velocity but rises ~0.1 m in the body frame because the hull flies
nose-up, so it arrives at the rear axle only ~0.1 m below the front disc plane,
with a radius of at least 0.16 m. Clearing it needs the rear disc centre ≥ 0.22 m
above the front; with margin, **300 mm (0.75 D)**.

Implementation: the front flip pivots sit low on the hull flank; the rear
pivots sit on raised shoulder pylons (+120 mm) with longer swing-arms, so that
when both pairs flip to horizontal the rear discs are 300 mm higher. In drive
mode all four wheels remain at axle height — the rear arm is simply a longer
swingarm. Cruise AoA is held at **5°** rather than 8° (each degree of nose-up
pushes the wake toward the rear discs); the hull gives up a little lift.

Side effects to carry in the control law: a small pitch coupling from the
vertical offset between front and rear thrust lines during translation, and a
nose-down tendency in the first half-metre of liftoff as the higher rear discs
leave ground effect first. The vane box trims both.

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
| Cruise speed / endurance / range | **~110 km/h / ~17 min / ~30 km** (rear discs in clean air) |
| Max dash | ~145 km/h (hull at ~46% of lift) |
| Ground speed, max / patrol | 45 / 20 km/h |
| Ground endurance @ 20 km/h | ≈ 3 h, ~50 km |
| Rolled step (Ø 400 wheels) | ≤ 130 mm; anything above is flown |
| Transition, drive → airborne | ≈ 3 s (flip 1.8 s, spool 1.2 s) |
| Transition, hover → cruise | ≈ 6 s, discs pitching 0 → 60° |
| Cruise angle of attack | 5° |
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

## 11. Two-seat variant — RW-2S

The architecture scales; the geometry does not. Rotor area is pinned to wheel
size (∝ L²) while mass grows ∝ L³, so disc loading rises linearly with scale.
At human scale the wheels therefore stop being the primary lift: RW-2S is a
**body-lift-dominant** vehicle in which two large fans buried in the hull carry
~75% of hover thrust and the four rotor-wheels carry the rest while providing
ground drive, hover yaw and cruise propulsion.

| Item | RW-2S |
|---|---|
| Crew | 2, side by side, under a bubble canopy |
| Length / width (hull) / width overall / height | 6.2 / 2.1 / **2.6** / 1.75 m |
| Flight footprint | 4.5 × 6.2 m |
| Rotor-wheels | 4 × Ø 0.82 m, 2 × Ø 0.66 m coaxial fans each |
| Hull lift fans | 2 × Ø 1.7 m, tandem, fore and aft of the cabin, vane boxes |
| Rear disc stagger | +0.5 m above front (0.75 D), rear pivots on pylons |
| GTOW | ~800 kg |
| Disc area / loading | 5.9 m² / ~135 kg/m² |
| Hover power | ≈ 300 kW electrical |
| Cruise | ~160 km/h at ≈ 120 kW; hull carries ~45% of weight |
| Power | turboshaft-electric hybrid: ~300 kW genset in the tail + 15 kWh battery |
| Fuel / air endurance | 80 kg Jet-A: ~1.3 h cruise (~200 km), or 10 min hover + ~1 h cruise |
| Silent electric mode | ~1.5 h driving at 30 km/h, or ~3 min emergency hover |
| Ground | 80 km/h max; ~4 h mixed on fuel |

### Mass budget (target, kg)

| Group | kg |
|---|---|
| Lifting-body hull, structure, canopy | 150 |
| Rotor-wheel modules, 4 × 28 | 112 |
| Hull lift fans, ducts, doors, vane boxes, 2 × 35 | 70 |
| Turboshaft + generator + power electronics | 120 |
| Battery, 15 kWh | 60 |
| Fuel | 80 |
| Crew and kit, 2 × 90 | 180 |
| Avionics, comms, payload | 25 |
| Wiring, thermal, misc | 28 |
| **GTOW** | **~825 → 800 target** |

### What changes at this scale

- **The doorway advantage is gone.** At 2.6 m wide the vehicle does not go
  inside buildings. The mission becomes rough-terrain mobility plus short-hop
  VTOL for a two-person team: where a helicopter cannot land and a truck cannot
  drive. Precedent: DARPA Transformer TX / Advanced Tactics Black Knight (2014).
- **Hover is turbine-fuelled, not battery-fuelled.** 300 kW for 10 minutes is
  50 kWh — 200 kg of cells. Fuel at 0.45 kg/kWh does it for ~22 kg. The battery's
  job is peak-shaving in hover, and the *silent electric ground mode* — turbine
  off, 1.5 h of quiet driving — which is the tactical feature worth having.
- **Packaging drives the length.** Two Ø 1.7 fans plus a 1.2 m cabin plus a
  turbine in the tail is 6.2 m. A single Ø 2.2 fan behind the cabin would be
  shorter but raises hover power ~8% and makes the aft fan even more mandatory.
- **Three times the power of an R22 for the same seats.** That is the price of
  keeping rotors in wheels. RW-2S is defensible only where the ground mode is
  doing most of the work.

## 12. Turbines at human scale

"Small turbines instead of the dual fans" splits into three very different
ideas, and only one of them is good.

| Option | What it is | Verdict |
|---|---|---|
| **A. Micro-turbojets in the wheels** | Replace each coaxial fan pair with a ~600 N turbojet (JetCat P550 class) | **Reject.** Turbojet thrust-specific fuel consumption is ~150 kg/kN·h: 8 kN of hover thrust burns ~10 kg of fuel per minute — jet-suit endurance, 5–8 min. Exhaust at 600 °C and ~400 m/s inside a tire kills the tire, the ground and anyone nearby. FOD ingestion becomes catastrophic at 100,000 rpm; every mud and debris problem in §8 becomes a blade-out. Thermal soak makes drive mode impossible after flight. And turbojets are propulsively inefficient below ~300 km/h — the wrong engine for a 160 km/h vehicle. |
| **B. Small turbofans as the body lift fans** | Gas-turbine core driving the Ø 1.7 hull fans mechanically | **Possible, second choice.** Efficient enough (high bypass), and the fans stay cold and mesh-protected. But a gearbox and shafting through the hull, two hot cores under the cabin, and no silent electric mode. Loses the redundancy of independent electric motors. |
| **C. Turboshaft generator, electric fans everywhere** | One turbine in the tail turning a generator; all fans and wheels stay electric | **Recommended.** Fuel energy density (12 kWh/kg, ~3.5 kWh/kg after a 30% turbine) is 14× battery, which is the single thing that makes a ~800 kg VTOL hover for more than a few minutes. The turbine sits protected in the tail with clean inlet air and a Kamm-tail exhaust. Every rotor stays electric: fine control, redundancy, mesh protection, and silent battery-only driving. Small turboshafts have poor specific fuel consumption (~0.45 kg/kWh), which is why fuel is 80 kg, but it is still one-tenth the mass of the equivalent battery. |

Rule of thumb: **turbines belong in the body as the power source, never in the
wheels as thrusters.** The whole point of the rotor-wheel is a fan you can drive
on; a turbine is a fan you cannot get near.

## 13. Renderings

Rendering set in [`renderings/`](renderings/):

| File | View |
|---|---|
| `01-side-elevation-drive.svg` | Side elevation, centerline section, drive mode |
| `02-plan-flight.svg` | Plan view, flight mode, discs deployed, lift fan open |
| `03-wheel-module-cutaway.svg` | Rotor-wheel module: face-on cutaway + axle section |
| `04-flight-modes.svg` | Drive / hover / cruise, side view, rear discs staggered |
| `05-two-seat-elevation.svg` | RW-2S two-seat variant, side elevation, section |
| `rw2s-3d.html` + `rw2s-viewer.js` | RW-2S interactive 3D model (three.js): drive / hover / cruise |
