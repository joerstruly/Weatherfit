# RW-5 "FERRET" — Rotorwheel Hybrid Ground–Air Vehicle

**Concept Specification, Rev D** · 2026-09-05 · Unarmed ISR / scout mobility platform

Rev D: identical wheel arms front and rear — the wake stagger comes from a
nose-down cruise attitude, not geometry (§3.1); RW-2S re-laid-out around four
large rotor-wheels with no hull fans (§11); turbine-in-the-wheel assessed and
rejected on matching, not just control, grounds (§12). Rev C had added the stagger, RW-2S and the
turbine analysis.

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
  110 km/h and +5° (C_L ≈ 0.7) the hull would carry ~26% of weight — but in
  Rev D the vehicle cruises 15° nose-down for wake clearance (§3.1), so the hull
  lifts only in level transition; in cruise it is a fairing that produces some
  downforce. Low aspect ratio means it never carries the whole vehicle either way.
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

### 3.1 Stagger by attitude, not by arms (Rev D)

In cruise the rear discs sit directly behind the front pair. Coplanar and
level, they would fly in the front discs' wake: ~10–15% thrust loss on the
rear pair plus vibration and noise. Rev C fixed this with raised rear pivots
and longer rear arms. Rev D drops that: **all four arms and pivots are
identical, and the whole vehicle cruises nose-down**, so the rear pair rides
higher in the airflow the way a multirotor's does.

Geometry: with the hull pitched θ nose-down the rear discs sit
wheelbase·sin θ higher than the front pair relative to the airflow, and the
front wake also descends ~0.2 m over the wheelbase under its own induced
velocity. Clearing the wake needs ~0.22 m; at **15° nose-down** the attitude
alone gives 720 mm × sin 15° = 0.19 m, and with the induced descent the wake
passes ~0.4 m under the rear discs. The discs pitch 45° relative to the hull,
which puts their thrust 60° to the air — the same as before.

What it costs — stated plainly, because it is not free: **a lifting body at
−15° is a brake.** The cambered hull that carried ~26% of the weight at +5°
now produces downforce (C_L ≈ −0.3, ~19% of weight added to the rotors' job)
and roughly triple the drag. Cruise power rises from ≈ 6.5 kW to ≈ 8.5 kW;
cruise endurance falls from ~17 to ~13 min and range from ~30 to ~24 km. The
hull still earns its shape at low speed and in transition (level, +5°), and
as the low-signature drive-mode body. If the wing matters more than the
simplicity, the alternative is to build the hull with +12° incidence relative
to the wheel plane so it flies at a useful angle while the chassis is
nose-down; that makes it sit nose-high on the ground and was not adopted.

Side effects to carry in the control law: a small pitch coupling from the
vertical offset between front and rear thrust lines during translation, and
the transition from level hover to 15° nose-down cruise itself (≈ 4 s, discs
pitching 0 → 45° as the hull rotates).

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

**Cruise.** At 110 km/h the tilted discs operate at high advance ratio where
rotor efficiency roughly doubles versus hover; the hull, at −15°, adds ~19%
downforce and drag. Estimated cruise power ≈ 8.5 kW (≈ 6.5 kW if flown level
with the hull lifting, at the cost of rear-disc wake ingestion).

| Metric | Value |
|---|---|
| Hover endurance (90% usable) | **≈ 9 min** |
| Cruise speed / endurance / range | **~110 km/h / ~13 min / ~24 km** (15° nose-down, rear discs in clean air) |
| Max dash | ~130 km/h |
| Ground speed, max / patrol | 45 / 20 km/h |
| Ground endurance @ 20 km/h | ≈ 3 h, ~50 km |
| Rolled step (Ø 400 wheels) | ≤ 130 mm; anything above is flown |
| Transition, drive → airborne | ≈ 3 s (flip 1.8 s, spool 1.2 s) |
| Transition, hover → cruise | ≈ 4 s, hull rotating to −15°, discs pitching 0 → 45° |
| Cruise attitude | 15° nose-down; discs 45° to hull, 60° to the air |
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

Rev D layout: **four large rotor-wheels carry all the lift; there are no fans
in the hull.** Wheel size is the free variable that makes this work — at
Ø 1.4 m the four coaxial Ø 1.2 m discs give 4.5 m², as much as Rev C's two
hull fans and four small wheels combined, in a hull 1.6 m shorter. The wheels
are ~30% of vehicle length, the same proportion as RW-5.

| Item | RW-2S (Rev D) |
|---|---|
| Crew | 2, side by side, under a bubble canopy |
| Length / hull width / overall width / height | 4.6 / 1.5 / **2.2** / 1.9 m |
| Flight footprint | 4.7 × 4.6 m |
| Rotor-wheels | 4 × Ø 1.4 m, 2 × Ø 1.2 m coaxial fans each, 0.36 m wide 3D-printed airless tire |
| Hull fans | none |
| Arms / pivots | identical front and rear; wake clearance from a 12° nose-down cruise |
| GTOW | ~830 kg |
| Disc area / loading | 4.5 m² / ~185 kg/m² |
| Hover power | ≈ 350 kW electrical |
| Cruise | ~150 km/h at ≈ 180 kW, 12° nose-down |
| Power | turboshaft-electric hybrid: ~350 kW genset + 80 kg fuel in the tail, 15 kWh battery in the nose |
| Air endurance | ~50 min cruise (~125 km), or 10 min hover + ~40 min cruise |
| Silent electric mode | ~1.5 h driving at 30 km/h, or ~2.5 min emergency hover |
| Ground | 80 km/h max; ~4 h mixed on fuel; 0.45 m clearance, rolls 0.45 m steps |

### Mass budget (target, kg)

| Group | kg |
|---|---|
| Hull, structure, canopy, outriggers | 120 |
| Rotor-wheel modules, 4 × 55 (tire 12, rim motor 12, two fan stages 22, mount 9) | 220 |
| Turboshaft + generator + power electronics | 120 |
| Battery, 15 kWh | 60 |
| Fuel | 80 |
| Crew and kit, 2 × 90 | 180 |
| Avionics, comms, payload | 25 |
| Wiring, thermal, misc | 25 |
| **GTOW** | **830** |

### What changes at this scale

- **Bigger wheels are the right call aerodynamically and on the ground.**
  Every centimetre of wheel diameter is disc area; Ø 1.4 also rolls 0.45 m
  steps and gives 0.45 m of clearance. The cost is module mass: 55 kg per
  corner, half the empty weight.
- **No hull fans means the hull is just a hull.** Cabin, turbine, fuel and
  battery pack into 4.6 m with room to spare; nothing under the cabin floor
  spins. It also removes the mandatory-fan failure case: lose one wheel
  stage and the other three-and-a-half discs still hover it.
- **The doorway advantage is gone** at 2.2 m wide; the mission is rough-terrain
  mobility plus short-hop VTOL for a two-person team.
- **Hover is turbine-fuelled.** 350 kW for 10 min is 58 kWh — 230 kg of cells
  or ~26 kg of Jet-A. The battery's job is peak-shaving and the silent electric
  ground mode.
- **It is still ~3.5× an R22's power for the same seats.** That is the price of
  rotors sized to wheels rather than wheels sized to rotors.

## 12. Turbines at human scale

The proposal is small gas turbines in the wheels — **turbofans, as on an
airliner, scaled down** — rather than electric fans. This section works the
matching problem, because the answer turns on it.

### 12.1 A turbofan is a gas core driving a ducted fan

That is the whole architecture: a combustion core extracts shaft power and
spins a ducted fan; on a high-bypass engine the fan makes 80–90% of the
thrust and the core exhaust is almost an afterthought. **The rotor-wheel
already has the ducted fan.** So "turbofan in the wheel" does not add a new
kind of thruster — it only moves the combustor from the tail into the wheel
and replaces the electric ring motor with a gas core. The question is
therefore narrow: what should spin the fan, and where should the fuel burn?

### 12.2 The matching problem

One RW-2S wheel must produce ~2.0 kN in hover. Two ways to make that thrust:

| | Specified rotor-wheel | Turbofan matched to 2.0 kN |
|---|---|---|
| Fan diameter | Ø 1.20 m (fills the Ø 1.4 m wheel) | **Ø 0.23 m** (BPR 8, FPR 1.4) |
| Disc area | 1.13 m² | 0.041 m² — **1/28 as much** |
| Disc loading | 180 kg/m² | ~5,000 kg/m² |
| Jet velocity | 54 m/s, ambient | 240 m/s, 300 °C+ |
| Ideal hover power | **55 kW** | **290 kW** |

Hover power goes as T^1.5/√(2ρA): thrust is fixed, so power scales with
1/√(disc area), and √28 ≈ 5.3. **The same lift costs 5× the power.** In fuel,
after the small core's ~22% thermal efficiency against the turboshaft's ~19%,
that is roughly **3–4× the burn** — call it 6–8 kg/min in hover against 2.6.

This is not an engineering detail that better design fixes. Propulsive
efficiency is 2/(1 + v_jet/v_flight); in hover v_flight = 0, so *every* jet is
at zero propulsive efficiency and the only remaining lever is to move a lot of
air slowly. A turbofan's entire design intent is the opposite — move less air
faster, because at 900 km/h that is efficient.

### 12.3 The bypass ratio proves the point

Turn it around: keep the Ø 1.2 m fan and ask what core would drive it. The fan
passes ~37 kg/s; a core making the required ~55 kW of shaft power passes about
0.3 kg/s. That is a **bypass ratio near 120.** Airliner turbofans run 5–12;
the GE9X is 10; open-rotor demonstrators reach 30–40 and are already
*geared turboshafts driving propellers*, not turbofans. Nothing at BPR 120 is
a turbofan. It is a turboshaft driving a fan — which is exactly the
recommended architecture (§12.5), differing only in where the combustor sits.

### 12.4 Core in the wheel vs. core in the tail

With the fan fixed, the remaining choice is mechanical drive in each wheel or
electric drive from one turbine in the tail.

**Honest points for the core in the wheel:** direct drive avoids the
generator–inverter–motor chain, worth ~8–10% of transmission loss; and on
mass it is close to a wash — one 350 kW turboshaft plus generator, inverters
and four motors is ~160 kg, four ~90 kW turboshafts plus four reduction
gearboxes is ~160 kg too.

**Against, in order of severity:**

1. **Throttle lag.** A gas turbine changes thrust in 1–2 s as its spool
   accelerates; an electric fan does it in ~50 ms. A four-rotor hover is held
   by continuous corrections at 10–50 Hz. Turbine-driven lift has *never* been
   controlled by throttling the turbine — the Harrier and F-35B use bleed-air
   reaction jets and fast vanes, helicopters use collective pitch on a
   constant-speed rotor. A turbine-in-wheel therefore needs variable-pitch
   coaxial fans on constant-speed cores: heavier, and more complex than the
   electric stages it was meant to replace.
2. **Fuel and hot gas across a two-axis tilt joint,** four times, on modules
   that are also wheels driving through mud. Electric modules need one cable.
3. **A combustor inside the wheel that lands.** Hot section, oil system and
   FOD path in the one component guaranteed to hit debris, water and mud.
4. **Four engines** to start, synchronise, and maintain, instead of one.
5. **No silent mode.** Battery-electric driving with the turbine shut down is
   the vehicle's best tactical feature; turbines in the wheels delete it.
6. **Thermal soak.** Drive mode immediately after flight puts a heat-soaked
   hot section next to the tire and the ground.

### 12.5 Conclusion — and where it does not apply

**Recommended: one turboshaft in the tail turning a generator; every fan stays
electric.** Fuel is ~14× battery per kilogram of stored energy, which is the
only reason an 830 kg VTOL can fly for more than a few minutes; the turbine
sits protected with clean inlet air; the rotors keep millisecond control,
redundancy, mesh protection, and a silent battery mode.

Cruise does not rescue the turbofan either. A turbofan wants
v_flight ≈ 0.5–0.7 × v_jet; at RW-2S's 150 km/h (42 m/s) the matched jet
velocity is 60–85 m/s — which describes a ducted fan, not a turbofan. There is
no point in this vehicle's envelope where a turbofan is the right device.

Two footnotes for completeness. Combustion *has* been put in the rotor before:
tip-jet rotorcraft (Fairey Rotodyne, Hughes XH-17) piped hot gas to the blade
tips, which eliminated reaction torque and the transmission entirely — and
were extraordinarily loud and thirsty, which is why none entered service. And
if the airframe were much larger and hover were a negligible fraction of the
mission, jet lift starts to pay; that is the F-35B, and it is not this
vehicle.

Rule of thumb: **turbines belong in the body as the power source, never in the
wheels as thrusters.**

## 13. Renderings

Rendering set in [`renderings/`](renderings/):

| File | View |
|---|---|
| `01-side-elevation-drive.svg` | Side elevation, centerline section, drive mode |
| `02-plan-flight.svg` | Plan view, flight mode, discs deployed, lift fan open |
| `03-wheel-module-cutaway.svg` | Rotor-wheel module: face-on cutaway + axle section |
| `04-flight-modes.svg` | Drive / hover / cruise, side view, 15° nose-down cruise |
| `05-two-seat-elevation.svg` | RW-2S two-seat variant, side elevation, section (four Ø 1.4 rotor-wheels, no hull fans) |
| `06-turbofan-scale.svg` | Wheel fan vs. a turbofan matched to the same thrust, true relative scale |
| `rw2s-3d.html` + `rw2s-viewer.js` | RW-2S interactive 3D model (three.js): drive / hover / cruise |
