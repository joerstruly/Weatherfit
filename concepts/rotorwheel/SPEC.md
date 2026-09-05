# RW-5 "FERRET" — Rotorwheel Hybrid Ground–Air Vehicle

**Concept Specification, Rev A** · 2026-09-05 · Unarmed ISR / scout mobility platform

---

## 1. Concept

A five-rotor hybrid unmanned vehicle in which the four road wheels each contain a
ducted lift fan in their open (hubless) centers, plus a fifth ducted fan on a
tilting tail pylon that assists liftoff and becomes the cruise pusher in flight.

The design thesis is **ground for endurance, air for obstacles**. Wheel-sized
rotors are aerodynamically poor (see §8.1), so the RW-5 is not a drone that also
drives — it is a ground scout that can *jump*: over rubble, wire, gaps, walls,
stairwells, and between floors or rooftops, then resume driving. The airframe is
sized by the single most binding requirement for interior work: **it must pass a
standard doorway under its own power in drive mode.**

### Mission profile (design case)

| Segment | Mode | Share of mission |
|---|---|---|
| Approach, patrol, interior traverse | Ground | ~90% of distance |
| Obstacle negotiation, floor/roof transfer, vantage hops | Air | ~10% of distance, ≤ 12 min total |

## 2. Configuration

- **Layout:** 4 × rotor-wheel modules on tilting swing-arms, skid-steered on the
  ground; 1 × tail fan on a 0–90° tilting pylon.
- **Drive mode:** wheel planes vertical, fans stopped, tail pylon folded flat.
- **Flight mode:** swing-arms tilt each wheel 95° outboard so all four fan discs
  are horizontal; tail pylon at 0° (thrust down) for liftoff, tilting aft toward
  90° (thrust rearward) for translational flight.
- **Control in hover:** quad fan differential thrust (roll/pitch/yaw via cant
  angles), tail fan for pitch trim and liftoff boost (~15% of hover thrust).
- **Control on ground:** independent per-wheel torque (skid steer), regenerative
  braking, zero-radius turn.

## 3. Rotor-wheel module

The wheel is hubless: an open-center structural rim carries everything, leaving
the center free for the fan.

From outside in:

1. **Airless shear-band tire ring** — Ø 520 mm, non-pneumatic (no blowouts,
   crush-recoverable), 28 mm band depth.
2. **Rim drive ring motor** — in-rim stator, magnet ring on the tire carrier.
   Direct rim drive, no gearbox, 1.4 kW continuous per wheel.
3. **Structural hubless rim** — also forms the duct outer wall.
4. **Fan ring motor** — second, independent ring motor driving the fan at the
   blade tips (tip-driven fan; the center stays clear of shafting).
5. **7-blade ducted fan** — Ø 420 mm, fixed pitch, 120 mm duct depth.
6. **Debris mesh** — both duct faces, ~5% thrust penalty, sized to reject
   > 8 mm objects.
7. **Tilt swing-arm** — single rotary actuator per wheel, 95° travel in 1.8 s,
   mechanical lock at both endpoints (unpowered holding in both modes).

Ground and flight drivetrains share nothing but the rim: either ring motor can
fail without taking the other mode down (a wheel with a dead fan still drives;
a wheel with a dead rim motor still lifts).

## 4. Tail unit

- Ø 360 mm ducted fan on a tilting pylon, 0–90° in 1.2 s.
- **Liftoff:** pylon vertical; adds ~15% thrust and gives direct pitch trim,
  which lets the CG sit slightly aft and keeps the quad fans inside their
  control margins during ground-effect departure.
- **Cruise:** pylon tilts aft; wheel fans unload toward lift-only and the tail
  fan provides forward thrust — a compound layout, more efficient than dragging
  the airframe with tilted lift fans.
- **Stowed (drive mode):** folded flat into the tail deck, protected.

## 5. Dimensions & masses

| Item | Value |
|---|---|
| Length overall, drive mode | 1,080 mm |
| Width overall, drive mode | **680 mm** (clears an 810 mm doorway with margin) |
| Height, drive mode (mast stowed) | 640 mm |
| Flight footprint (fans deployed) | 1,560 × 1,650 mm |
| Wheel / tire diameter | 520 mm |
| Wheel fan diameter | 4 × 420 mm |
| Tail fan diameter | 1 × 360 mm |
| Ground clearance | 190 mm |
| Gross takeoff mass (GTOW) | 42 kg |
| Payload (EO/IR gimbal + radio fit) | 3.5 kg included in GTOW |

### Mass budget (target, kg)

| Group | kg |
|---|---|
| Chassis / structure | 8.0 |
| Rotor-wheel modules, 4 × 4.2 | 16.8 |
| Tail unit (fan, pylon, actuator) | 2.4 |
| Battery (2.25 kWh Li-ion, 250 Wh/kg) | 9.0 |
| Avionics, comms, ISR payload | 3.5 |
| Wiring, thermal, misc | 2.3 |
| **GTOW** | **42.0** |

## 6. Performance (calculated, ISA sea level)

**Hover power check.** Total disc area = 4·π(0.21 m)² + π(0.18 m)² = 0.66 m².
Disc loading = 42 kg / 0.66 m² ≈ **64 kg/m²** — roughly 4× a conventional
quadcopter. Ideal hover power = T^1.5 / √(2ρA) ≈ 6.6 kW; at a figure of merit
of 0.65 (small ducted fans + mesh losses), **≈ 11 kW electrical at hover**.

| Metric | Value |
|---|---|
| Hover endurance (90% usable battery) | **≈ 11–12 min** |
| Practical air radius (hop budget) | ~3–4 km cumulative |
| Max air dash speed (tail pusher) | ~60 km/h |
| Ground speed, max / patrol | 45 / 20 km/h |
| Ground endurance @ 20 km/h | **≈ 3 h, ~45 km** |
| Gradeability | 40% slope; steps ≤ 180 mm rolled, anything above flown |
| Transition time, drive → airborne | ≈ 3.5 s |
| Acoustic note | High disc loading ⇒ loud in hover (~85–90 dBA @ 10 m est.); see §8.5 |

## 7. Subsystems

- **Autonomy/nav:** GNSS + visual-inertial odometry for denied interiors;
  lidar-lite ring for doorway centering; operator-in-the-loop for flight
  segments in Gen-1.
- **Comms:** MANET mesh radio, 2 W, plus fiber-spool option for RF-silent
  interior work.
- **Payload:** 2-axis EO/IR gimbal on stowable mast; two side accessory rails
  (power + Ethernet) for repeaters, droppable sensors.
- **Power:** hot-swap battery cassette through the tail deck; all five fans and
  four rim motors on a common 100 V bus.

## 8. The hard problems (honest assessment)

**8.1 Disc loading is the tax on the whole idea.** Confining rotors to wheel
diameter quadruples disc loading versus a free-rotor quadcopter of the same
mass, which costs roughly 2× hover power and most of the endurance. There is no
mitigation, only accounting: the mission profile must treat flight as a sprint.
If a use case needs > 15 min airborne, this is the wrong airframe.

**8.2 A fixed rear lift rotor doesn't work.** A single lift fan behind the CG
produces an uncommanded pitch-down moment it cannot trim away, and dead weight
in cruise. The tilting-pylon tail (§4) is the fix: it trims pitch at liftoff and
earns its mass back as the cruise pusher.

**8.3 Tilt mechanisms are the reliability budget.** Four swing-arm actuators,
four hubless rims, eight ring motors. The alternative — fixed horizontal lift
fans buried in the body — was rejected because it either widens the vehicle past
doorway width or shrinks the fans further (worse than 8.1). Mitigations:
endpoint mechanical locks, drive mode fully functional with any tilt actuator
failed, land-and-drive as the universal abort.

**8.4 Mud is worse than debris.** The mesh stops stones; wet mud caking on the
mesh and duct is the real thrust killer. Accepted limitation: after deep-mud
driving, VTOL is degraded until a spin-clean cycle (fans pulsed at ground idle)
or manual clearing. Wheel fans are sealed at the ring motor, not at the duct.

**8.5 Acoustics.** 64 kg/m² disc loading is loud. Signature mitigation
(7 unevenly-spaced blades, duct liners) helps tone, not level. Doctrine fix, not
engineering fix: fly briefly, land beyond line-of-sight, approach on wheels —
the quiet mode is the ground mode.

**8.6 Why not a caged quadcopter (HyTAQ-style)?**

| | RW-5 rotorwheel | Caged/wheeled quadcopter |
|---|---|---|
| Flight efficiency | Poor (small ducted fans) | Good (free rotors) |
| Ground endurance | ~3 h powered wheels | Minutes–low hrs, rotor-driven rolling wastes power |
| Ground signature | Quiet, low profile | Rotors always turning to move |
| Stairs/rubble driving | Real drivetrain, torque at wheels | Marginal |
| Mechanical complexity | High | Low |
| Doorways | 680 mm drive mode | Cage ≥ rotor span, similar or worse |

The rotorwheel buys ground endurance and silence at the price of complexity and
flight time. If the mission is mostly air, build the cage. If it is mostly
ground with vertical obstacles — the stated military interior/rough-terrain
case — the rotorwheel is defensible.

## 9. Development path

1. **Gen-0 (bench):** single rotor-wheel module — thrust stand + dyno; validate
   FoM ≥ 0.6 with mesh, ring-motor thermals, tilt-lock loads.
2. **Gen-0.5 (surrogate):** COTS quadcopter bolted to a skid-steer chassis;
   fly the mission profile to validate the 90/10 ground–air doctrine before
   spending on integration.
3. **Gen-1:** full airframe, tethered hover, then free transitions.
4. **Gen-2:** environmental hardening (mud, sand, EMI), autonomy for doorway
   and stairwell traversal.

## 10. Renderings

Rendering set in [`renderings/`](renderings/):

| File | View |
|---|---|
| `01-side-elevation-drive.svg` | Side elevation, drive mode, principal dimensions |
| `02-plan-flight.svg` | Plan view, flight mode, fan discs deployed |
| `03-wheel-module-cutaway.svg` | Rotor-wheel module, face-on cutaway with callouts |
| `04-transition-sequence.svg` | Drive → flight transition sequence, front view |
