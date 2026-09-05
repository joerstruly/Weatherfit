# RW-5 "FERRET" — Rotorwheel Hybrid Ground–Air Vehicle

**Concept Specification, Rev E** · 2026-09-05 · Unarmed ISR / scout mobility platform

Rev E re-derives the vehicle around a **point-to-point speed** design point
(§1.1): hover is a 30-second transition at each end, not a loiter mode. Three
consequences — the nose-down cruise attitude is withdrawn because the wake
problem was overstated (§3.1); fans become **variable-pitch**, without which
there is no cruise (§3.2); and **span**, not hull shape, is the dominant
cruise-power lever (§2.1). Rev D had made the arms identical and re-laid-out
RW-2S; Rev C added the stagger, RW-2S and the turbine analysis.

Rev B superseded Rev A: coaxial two-stage fans in smaller wheels, two-axis
tilt (flip + fore/aft pitch), lift fan embedded in the hull with a thrust-
vectoring vane box, and a delta lifting-body hull.

**Units:** US customary throughout — inches and feet, pounds and pounds-force,
mph, horsepower, lb/ft² of disc loading, lb/hp·h of specific fuel consumption.
Battery capacity stays in kWh, the industry convention. Analysis was performed
in SI and converted; figures are rounded to the precision the estimate supports.

---

## 1. Concept

A hybrid unmanned vehicle with four small road wheels, each carrying a pair of
contra-rotating ducted fans in its hubless center, and a fifth lift fan buried
in the rear of a wing-shaped hull. On the ground it is a skid-steered scout
narrow enough for doorways. To fly, the wheels flip outboard to horizontal;
once flat they can also pitch fore and aft, so the vehicle transitions from
hover into fast forward flight with the hull itself generating lift.

Design thesis: **A to B, fast.** This is not a hovering machine that also
travels; it is a travelling machine that can take off and land anywhere.
A quadcopter is built to hold station — this is built to depart, dash, and
arrive.

### 1.1 Design point — point-to-point speed

Hover is a **transition state of roughly 30 s at each end of a sortie**, not a
mission phase. That single statement reorders every trade in this document:

- **Hover sets installed power. Cruise sets energy.** Two different budgets,
  and they must not be confused. At RW-2S scale hover needs ~470 hp but only
  ~60 s per sortie — **5.8 kWh**, a third of the battery, and irrelevant as
  fuel. Meanwhile cruise runs 30–60 min and spends every pound of fuel
  aboard.
- **So disc loading barely matters as a fuel penalty**, and it is the reason
  earlier revisions of this document over-weighted it. What it still does,
  unavoidably, is size the powerplant: the vehicle carries a 470 hp
  installation to use ~295–429 hp in cruise. Every proposal must be judged on
  *installed power*, not on hover fuel burn (§12 revisits turbines on exactly
  this basis).
- **The cruise curve is the design.** Power required against airspeed, with
  the installed-power line drawn across it, sets top speed, best-range speed,
  and range in one picture — see the figure in §6.

### Mission profile (design case)

| Segment | Mode | Notes |
|---|---|---|
| Departure and arrival | Hover / transition | ~30 s each end · ~5.8 kWh at RW-2S scale |
| The mission itself | Cruise | 30–60 min, fuel-limited; the sizing case |
| Approach, dash, hide, interior work | Ground | quiet, endurance-limited, ~3 h |

## 2. Hull — delta lifting body

- **Planform:** F1-style narrow nose (6.3 in at the sensor tip) between the front
  wheels, widening in a straight delta to 17.3 in hull / **26.8 in overall** at the
  rear wheels. Blunt (Kamm) tail.
- **Section:** cambered thick airfoil front-to-back — low nose, maximum
  thickness (~7.9 in) ahead of mid-chord, tapering to a 2.8 in trailing edge.
  Chord 47.2 in.
- **Aerodynamics (calc.):** planform ≈ 2.7 ft², effective aspect ratio ~0.7. At
  68 mph and +5° (C_L ≈ 0.7) the hull would carry ~26% of weight — but in
  Rev D the vehicle cruises 15° nose-down for wake clearance (§3.1), so the hull
  lifts only in level transition; in cruise it is a fairing that produces some
  downforce. Low aspect ratio means it never carries the whole vehicle either way.
- **Ground role:** the same shape gives a low, sloped signature and a flat belly
  for skid landings; ground clearance 5.9 in.

### 2.1 Span, not shape, is the cruise-power lever (Rev E)

At speed the dominant cost is the **induced power of holding the vehicle up**:
P_i ≈ T²/(2ρAv). Anything that takes lift off the rotors cuts it as the square
of the thrust removed, so offloading onto a wing is the largest single lever in
the cruise budget — larger than drag cleanup, larger than rotor efficiency.

The catch is that a lifting body is a poor wing, and the arithmetic is
unforgiving. Worked at RW-2S scale, 1,830 lb at 109 mph:

| | Rotors carry everything | Lifting body, AR ≈ 0.7 | Deployable wing, AR ≈ 4 |
|---|---|---|---|
| Rotor thrust | 1,830 lbf | ~1,045 lbf | ~1,045 lbf |
| Rotor induced power | ~165 hp | ~54 hp | ~54 hp |
| Wing induced drag | — | ~306 lbf | ~47 lbf |
| Drag power | ~154 hp | ~266 hp | ~172 hp |
| **Total** | **~319 hp** | **~319 hp** | **~225 hp** |

**At aspect ratio 0.7 the lifting body is exactly break-even** — the induced
drag it creates carrying the load costs precisely what the rotors saved. The
hull shape earns its keep for low-speed transition, ground signature and
packaging, but as a *wing* at cruise it is doing nothing. Only span changes
the answer: at AR 4 the same lift costs a seventh of the induced drag, and
cruise power drops ~30%.

**Recommendation for the speed variant:** a 13 ft deployable wing that folds to
the 7.2 ft driving width. It moves RW-2S from 122 to 141 mph top speed and
from ~62 to ~88 mi of range on the same 176 lb of fuel (§6). It is the single
highest-value addition on the roadmap, and it is not adopted into the baseline
here only because folding structure at that span is its own engineering
programme.

## 3. Rotor-wheel module (×4)

Hubless Ø 15.7 in wheel; the open center holds two contra-rotating fans.

From outside in:

1. **Airless shear-band tire** — Ø 15.7 in, 5.1 in wide, non-pneumatic.
2. **Rim drive ring motor** — in-rim stator, direct drive, 1.6 hp continuous.
3. **Structural hubless rim** — doubles as the duct wall (3.9 in deep).
4. **Two tip-drive fan rings** — one per stage, independent.
5. **Two 7-blade fan stages, Ø 12.6 in, contra-rotating** — stage spacing 2.2 in.
6. **Debris mesh**, both faces (~5% thrust penalty, rejects objects over 5/16 in).
7. **Static hub** — no shaft through the center; nav light and sonar.
8. **Two-axis mount:** *flip* 95° about the fore-aft axis (wheel vertical →
   horizontal outboard), then *pitch* −20° to +70° about the lateral axis.
   Both axes have mechanical endpoint locks.

### Why coaxial

- **Torque-neutral per wheel.** The two stages cancel reaction torque, so no
  CW/CCW pairing across the vehicle and no yaw upset when one wheel fails.
- **~35% more thrust from the same Ø 12.6 in disc** than a single stage (at roughly
  1.7× the power). This is what lets the wheel shrink from Ø 20.5 in to Ø 15.7 in.
- **Graceful degradation:** one dead stage leaves ~60% of that wheel's thrust.
- Cost: ~10% worse figure of merit than a single rotor of the same disc area,
  and a second motor, mesh, and controller per wheel.

### 3.1 The wake problem, corrected (Rev E)

Revisions C and D both treated the rear discs flying in the front discs' wake
as a first-order problem — C raised the rear pivots, D pitched the whole
vehicle 15° nose-down. **Reworked, the concern was overstated, and both fixes
are withdrawn.**

The wake does not hang in place; it is driven down at roughly twice the disc's
induced velocity while it drifts aft at flight speed. Descent over the
wheelbase is therefore 2·v_i·(wheelbase / v_flight). At RW-2S cruise
(v_i ≈ 49 ft/s, wheelbase 9.2 ft, 109 mph) that is **~5.6 ft** — against a rear
disc of 2 ft radius, the wake passes far beneath. The margin only closes above
about 155 mph, beyond this airframe's top speed. Slower flight makes it
*better*, not worse: the induced velocity rises and the wake has longer to fall.

Two things follow:

1. **Arms and pivots stay identical, and the vehicle no longer cruises
   nose-down.** The hull flies at whatever attitude the wing wants — level to
   +5° — which is the attitude that lets it contribute lift at all (§2.1). The
   nose-down attitude cost ~3 hp at RW-5 scale and roughly a third of RW-2S's
   cruise efficiency, and bought nothing.
2. **RW-5 is the tighter case** — 28.3 in wheelbase, Ø 12.6 in discs — and still
   clears: ~16–28 in of descent against a 6.3 in disc radius. Fine at cruise.

What remains real is **transition**, at 12–37 mph, where the wake is skewed
but not yet swept clear and the rear discs see unsteady inflow. That is a
control-authority and structural-fatigue item for the conversion corridor
(§3.3), not a reason to reshape the vehicle.

### 3.2 Variable pitch is mandatory (Rev E)

Fixed-pitch fans were adequate while flight meant short hops. For a vehicle
whose job is cruise, they are disqualifying, and this is the most consequential
change in Rev E.

A blade set for hover sees an inflow angle of about 11° at 75% radius
(89 ft/s induced against ~443 ft/s blade speed). In cruise the axial inflow rises
to ~151 ft/s and the same blade sees about **19°**. Fixed pitch therefore arrives
at cruise at *negative* incidence: the fan makes drag, not thrust. Raising rpm
to compensate demands ~755 ft/s tip speed — loud, transonic-adjacent, and it
raises thrust when the vehicle needs less.

**Both coaxial stages get collective pitch control**, roughly 12–30° at 75%
radius. The costs are honest: a pitch mechanism inside a hubless rim is the
hardest packaging problem in the module, and it adds ~15% to module mass.
What it buys, besides cruise existing at all: constant-rpm operation, so
thrust responds through blade angle in ~30 ms rather than through rotor
inertia; autorotation-like windmilling on a failed drive; and a genuine
feathered position for the drive mode.

*Interaction worth noting:* variable pitch on constant-speed rotors is exactly
what a turbine-driven wheel would have needed (§12.4). Adding it for cruise
reasons removes one — but only one — of the objections to that architecture.

### 3.3 Control — where this beats a quadcopter

The reason this layout suits point-to-point work is not efficiency; it is that
**it can vector thrust without changing attitude.** A quadcopter must pitch the
whole airframe to accelerate or brake, which costs time, couples into lift, and
points its sensors at the ground. Four two-axis mounts let this vehicle:

- **Accelerate and decelerate at constant attitude** — pitch the discs, keep
  the hull, the crew and the sensor line level. Hard braking on arrival does
  not require a nose-up flare.
- **Yaw without reaction torque.** Coaxial stages are torque-neutral, so yaw
  comes from differential fore/aft disc pitch — direct, and decoupled from
  thrust.
- **Decouple gust rejection from trim.** Attitude holds while the discs absorb
  disturbance, which is worth more at 109 mph than at a hover.

The corresponding risk is the **conversion corridor**: between ~40 and
~68 mph the discs are partly edgewise, the ducts produce a nose-up pitching
moment as the lip loads asymmetrically, and the hull is not yet at useful
dynamic pressure. Ducted fans are notably worse than open rotors here — it is
what limited the Bell X-22 and Doak VZ-4. The corridor must be flown quickly
and mapped early: it is the first flight-test objective after tethered hover,
ahead of any speed record.

### Why two-axis tilt

Coaxial units produce no reaction torque, so yaw *must* come from vectoring.
Differential fore/aft pitch (left discs forward, right discs back) provides yaw
in hover; symmetric forward pitch provides cruise propulsion. Pitch authority
also trims the lifting body across the speed range.

## 4. Embedded lift fan + vane box

- **Fan:** Ø 15.0 in, 7 blades, fixed vertical in the rear hull at ~62% chord,
  between the rear wheels. Top inlet with two doors (closed in drive mode — the
  wing surface stays clean and the fan protected).
- **Vane box:** a cascade of pivoting vanes under the fan deflects the exhaust
  from straight down to **50° aft**. This is how the rear fan "tilts forward":
  the fan does not move; its thrust does. Precedent: the F-35B lift-fan vane box.
- **Roles:** ~25% of hover thrust and direct pitch trim at liftoff; forward
  thrust in transition; unloads toward pure propulsion in cruise.
- **Why not physically tilt the fan:** a Ø 15 in fan tilting inside an 8 in thick
  hull needs a cutout that removes most of the rear planform and the wing's
  upper surface. Vanes cost ~4% thrust and zero structure.

## 5. Dimensions & masses

| Item | Value |
|---|---|
| Length / width / height, drive mode | 47.2 / **26.8** / 18.1 in |
| Nose width at sensor | 6.3 in |
| Flight footprint (discs deployed) | 59.4 × 47.2 in |
| Wheel Ø / tire width | 15.7 / 5.1 in |
| Wheel fans | 4 × (2 × Ø 12.6 in, coaxial) |
| Embedded lift fan | 1 × Ø 15.0 in |
| Ground clearance | 5.9 in |
| Gross takeoff weight (GTOW) | 84 lb |
| Payload (EO/IR + radio fit), in GTOW | 6.6 lb |

### Weight budget (target, lb)

| Group | lb |
|---|---|
| Lifting-body hull / structure | 17.6 |
| Rotor-wheel modules, 4 × 7.9 | 31.7 |
| Lift fan + inlet doors + vane box | 6.6 |
| Battery (2.0 kWh Li-ion, 113 Wh/lb) | 8.0 |
| Avionics, comms, ISR payload | 6.6 |
| Wiring, thermal, misc | 3.5 |
| **GTOW** | **83.6** |

## 6. Performance (calculated, ISA sea level)

**Hover.** Disc area = 4·π(0.525 ft)² + π(0.623 ft)² = **4.68 ft²**. Disc loading =
**17.8 lb/ft²** (Rev A: 64 — smaller wheels made hover worse). Ideal hover power
= T^1.5/√(2ρA) ≈ 9.4 hp; coaxial figure of merit 0.60 with mesh → **≈ 15.6 hp**
electrical.

**Cruise.** Flown level with variable-pitch fans, estimated cruise power
≈ 8.7 hp at 68 mph. Note the disc attitude: thrust must balance 84 lbf of
weight against ~10 lbf of drag, so the discs sit only **~13° from horizontal** —
they are lifting rotors with a slight forward tilt, not propellers. Earlier
revisions quoted 45–60°, which would be correct only if drag were comparable
to weight.

| Metric | Value |
|---|---|
| Hover endurance (90% usable) | **≈ 9 min** |
| Cruise speed / endurance / range | **~68 mph / ~17 min / ~19 mi** (level, variable pitch) |
| Max dash (drag-limited, not power-limited) | ~93 mph |
| Ground speed, max / patrol | 28 / 12 mph |
| Ground endurance @ 12 mph | ≈ 3 h, ~31 mi |
| Rolled step (Ø 15.7 in wheels) | ≤ 5.1 in; anything above is flown |
| Transition, drive → airborne | ≈ 3 s (flip 1.8 s, spool 1.2 s) |
| Transition, hover → cruise | ≈ 5 s through the conversion corridor (§3.3) |
| Cruise attitude | level to +5°; discs 13–22° from horizontal (lift dominates drag) |
| Acoustic (hover) | ~88–92 dBA @ 33 ft est.; quiet only on wheels |

## 7. Subsystems

- **Autonomy/nav:** GNSS + visual-inertial odometry; lidar ring for doorway
  centering; operator-in-the-loop for flight in Gen-1.
- **Comms:** 2 W MANET mesh; fiber-spool option for RF-silent interior work.
- **Payload:** nose EO/IR sensor (drive) + stowable-mast gimbal; two powered
  accessory rails.
- **Power:** hot-swap battery cassette forward of the lift fan; 100 V bus for
  13 motors (4 rim, 8 fan stages, 1 lift fan) and 9 actuators (8 tilt, 1 vane box).

## 8. The hard problems (honest assessment)

**8.1 Disc loading is an installed-power problem, not a fuel problem.**
Under the Rev E design point (§1.1) hover lasts ~60 s per sortie, so the
hover-fuel penalty that dominated Revs A–D is close to irrelevant. What
survives is that hover still sizes the powerplant — and that penalty is
permanent, carried as engine and cooling mass through every minute of cruise.
Judge every propulsion proposal on installed horsepower.

**8.1a Historical note.** Smaller wheels cut disc area
by a third; coaxial stages recover the thrust but not the efficiency, so hover
now costs 15.6 hp for 84 lb. The lifting body and pitching discs are the
counterweight: cruise at ~8.7 hp. Net: hover is a 9-minute transition budget;
useful flight is forward flight. Do not design missions around hovering.

**8.2 Complexity is now the dominant risk.** 13 motors, 9 actuators, 8 mesh
faces, 4 two-axis mounts. Each rotor-wheel is a small tilt-rotor nacelle that
also has to survive being a wheel. Mitigation: module-level replaceability
(one connector, four bolts), drive mode fully functional with any flight
subsystem dead, land-and-drive as the universal abort.

**8.3 Low-aspect-ratio lifting body.** AR ~0.7 gives a shallow lift slope and
heavy induced drag; it will not glide. The hull earns its keep only above
~56 mph. Below that it is a fairing, and at hover it is a flat plate in the
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
| Cruise speed / efficiency | ~68 mph, lifting body + tilted discs | Slow, rotors drag the cage |
| Hover efficiency | Poor (17.8 lb/ft²) | Good |
| Ground endurance | ~3 h powered wheels | Low; rotors turn to roll |
| Ground signature | Quiet, low profile | Rotors always audible |
| Mechanical complexity | High | Low |
| Doorways | 26.8 in drive mode | Cage ≥ rotor span |

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
Ø 55 in the four coaxial Ø 47 in discs give 48.7 ft², as much as Rev C's two
hull fans and four small wheels combined, in a hull 5 ft shorter. The wheels
are ~30% of vehicle length, the same proportion as RW-5.

| Item | RW-2S (Rev D) |
|---|---|
| Crew | 2, side by side, under a bubble canopy |
| Length / hull width / overall width / height | 15.1 / 4.9 / **7.2** / 6.2 ft |
| Flight footprint | 15.4 × 15.1 ft |
| Rotor-wheels | 4 × Ø 55 in, 2 × Ø 47 in coaxial fans each, 14 in wide 3D-printed airless tire |
| Hull fans | none |
| Arms / pivots | identical front and rear; wake clearance from a 12° nose-down cruise |
| GTOW | ~1,830 lb |
| Disc area / loading | 48.7 ft² / ~37.9 lb/ft² |
| Hover power | ≈ 470 hp electrical |
| Cruise | ~93 mph at ≈ 241 hp, level |
| Power | turboshaft-electric hybrid: ~470 hp genset + 176 lb fuel in the tail, 15 kWh battery in the nose |
| Air endurance | ~50 min cruise (~78 mi), or 10 min hover + ~40 min cruise |
| Silent electric mode | ~1.5 h driving at 19 mph, or ~2.5 min emergency hover |
| Ground | 50 mph max; ~4 h mixed on fuel; 18 in clearance, rolls 18 in steps |

### Weight budget (target, lb)

| Group | lb |
|---|---|
| Hull, structure, canopy, outriggers | 265 |
| Rotor-wheel modules, 4 × 121 (tire 26, rim motor 26, two fan stages 49, mount 20) | 485 |
| Turboshaft + generator + power electronics | 265 |
| Battery, 15 kWh | 132 |
| Fuel (26 gal Jet-A) | 176 |
| Crew and kit, 2 × 198 | 397 |
| Avionics, comms, payload | 55 |
| Wiring, thermal, misc | 55 |
| **GTOW** | **1,830** |

### What changes at this scale

- **Bigger wheels are the right call aerodynamically and on the ground.**
  Every inch of wheel diameter is disc area; Ø 55 in also rolls 18 in
  steps and gives 18 in of clearance. The cost is module mass: 121 lb per
  corner, half the empty weight.
- **No hull fans means the hull is just a hull.** Cabin, turbine, fuel and
  battery pack into 15.1 ft with room to spare; nothing under the cabin floor
  spins. It also removes the mandatory-fan failure case: lose one wheel
  stage and the other three-and-a-half discs still hover it.
- **The doorway advantage is gone** at 7.2 ft wide; the mission is rough-terrain
  mobility plus short-hop VTOL for a two-person team.
- **Hover is turbine-fuelled.** 470 hp for 10 min is 58 kWh — 507 lb of cells
  or ~57 lb (8.5 gal) of Jet-A. The battery's job is peak-shaving and the silent electric
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

One RW-2S wheel must produce ~450 lbf of thrust in hover. Two ways to make that thrust:

| | Specified rotor-wheel | Turbofan matched to 450 lbf |
|---|---|---|
| Fan diameter | Ø 47 in (fills the Ø 55 in wheel) | **Ø 9.1 in** (BPR 8, FPR 1.4) |
| Disc area | 12.2 ft² | 0.44 ft² — **1/28 as much** |
| Disc loading | 36.8 lb/ft² | ~1,024 lb/ft² |
| Jet velocity | 121 mph, ambient | 537 mph, 570 °F+ |
| Ideal hover power | **74 hp** | **389 hp** |

Hover power goes as T^1.5/√(2ρA): thrust is fixed, so power scales with
1/√(disc area), and √28 ≈ 5.3. **The same lift costs 5× the power.** In fuel,
after the small core's ~22% thermal efficiency against the turboshaft's ~19%,
that is roughly **3–4× the burn** — call it 13–18 lb/min in hover against 5.7.

This is not an engineering detail that better design fixes. Propulsive
efficiency is 2/(1 + v_jet/v_flight); in hover v_flight = 0, so *every* jet is
at zero propulsive efficiency and the only remaining lever is to move a lot of
air slowly. A turbofan's entire design intent is the opposite — move less air
faster, because at 560 mph that is efficient.

### 12.3 The bypass ratio proves the point

Turn it around: keep the Ø 47 in fan and ask what core would drive it. The fan
passes ~82 lb/s; a core making the required ~74 hp of shaft power passes about
0.66 lb/s. That is a **bypass ratio near 120.** Airliner turbofans run 5–12;
the GE9X is 10; open-rotor demonstrators reach 30–40 and are already
*geared turboshafts driving propellers*, not turbofans. Nothing at BPR 120 is
a turbofan. It is a turboshaft driving a fan — which is exactly the
recommended architecture (§12.5), differing only in where the combustor sits.

### 12.4 Core in the wheel vs. core in the tail

With the fan fixed, the remaining choice is mechanical drive in each wheel or
electric drive from one turbine in the tail.

**Honest points for the core in the wheel:** direct drive avoids the
generator–inverter–motor chain, worth ~8–10% of transmission loss; and on
mass it is close to a wash — one 470 hp turboshaft plus generator, inverters
and four motors is ~353 lb, four ~120 hp turboshafts plus four reduction
gearboxes is ~353 lb too.

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

### 12.5 Re-tested against the speed design point (Rev E)

The hover-fuel case against turbines in the wheels (§12.2) largely dissolves
under §1.1: if hover lasts 60 s, burning 3–4× the fuel during it costs ~44 lb,
not a mission. So the honest question becomes whether a turbofan wins on
*cruise*, and whether the installed-power penalty is affordable.

It is not, and installed power is why. Five times the hover power means
**~2,350 hp installed** to hover an 1,830 lb vehicle — against ~335–429 hp
actually used in cruise. The vehicle would carry 2,000-plus horsepower of
engine, and its mass, and its cooling, through every minute of the mission in
order to use a fifth of it. The turboshaft-electric layout installs 470 hp and
cruises on 295–429 hp: the same powerplant does both jobs.

The one objection Rev E does retract is throttle lag. §3.2 adds variable-pitch
fans for cruise reasons anyway, and variable pitch on a constant-speed core is
precisely how turbine-driven lift has always been controlled. That removes
objection 1 of §12.4 — but leaves fuel and hot gas across four two-axis tilt
joints, four engines, a combustor inside a landing wheel, no silent mode, and
the installed-power penalty above.

### 12.6 Conclusion — and where it does not apply

**Recommended: one turboshaft in the tail turning a generator; every fan stays
electric.** Fuel is ~14× battery per pound of stored energy, which is the
only reason an 1,830 lb VTOL can fly for more than a few minutes; the turbine
sits protected with clean inlet air; the rotors keep millisecond control,
redundancy, mesh protection, and a silent battery mode.

Cruise does not rescue the turbofan either. A turbofan wants
v_flight ≈ 0.5–0.7 × v_jet; at RW-2S's 93 mph (137 ft/s) the matched jet
velocity is 134–190 mph — which describes a ducted fan, not a turbofan. There is
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
| `05-two-seat-elevation.svg` | RW-2S two-seat variant, side elevation, section (four Ø 55 in rotor-wheels, no hull fans) |
| `06-turbofan-scale.svg` | Wheel fan vs. a turbofan matched to the same thrust, true relative scale |
| `07-power-curve.svg` | RW-2S power required vs airspeed, with the installed-power line |
| `rw2s-3d.html` + `rw2s-viewer.js` | RW-2S interactive 3D model (three.js): drive / hover / cruise |
