# FERRET — Handoff to a new session

**Purpose of this file:** start a fresh session that writes a *real* design spec for
the owner's vehicle and builds a physics engine to test it. Everything the next
session needs is here. Prior drafts live in `concepts/rotorwheel/` (Revs A–F). The
owner has said those drafts are **not what they have been describing**, so treat them
as a record of what was tried, not as a baseline.

**Authority order:** (1) the owner's own words in §1, later statements overriding
earlier ones; (2) physics; (3) anything a prior draft decided. Where the owner's words
are ambiguous, ask, or record the reading you chose as an open question. Don't settle
it silently.

---

## 0. Paste this into the new session

> Read `concepts/ferret/HANDOFF.md` in full. Use a **Fable** subagent
> (Agent tool, `model: "fable"`) to review every owner statement in §1 and produce a
> requirements-traceability table: each statement → the requirement(s) it creates →
> whether a later statement supersedes it. Give the subagent §1 and §2 verbatim, and
> tell it the prior drafts in `concepts/rotorwheel/` drifted from the owner's intent.
> Then write `concepts/ferret/DESIGN_SPEC.md` from that table, written like a product
> industrial designer's spec, in US customary units. Mark every requirement as
> **owner-specified**, **derived** (forced by physics or by an owner requirement), or
> **proposed** (our idea, which the owner can veto). Then build the physics engine in
> §4 under `concepts/ferret/sim/`, set it up with the spec's numbers, and run the
> scenarios. Ask the owner the §3 open questions before locking anything they affect.

---

## 1. What the owner said, verbatim, in order

Typos are kept; probable meanings are in brackets. The *context* line under each one
is the prior drafter's summary of what the owner was reacting to. It is not owner
input.

**1.** "I've had an idea of a drone that drives and flys by putting the turbine /
propeller into the wheels with one in the rear that helps it lift off. This way it can
be used for military applications to traverse difficult terrain and interiors quickly.
Build me a spec doc and rendering set for it."
*Context: first message.*

**2.** "Close but. Not really it. The wheels will have a dual propeller system. They
can rotate forward and back once flipped up so that they can fly faster forward. The
rear propeller should be built into body of the drone. It can also tilt forward. The
wheels should be smaller and the body should look more like an F1 car in front and a
wider back with a wing shape front to back"
*Context: Rev A had four 520 mm wheels, each with a single ducted fan, and a tail fan
on a tilting pylon.*

**3.** "This is great. How could this scale to carry a human or 4 humans."
*Context: Rev B had coaxial fans in 400 mm wheels with two-axis tilt, a lift fan
embedded in the body behind a vane box, and a delta lifting-body hull.*

**4.** "I anticipate it flaying [flying] with the rear fans higher than the front so
all 4 wheel fans have a clear view forward"
*Context: the scaling analysis said 1 seat was viable and 4 seats were not.*

**5.** "Yes, fold it into Rev C and give me a realistic visual of it as a 2 person
vehicle. And what if at the human scale the dual fans are actually small turbines
instead?"

**6.** "A few issues -
1 the rear fans don't need to be on longer arms the whole vehicle flies tilted forward
so with the same arms it flies with the rear naturally higher.
2 the wheels are too small. Way too small proportionately.
3 why aren't they small turbines with the wheel around them? The wheel can spin while
the turbine is locked. The wheel is 3d printed no air.
4 there should not be two middle body turbine. East [waste] of space ."
*Context: Rev C raised the rear pivots on longer arms for wake clearance. The 2-seat
RW-2S had two 1.7 m fans in the body and 0.82 m wheels. Turbines in the wheels had been
analysed as turbojets and rejected.*

**7.** "No not fans turbines like on a commercial jet but smaller"
*Context: Rev D had identical arms, a 15° nose-down cruise and 1.4 m wheels, with no
body fans. The drafter rejected turbines in the wheels on throttle lag and read
"turbines" as turbojets.*

**8.** "I care less about hover and more about speed and control. The hover will
really come in transition. A quad copter is built to hover this is built to execute
point a-b speed"
*Context: the drafter argued a turbofan matched to the thrust needs about 5× the hover
power because its disc area is small.*

**9.** "Do the math in mph and US based units"

**10.** "Okay we need to rethink this. I want the wheels to be the small turbines. That
way the turbines can start while the wheels are still perpendicular to the ground.
Maybe we don't need the central one. Then to take off the wheels rotate toward the
vehicle slowly to redirect the flow downward then slide out from under the vehicle and
finish the rotate. Rebuild the spec like a product industrial designer."
*Context: Rev E (the speed design point) withdrew the nose-down cruise, on the claim
that the wake problem had been overstated, and used variable-pitch electric fans.*

**11.** "Okay this design is not what I have been describing. Use a fable 5.2 subagent
to review all the things I've said and lets build a real design spec for it. This will
be to handoff to a new session. Also include in that spec a physics engine we can use
to test the aircraft in reality."
*Context: Rev F (TW-2) was 2,700 lb with two seats. It used four 195 hp turboshaft
cores, each driving a Ø52 in variable-pitch fan at a bypass ratio of about 100, with the
core sticking out outboard of the wheel behind a spinner. The body fan was deleted. It
added a four-beat spool / roll-in / slide-out / roll-out transformation, flank reaction
channels, a CMF section, and left engine-out unsolved.*

**12.** "actually just build that handoff I'll do the rest in another session."

---

## 2. Requirements as the owner has stated them (first-pass read — verify)

Latest statement wins. **[OS]** = owner-specified. These are a starting point for the
Fable review, not a substitute for it.

- **Mission [OS]:** military. Cross difficult terrain and building interiors quickly (1).
  **Point-to-point speed and control matter most; hover happens only in transition**
  (8). It is not a quadcopter.
- **Drives and flies [OS]** (1).
- **The wheels are the propulsors [OS]** (1, 10): "I want the wheels to be the small
  turbines."
- **Propulsor type [OS]:** "turbines like on a commercial jet but smaller" (7). That
  means jet turbines, i.e. turbofans, not propellers or fans (7 overrides "dual
  propeller" in 2, and "dual fans" in 5 was asked as a question).
- **Wheel/turbine relationship [OS]:** a small turbine *with the wheel around it*; the
  wheel spins while the turbine stays locked; the wheel is **3D-printed and airless** (6).
- **Wheel size [OS]:** large in proportion to the vehicle. Rev C's were "way too small"
  (6), which overrides "smaller" in (2).
- **Engine start [OS]:** the turbines can start while the wheels are still vertical,
  perpendicular to the ground (10).
- **Takeoff sequence [OS]** (10): the wheels (1) rotate toward the vehicle, slowly, to
  turn the flow downward, then (2) slide out from under the vehicle, then (3) finish
  the rotation.
- **Flight vectoring [OS]:** once flipped up, the wheel units can rotate forward and
  back to fly faster forward (2).
- **Flight attitude [OS]:** **the whole vehicle flies tilted forward**, so with
  identical arms the rear units sit higher and all four have clear air forward (4, 6).
  No longer rear arms.
- **Rear/central body propulsor:** first a rear propeller *built into the body* that
  tilts forward (1, 2). Then "should not be two middle body turbine" (6), then "maybe
  we don't need the central one" (10). **Open:** none, or exactly one. See §3.
- **Body [OS]:** F1-car front, wider back, wing shape front to back (2).
- **Scale:** started as a drone (1). The owner then asked about 1–4 people (3) and
  asked for a 2-person visual (5). **Open:** which scale is primary. See §3.
- **Units [OS]:** mph and US customary (9).
- **Spec style [OS]:** written like a product industrial designer's spec (10).
- **Testing [OS]:** a physics engine to "test the aircraft in reality" (11).

### Where prior drafts appear to have drifted (drafter's own notes — verify independently)

- **Rev E withdrew the nose-down flight attitude** the owner specified in (6), and
  Rev F kept it withdrawn. The owner's attitude should be restored. Its cost (body
  lift, drag) should be shown, not used as a reason to override it.
- **Rev F used turboshaft cores driving big fans** (bypass ratio about 100), not
  "turbines like on a commercial jet but smaller" (7).
- **Rev F put the core outboard of the wheel**, not with "the wheel around" a locked
  turbine (6).
- Drafts repeatedly overrode owner choices with performance arguments (disc loading,
  wake, throttle lag). The physics in those arguments may be correct, but the right
  move is to **build the owner's design and let the simulator show the consequences**,
  then offer mitigations the owner can accept or reject.
- Features the owner never asked for and should get to veto: the flank reaction
  channels, the slide rail as the shoulder line, the 16 ft deployable wing, the
  variable-pitch fans, the CMF palette, and the hull lifting-body analysis.

---

## 3. Open questions to ask the owner first

1. **Primary scale:** the unmanned military drone, the 2-person vehicle, or both as one
   family?
2. **Body turbine:** none, or exactly one built into the rear that tilts forward?
3. **Wheel around a locked turbine:** does the airless tire ring turn on a bearing
   around a non-rotating turbine nacelle? Where does ground-drive torque come from —
   a rim motor, or a geared take-off from the turbine?
4. **Drive mode:** where do the turbines exhaust when they start with the wheels
   vertical? Inboard, outboard, or rearward? Can that exhaust push the vehicle along
   on the ground?
5. **"Rotate toward the vehicle":** the top of the wheel tips inboard? And which way
   does the turbine face in drive mode, so that this rotation points the flow down?
6. **"Slide out from under the vehicle":** in drive mode, are the wheels partly under
   the body, or beside it?
7. **Cruise attitude:** how many degrees nose-down is intended?
8. **Targets:** cruise speed, top speed, range, and payload, in US units.

---

## 4. Physics engine — what to build

The owner asked for an engine to "test the aircraft in reality." Be honest in its
README: this is a **first-order 6-DOF flight and ground simulator**, not reality and
not CFD. Its job is to make the trades visible with numbers before hardware exists.

**Stack:** Python 3.11 with numpy (matplotlib for plots, pytest for tests). In this
sandbox `pip install` did not make numpy importable for `python3`, so use a venv
(`python3 -m venv .venv && .venv/bin/pip install numpy matplotlib pytest`). Keep every
vehicle parameter in a config file (TOML via the standard-library `tomllib`) so design
options are data, not code.

**Must model:**
- **Rigid body:** 6-DOF with quaternions and fixed-step RK4. Mass, CG and inertia
  tensor update as fuel burns.
- **Atmosphere:** ISA density with altitude, plus wind and gusts.
- **Body aerodynamics:** lift, drag and pitching moment against angle of attack and
  sideslip, from a coefficient table, so the **nose-down cruise** cost or benefit
  comes out of the sim rather than being assumed.
- **N propulsion units**, config-driven. Each has a mount position and an **actuator
  chain: roll toward the vehicle → slide out → pitch fore/aft**, with rate and travel
  limits. That covers the owner's takeoff sequence and forward vectoring. Support an
  optional rear body unit that tilts.
- **Turbofan model per unit:** static thrust; thrust lapse and ram drag with airspeed;
  **spool dynamics** (separate accel and decel time constants, idle to max); TSFC fuel
  burn; exhaust velocity; inlet disc area. With those in place, the disc-loading and
  throttle-lag trades are measured instead of argued. Also provide an
  electric-ducted-fan model with fast response, for comparison only.
- **Ground contact:** spring-damper tire contacts with friction and rolling
  resistance, driven wheels for drive mode, and the transition from wheels to thrust
  as the units rotate.
- **Jet/ground interaction (simple):** ground effect, and a flag for hot exhaust aimed
  at the body or the ground.
- **Flight control:** attitude and velocity hold with **control allocation** across
  the units' thrust and actuator angles, plus a scripted **transformation sequencer**
  (start → rotate toward vehicle → slide out → finish rotate, and the reverse for
  landing).

**Scenarios to ship, each producing CSV telemetry, a summary and plots:**
1. Start the turbines on the ground, wheels vertical, and confirm the vehicle stays put
   or creeps.
2. The full takeoff transformation into hover.
3. Transition to **nose-down forward flight**.
4. **A-to-B dash:** time, fuel and peak load for a set distance, the owner's headline
   metric.
5. Engine-out at hover, in transition and in cruise.
6. Landing, with the reverse transformation.
7. A gust and handling sweep to check "control".

**Tests:** free-fall energy conservation, hover equilibrium, actuator limits enforced,
mass and CG change with fuel burn, and a spool step response against its time
constant.

**Fidelity roadmap (document only):** export to JSBSim, or run the controller in PX4
SITL / Gazebo, once the first-order model is trusted.

---

## 5. Repository map

- `concepts/rotorwheel/SPEC.md`, `index.html`, `renderings/`: prior drafts, ending at
  Rev F. **Superseded.** Useful only to see what was tried.
- `concepts/rotorwheel/tw2-viewer.js`: a three.js model of Rev F with a transformation
  scrubber. It could be reused for the new geometry.
- Branch: `claude/hybrid-drone-vehicle-spec-qdwitr`. No PR has been opened.
- Published artifact of Rev F: https://claude.ai/artifact/8e5BPNvB2pcgXKDuuad1zS
  (superseded). An accidental duplicate exists at
  https://claude.ai/artifact/YJCcMVy5Y8UJYncs8NQ4GU and can be deleted.
