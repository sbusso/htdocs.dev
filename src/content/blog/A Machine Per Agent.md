---
title: A Machine Per Agent
description: macOS virtualization stopped being about running Windows. Apple container, OrbStack, Lima, Tart, UTM, QEMU, and why the VM became an allocatable unit again.
pubDate: 2026-08-04
tags:
  - agents
  - virtualization
  - macos
  - docker
published: true
created: 2026-08-04T10:08:00
---

For fifteen years, virtualization on a Mac answered one question. How do I run Windows. Everything about the tooling reflected that. Big installers, a wizard, a licence key, a VM you created once and babysat for years like a pet. The unit was heavy because the use case was heavy.

That question is basically settled and no longer interesting. The one that replaced it is smaller and much more demanding. How do I give this agent a machine of its own, and how cheaply can I do it fifteen times.

Those are different engineering problems. The first optimizes for one long-lived VM with good graphics. The second optimizes for creation and destruction. Boot time, clone cost, memory per instance, whether you can script the whole lifecycle without a GUI. The tooling on macOS spent 2025 and 2026 quietly reorganizing around the second one, and most people are still evaluating it with criteria from the first.
![CleanShot 2026-08-04 at 10.01.39@2x.png](/assets/CleanShot%202026-08-04%20at%2010.01.39@2x.png)

## The Only Distinction That Matters

Strip the marketing off every tool in this space and they differ on one axis. Where the kernel boundary sits.

Shape one is a single Linux VM hosting many containers on a shared kernel. Docker Desktop, OrbStack, Colima, Rancher. One kernel, many namespaces. Cheap per container, and the container is not a machine, it is a process group wearing a costume.

Shape two is one lightweight VM per container. Each workload gets its own kernel. This is what Apple shipped, and what Firecracker popularized on the server side.

Shape three is the full VM. Lima, Tart, UTM, VMware Fusion, Parallels. A real operating system with its own init, its own package manager, its own state.

Everything else is ergonomics. Which of these three you pick determines what an agent can actually see, how fast you can hand it a fresh environment, and what it costs you to run ten of them at once.

## Apple Finally Shipped the Thing

The [container project](https://github.com/apple/container) reached 1.0.0 on June 9, 2026, a year after showing up as a WWDC 2025 curiosity. It is a Swift CLI, Apache 2.0, fully OCI compatible, and it runs each Linux container inside its own lightweight VM on Apple's Virtualization framework. Images from Docker Hub work unchanged. There is no daemon and no licence tier.

The headline feature for anyone doing agent work is not the container runtime though. It is `container machine`, which landed with 1.0. A container machine is a persistent Linux environment with host integration, which is to say Apple built the thing everyone has been calling "WSL for Mac" for a decade. The Register described it exactly that way when it shipped, and the comparison holds.

The limits are real and worth knowing before you rearrange your setup around it. Memory accounting is per VM, so twenty containers means twenty kernels, and the shared kernel crowd will be lighter on a loaded laptop. Unpacking large images is slow because the ext4 writer is Swift userspace, which is fine for Alpine and painful for multi-gigabyte ML images. Apple silicon and macOS 26 only, no Intel, no N-1 OS policy.

For a personal machine in 2026 those constraints mostly do not bite. The interesting part is architectural. A VM per workload used to be the expensive option you chose for security. Apple made it the default shape, and the cost dropped to the point where you stop thinking about it.

[CodeRunner](https://github.com/instavm/coderunner) is the obvious early example of what that enables. It runs coding agents inside VM-isolated containers on Apple silicon, built directly on apple/container, exposing an MCP endpoint so any agent can delegate execution into it. That pattern, an agent talking to an execution environment over a protocol instead of running in your shell, is going to be the normal shape within a year.

## OrbStack Is Still the Ergonomics Winner

OrbStack sits in shape one and is very good at it. Fastest startup, lowest idle overhead, a native Mac UI that does not feel like a Java port, and excellent memory reclaim under load. It also does full Linux machines alongside containers, all on one shared lightweight kernel, so you can have a Ubuntu box reproducing a client environment and a Docker stack running together without juggling two tools.

Free for personal use, cheap per seat commercially, and notably cheaper than Docker Desktop's team tier. If you are running many containers on a laptop that also has Slack and forty Chrome tabs open, the shared kernel wins on arithmetic. Twenty micro VMs is twenty kernels. Twenty OrbStack containers is one.

## Lima Is the Substrate Everyone Builds On

Lima is a CNCF project and the honest primitive in this space. It starts and manages Linux VMs on macOS, with file sharing and port forwarding, and it does not pretend to be anything else. Colima is Lima with Docker pre-installed and the socket exposed to your host, which is the piece people actually mean when they say Colima.

For agent work you often do not want Colima at all. The pattern is simpler than that. Start a Lima VM, install the agent inside it, let it work there. Lima ships an AI agents example that does exactly this. The agent lives in the VM, clones the repo inside the VM, and your Mac is not part of the picture.

Lima also has the escape hatch nobody advertises. The templates are YAML, so switching a VM to amd64 through QEMU is one line, and switching between the Virtualization framework backend and QEMU is another. When you need something specific, you edit a file rather than filing a feature request.

## Tart Is the One for Fleets

[Tart](https://tart.run/) sits on Virtualization.framework and is built for automation from the start. VM images distribute through OCI registries, so you pull a machine the way you pull a container image. There is a Packer plugin for building them. Creation and destruction is scriptable end to end, and it handles macOS guests, which matters if you are doing anything Xcode adjacent.

This is the one to reach for when the question stops being "a VM for me" and becomes "a fleet of identical disposable machines". Ephemeral clones from a golden image, run the job, throw it away. Several of the agent sandbox wrappers in the wild are Tart underneath for exactly that reason.

## UTM and QEMU Are the Floor

UTM is a GUI over QEMU with an optional Apple Virtualization backend, Apache 2.0, currently on 4.7.5. Two things keep it installed on my machine. It covers 30-plus processor architectures including RISC-V and PowerPC, and it virtualizes macOS guests on Apple silicon. No GPU acceleration for Windows and only experimental OpenGL for Linux, so it is not a daily driver, it is the tool you open when nothing else can boot the image.

QEMU itself is the engine under UTM, Lima and most of the rest. You rarely want it raw on a Mac. The one rule worth internalizing is about architecture. Do not emulate x86 wholesale. Run arm64 Linux and let Rosetta handle x86 binaries inside it, which is dramatically faster than pushing an entire system through QEMU translation.

## What Agentic Work Actually Demands

Line up the criteria that matter when the consumer of the VM is an agent rather than you.

Creation has to be scriptable and fast, because you will be creating one per task, not one per year. Destruction has to be free, because the whole value of the pattern is that a wrecked environment costs nothing. Per-instance memory has to be small enough that N parallel agents fit on a laptop. And the environment has to be reproducible from a definition file, because an agent that gets a subtly different machine each run produces subtly different results and you will spend your evening debugging the substrate instead of the work.

Notice what is not on that list. Graphics performance. USB passthrough. Coherence-style desktop integration. The entire feature set that VM products competed on for a decade is irrelevant to this use case, which is why the products that win here are CLI-first and mostly free.

The one design decision that carries the most weight is filesystem sharing. Mounting your project directory into the VM is the convenient default and it is also the thing that quietly undoes the separation you set up. The alternative is boring and better. Clone the repo inside the VM, let the agent work on its own copy, push a branch out when it is done. Git is already the transfer protocol. You do not need a shared mount, you need a remote.

## What I Would Actually Run

On macOS 26 and Apple silicon, start with `container machine` for the persistent Linux environment. It costs nothing, it removes Docker Desktop from the picture, and Apple is going to keep investing in it.

Keep OrbStack for the daily container loop, especially anything Compose-heavy, where Apple's tool is still weakest and the shared kernel is lighter anyway.

Use Lima when you want a VM per agent and full control over what is inside it. Templates in version control, one VM per task, destroyed on completion.

Move to Tart the moment you are producing more than a handful of these and want them built from a golden image and distributed through a registry.

Keep UTM installed for the weird ones.

## The Machine Became Allocatable

The interesting shift is not any single tool. It is that the VM stopped being an install and became an allocation.

Creating an operating system instance used to be an event. You planned it, you named it, you kept it. Now it is closer to spawning a process. You ask for a machine, you get one in a few seconds, you hand it to something that does work in it, and you delete it without a thought.

That is the same move containers made in 2014, one level down the stack, and it lands right when the workload showing up needs precisely that. Agents do not need a computer. They need a computer each, for about eleven minutes.