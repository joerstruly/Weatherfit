# TW-2 "FERRET"

**Turbine-Wheel Hybrid Ground–Air Vehicle · Industrial Design Specification, Rev F**
2026-10-14 · Two-seat unarmed scout mobility platform

**Units:** US customary throughout — inches and feet, pounds and pounds-force,
mph, horsepower, lb/ft² of disc loading, lb/hp·h of fuel consumption. Battery
capacity in kWh. Analysis performed in SI and converted; figures are rounded to
the precision the estimate supports.

> **Rev F is an architecture change, not an edit.** The electric rotor-wheel of
> Revs A–E is replaced by a **turbine-wheel**: a gas-generator core lives in the
> hub of each wheel and drives the fan directly. The hull lift fan is deleted.
> The wheels gain a second degree of freedom — they *slide* outboard as well as
> rotate. And the takeoff is no longer a tilt; it is a four-beat transformation
> that is now the signature of the product.

---

## 1. The product

A two-seat machine that drives like a wide, low buggy and takes off from where
it is parked. It is not a helicopter with wheels and not a car that flies. It is
**a ground vehicle whose wheels are its engines**, and the moment that defines
it is the six seconds in which those wheels stop being wheels.

| | |
|---|---|
| **For** | two-person teams who need to cross ground that has no road and no landing site |
| **Replaces** | the choice between a vehicle that can't leave the ground and an aircraft that can't stay on it |
| **Signature** | four 60-inch turbine-wheels that roll, then roll *over*, slide out, and lift |
| **Refuses to be** | a hovering machine. It departs, dashes, and arrives. |

## 2. Design principles

These five decide every argument that follows.

1. **The wheel is the product.** Everything else — hull, canopy, tail — is
   service volume between four identical modules. If a feature does not serve
   the module or the people, it is deleted.
2. **Tilt is the throttle.** The cores run at constant speed. Lift is commanded
   by *rotating* thrust, not by fuelling it. This is what makes a turbine
   viable in a machine that must hover (§5.1).
3. **Narrow on the road, wide in the air.** The vehicle is 92 inches across to
   drive and 136 across to fly. The transformation earns both.
4. **Spool before you need it.** Nothing time-critical happens to the engines
   during takeoff. They are already running, already hot, already stable.
5. **Show the state.** A bystander 50 feet away should read what the machine is
   about to do from its posture alone. Orange marks everything that moves or
   gets hot.

## 3. Form & stance

**Proportion.** Wheel diameter is 60 inches on a 198-inch vehicle — **30% of
overall length**, roughly double a truck's. The wheels stand level with the
roof. This is the whole visual argument: the machine reads as four engines with
a body slung between them, because that is what it is.

**Silhouette.** A long low prow between the front wheels, a faired two-place
canopy at mid-chord, a blunt Kamm tail carrying fuel. Height is 72 inches to the
canopy crown and 16 inches at the belly, which puts the sill at hip height — you
step over it, you don't climb in.

**The shoulder line** is not styling. It is the **slide-rail housing**, a
structural extrusion running the length of the body that carries the modules
outboard. Giving the strongest horizontal line in the design a job is the
central form decision: the thing that looks like a feature line is the thing
that moves the wheels.

**The flank** is a working surface. Between the wheels each side is sculpted
into a **reaction channel** — a shaped duct that catches the inboard fan flow
while the wheels are still vertical and turns it aft. A spooled turbine on the
ground therefore pushes the vehicle forward instead of blowing dust sideways.
The body sides do aerodynamic work, which is why they are shaped and not skinned.

**Stance.** Wide track, long wheelbase, belly low between big wheels, nose
raked down. At rest it should look like it is already leaning into something.

## 4. The transformation

The hero interaction. Four beats, about six seconds from spooled to airborne.

| Beat | What moves | What happens |
|---|---|---|
| **01 · SPOOL** | nothing | Cores start and stabilise at flight idle with the wheels still vertical. ~20 s. Thrust runs inboard into the flank channels and turns aft — ground thrust, zero lift. Lateral components cancel across the vehicle. |
| **02 · ROLL-IN** | roll collars, 0 → 38° | Each wheel's top tips *inboard*. The thrust vector swings from horizontal toward down-and-inboard; vertical component builds as sin θ. The suspension unloads to ~62% of static. Still on the ground. |
| **03 · SLIDE-OUT** | slide rails, 0 → 22 in | Modules translate outboard. This clears the disc from the hull *before* it can go flat, and widens the track from 92 to 136 inches. ~1.5 s. |
| **04 · ROLL-OUT** | roll collars, 38 → 95° | Rotation completes. Discs flat, inflow clean, thrust fully vertical. The vehicle leaves the ground. |

**Why this order and not another.** The disc is 52 inches across and the hull is
60 wide. A wheel rotated flat at its drive-mode track would overlap the hull by
10 inches on each side — blowing on the body, losing thrust and ingesting its
own recirculation. The slide is not drama; it is the only way to be narrow
standing still and wide in the air. And it must happen *between* the two
rotations: roll in first to unload the tires, slide while partly unloaded, then
finish the roll in clear air.

**Landing reverses it**: settle wide on the discs, roll in to 38° to unload,
slide in, roll down to vertical onto the tires.

**What the operator does.** One two-stage detented lever, not a button. Stage
one arms and spools. Stage two commits the transformation, which then runs
closed-loop; there is no partial state the vehicle will sit in. In flight the
same lever becomes the primary control: it commands **tilt angle**, and the
pilot can watch the wheels answer it. The control surface of this vehicle is
visible from outside.

**Sound.** The cores never change speed, so the transformation has no rev. The
note stays constant and the *direction* changes — a swell, not a climb. A
vehicle that sounds the same taking off as it does idling is unusual, and worth
protecting in detail design.

## 5. The turbine-wheel module

Four identical modules. **One part number**, mounted mirrored left and right, so
the fans counter-rotate side to side and reaction torques cancel.

From the outside in:

1. **Printed airless tire ring** — Ø 60 × 16 in, TPU lattice, crush-recoverable,
   no pressure to lose.
2. **Rim drive motor** — in-rim stator for ground running, silent creep, and a
   60-second emergency lift boost (§11).
3. **Structural rim = duct wall** — the rim *is* the duct; there is no separate
   nacelle.
4. **Variable-pitch fan** — Ø 52 in, 12 blades, 12–30° collective at 75% radius.
5. **Reduction gearbox** at the hub, ~15:1, turbine shaft to 2,900 rpm fan.
6. **Gas generator core** — ~195 hp, protruding outboard of the rim behind a
   faired spinner, with its own inlet. Its exhaust discharges through the hub
   centrebody into the fan stream, so hot gas always leaves sheathed in cool air.
7. **Debris mesh**, both faces.
8. **Two-axis mount** — roll collar 0–95°, slide rail 0–22 in outboard.

**Bypass ratio ≈ 100.** The fan passes ~82 lb/s; the core passes ~0.7. That is
not a turbofan, it is a turboshaft driving a very large, very slow fan — and
that is exactly right, because hover power scales as 1/√(disc area). A
conventional turbofan matched to the same 675 lbf would need a 10.8-inch fan,
1/23 the disc area and **four times the power**. The core is small and buried
*because* the fan must be big.

### 5.1 Why the turbine works here, when it didn't before

Earlier revisions rejected turbines on **throttle lag**: a gas turbine changes
thrust in 1–2 seconds, and a four-rotor hover needs corrections at 10–50 Hz.
The architecture answers it twice over:

- **Spool before commitment.** The cores reach stable flight idle while the
  vehicle is still standing on its tires, pointing their thrust somewhere
  harmless. Nothing has to accelerate on demand.
- **Vector, don't fuel.** Lift magnitude is commanded by roll angle and blade
  pitch — both fast, mechanical, and precise. Variable pitch responds in ~30 ms.
  Constant-speed core plus variable pitch is how every turbine-lift aircraft has
  ever been controlled.

The throttle-lag objection is withdrawn. The objections that survive are mass,
four engines, and engine-out (§11) — and those are real.

### 5.2 Deleting the hull fan

**Deleted.** With the lift fan gone, each wheel carries 675 lbf instead of 560,
which is within the same module. In exchange: the centreline is freed for crew,
fuel and battery; the "mandatory fan" failure case disappears; the hull becomes
a pure structure with nothing spinning under the floor; and the vehicle gets
1.6 feet shorter. There was no argument for keeping it.

## 6. CMF

| Element | Material | Finish | Why |
|---|---|---|---|
| Module structure, rim, collar | forged 7075, milled | bead-blast, clear anodise | the mechanism is shown, not hidden |
| Hull | compression-moulded carbon | matte PU, desaturated olive-grey | low sheen reads as equipment, not vehicle |
| Tire ring | TPU lattice, printed | as-printed, matte black | the print texture is the texture |
| Duct interior, hot zone | ceramic-coated Inconel → anodised alu | satin graphite | thermal gradient made visible |
| Spinner fairing | investment-cast titanium | shot-peen | the one jewel-grade part; it is the engine's face |
| Canopy | polycarbonate | gradient top band | glare control without tint at eye level |
| Moving / hot interfaces | — | **safety orange** | roll collars, rail travel, exhaust path |
| Hot-section band | thermochromic paint | changes above 200 °F | you can see whether it is safe to touch |

Orange is reserved. It marks only what rotates, translates, or burns. On a
machine whose state is its posture, the accent is a safety system.

## 7. Human factors

- **Ingress** over a 16-inch sill, stepping on the rail housing — a deliberate
  foothold, flat and gritted, not an accident of packaging.
- **Seating** side by side, 28-inch hip spacing, reclined 18° for a low canopy.
- **Primary control**: the tilt lever (§4). Secondary: pedals for yaw via
  differential fore/aft disc pitch.
- **Sight lines**: the nose drops away between the front wheels, so the ground
  is visible 12 feet ahead — set by the landing case, not the driving case.
- **Hot-surface discipline**: the spinner and exhaust path are the only
  touch-hazard zones and both are outboard, orange, and thermochromic.
- **Noise**: ~95–100 dBA at 50 ft in hover. Crew on intercom and ANR; the
  vehicle is not quiet and the doctrine is the mitigation — fly briefly, land
  out of sight, approach on wheels and on battery.

## 8. Package & systems

| Volume | Contents |
|---|---|
| Nose | sensor, avionics, nose gear-free crush structure |
| Mid | two-place cabin, battery under floor |
| Flanks | reaction channels, slide-rail housings, fuel transfer |
| Tail | 52 gal Jet-A, oil, accessory drive |
| Corners | four turbine-wheel modules |

- **Fuel**: 52 gal (350 lb) Jet-A in a crash-resistant tail cell, gravity-free
  transfer to four module feeds through the roll collar on a swivel joint.
- **Battery**: 8 kWh, 90 lb — core start, avionics, silent creep (~43 min at
  low speed), and emergency lift boost.
- **Electrical**: 400 V DC for the rim motors; no high-voltage flight bus,
  because the flight power never becomes electricity.

## 9. Dimensions & weights

| | |
|---|---|
| Length / width (drive) / height | 198 / **92** / 72 in |
| Width, flight (track / disc span) | 136 / 188 in |
| Wheelbase · ground clearance | 120 · 16 in |
| Wheel / fan / tire width | Ø 60 / Ø 52 / 16 in |
| Gross takeoff weight | **2,700 lb** |
| Installed power | **780 hp** (4 × 195) |
| Disc area / loading | 59 ft² / 45.8 lb/ft² |

### Weight budget (target, lb)

| Group | lb |
|---|---|
| Turbine-wheel modules, 4 × 341 | 1,364 |
| — core 110 · gearbox 30 · fan 34 · duct/rim 38 · tire 28 · rim motor 24 · roll 28 · slide 33 · plumbing 16 | |
| Hull, structure, rails, canopy | 340 |
| Crew and kit, 2 × 200 | 400 |
| Fuel, 52 gal Jet-A | 350 |
| Battery, 8 kWh | 90 |
| Avionics, controls, systems | 60 |
| Fluids, wiring, misc | 96 |
| **Gross takeoff weight** | **2,700** |

The modules are **half the vehicle**. That is the defining consequence of
putting engines in the wheels, and §10 prices it.

## 10. Performance

| | |
|---|---|
| Hover power / burn | 780 hp · 8.4 lb/min |
| Transformation fuel (60 s) | **8 lb** |
| Best-range cruise | **140 mph · 106 mi** on 350 lb |
| Top speed | **152 mph**, drag-limited |
| With 16 ft deployable span | 125 mph · **173 mi**; top 172 mph |
| Ground | 50 mph · ~4 h on fuel · rolls 18 in steps |
| Silent electric creep | ~43 min |
| Spool / transform | ~20 s / ~6 s |

**Hover sets installed power; cruise sets fuel.** Hovering 60 seconds costs
8 pounds of Jet-A — nothing. What hover costs is the 780 hp installation carried
through every minute of cruise. Judge changes on installed horsepower.

**The vehicle is drag-limited, not power-limited.** Four 52-inch ducts in the
airstream dominate: unfaired, top speed falls to ~130 mph; faired, 152. Duct
fairing is worth more than any engine change on the table, and it is cheap.

## 11. What it costs — and the one unsolved problem

**Mass.** Turbine-in-wheel makes the vehicle roughly 50% heavier than the
electric equivalent at the same mission (2,700 lb against ~1,830). Four cores
and four gearboxes weigh more than one core, a generator and four motors, and
the wheel must carry its own hot section, oil and fuel line. Bought with that
mass: no high-voltage flight bus, no generator chain and its 8–10% loss, fuel
energy at the thrust source, and the spool-before-commitment behaviour that
makes the whole architecture work.

**Four engines** to start, synchronise, maintain and overhaul, with fuel and
hot gas crossing two moving joints per corner.

**Engine-out in hover is the open problem, and it is not solved.** Lose one core
with the discs flat and the vehicle loses 25% of lift *and* gains a large
asymmetric moment. Four independent cores cannot cross-feed the way four
electric motors can. Current mitigation, in order:

1. **Rim-motor boost.** The ground-drive motor is rated for a 60-second
   emergency pull of ~30 hp, enough to convert an immediate roll departure into
   a controllable descent — not enough to hold hover. Honest about that.
2. **Fly the corridor fast.** Exposure is seconds, not minutes, by design.
3. **Ballistic recovery** for the crewed variant, sized for the transformation
   envelope.

If this cannot be closed in Gen-1 testing, the honest fallback is a single core
in the body driving tip-turbine fans in the rims (Ryan XV-5 precedent, with a
Harrier-style hot-gas swivel at the roll joint) — one engine, inherently
cross-fed, at the cost of ducting and noise. That is the fork to watch.

## 12. Make & maintain

- **Four identical modules**, no handedness. Mirrored mounting only.
- **Module change**: six bolts, one fuel quick-disconnect, one electrical
  connector. Target 12 minutes, two people, no lift equipment — the module rolls
  away on its own tire.
- **Hull** is three mouldings plus two rail extrusions; the rails are the
  primary structure and the skins are non-structural.
- The core is a bought-in gas generator, not a bespoke engine. The programme
  does not develop a turbine; it packages one.

## 13. Risks

| | Risk | Posture |
|---|---|---|
| 1 | Engine-out in hover (§11) | **Open.** Gen-1 gate. |
| 2 | Hot section inside a landing wheel — FOD, water, mud | Mesh, outboard inlet, spin-dry cycle; test early |
| 3 | Slide rail under load, contaminated | Sealed rail, redundant actuation, drive mode works with rails failed inboard |
| 4 | Conversion corridor, 25–68 mph, ducted lip pitch-up | First flight-test objective after tethered hover |
| 5 | Module mass growth | Half the vehicle; every pound here costs ~2 lb of GTOW |
| 6 | Acoustic signature | Doctrinal, not engineering |

## 14. Roadmap

1. **Gen-0 — one module on a stand.** Core, gearbox, variable pitch, roll and
   slide under load. Prove 120 hp ideal at FoM ≥ 0.6, and the 20-second spool.
2. **Gen-0.5 — transformation rig.** No flight. A ballasted chassis that
   performs all four beats, ten thousand cycles, in mud and grit. The
   transformation is the product; de-risk it before anything flies.
3. **Gen-1 — tethered hover,** then free transitions, then the corridor.
4. **Gen-2 — environmental and engine-out.** The §11 gate.
5. **Gen-3 — range kit:** the 16-foot deployable span.

## 15. Derivative — the unmanned sibling

The same kinematics scale down; the turbine does not. Below roughly 100 hp,
small-core thermal efficiency and tip-clearance losses make gas turbines worse
than batteries on every axis. The sub-100 lb scout therefore keeps the four-beat
transformation, the slide rail, the hubless rim and the flank channel, and
replaces each core with a coaxial electric fan pair. **The architecture is the
product; the powerplant is scale-dependent.**

## 16. Drawings

| File | View |
|---|---|
| `01-transformation.svg` | The four-beat takeoff, front view — the hero |
| `02-turbine-wheel-module.svg` | Module: face-on + section on the axis |
| `03-side-elevation.svg` | Side elevation, drive mode |
| `04-plan-states.svg` | Plan, drive and flight states |
| `05-power-curve.svg` | Power required vs airspeed, with the installed-power line |
| `06-fan-vs-core.svg` | Why the fan is big and the core is small |
