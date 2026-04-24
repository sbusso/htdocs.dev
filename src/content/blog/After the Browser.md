---
title: After the Browser
author: Stephane Busso
description: the agent harness is the new browser, MCP is the new HTTP, and the hard problems have moved from the loop to the tool layer, context management, and federated capability.
published: true
tags:
  - harness
  - agent
updated: 2026-04-24T17:37
created: 2026-04-24T17:37
cover:
---
For thirty years, APIs existed to power user interfaces. The UI was the product. The API was plumbing. You shipped a website, a mobile app, a desktop client, and somewhere behind it sat the endpoints that made the thing work. The API was a means. The interface was the end.

That relationship is inverting, and most of what's being built right now is optimized for the wrong target.

In the emerging model the API becomes the product, and interfaces become contextual, ephemeral, generated on demand when a human actually needs to see something. Not gone entirely. Not replaced. Reorganized. The browser mediated between humans and a web of documents. The agent mediates between intent and a web of capabilities. That is a much bigger unit of software than a "chat interface with tools," and taking it seriously changes what you build.

## The Agent Is a User Agent

Before it became a product category, "user agent" was the term HTTP used for the thing that made requests on your behalf. Your browser is a user agent. Curl is a user agent. The GoogleBot crawler is a user agent. The word "agent" in software predates the current wave by forty years, and it meant something precise: a program that acts on behalf of a human across a network.

What we're building now is the next generation of user agents. They happen to use language models to reason about what to do, but that is the novelty, not the essence. The essence is unchanged. Something represents you on a network of services, understands what you want, and figures out how to get it.

Seen that way, the harness is not a wrapper around an LLM. It is a user agent in the original sense, operating on a network where most of the other participants are also agents or agent ready services.

## MCP Is Trying to Be HTTP

Once you accept that framing, the protocol question gets interesting. HTTP won because it was simple, standard, and open enough that any document serving system could participate. The web of documents grew faster than any walled garden could, and the walled gardens lost.

MCP is trying to be the HTTP of this new network. It is not the only candidate. OpenAI has its agents platform, Google has its own stack, every big vendor will try to extend the standard in ways that favor them. Whether MCP wins exactly, or whether something MCP shaped wins, is still open. But directionally it is the right abstraction: a standard protocol for exposing capabilities (tools, resources, prompts) to any agent that speaks it. The bet is the same bet HTTP made. Standardize the protocol, and the ecosystem grows faster than any proprietary stack can.

The early evidence is there. In a year, MCP went from a proposal to a thing you can assume your tools will speak. That is the fastest adoption of an agentic standard so far, and it matters because the value of any such protocol is network effects. Whoever reaches critical mass first tends to keep it.

## The Content Layer Already Shifted

If this feels speculative, look at the content layer. It has already happened there.

Search used to mean: type query, read list of blue links, click one, read the page. Rank on page one and you got traffic. That playbook drove two decades of SEO.

Now people ask a language model and get an answer. The links might still be there, but they are footnotes on a response the model assembled. The winning move is no longer to rank on page one. It is to be cited in the answer. That is Generative Engine Optimization, and it is not a different flavor of SEO. It is a different game with different physics. Content has to be queryable, synthesizable, attributable, and worth citing on its merits, not just worth clicking.

The service layer is shifting the same way, one stage behind. Websites, mobile apps, dashboards. These are the blue links of the service world. An agent does not want to log into your portal and click through your wizard. It wants to invoke your capability, get a structured answer, move on. "Having a great website" will matter less than "having discoverable, well described, trustworthy tool endpoints." The playbook for the agentic era looks closer to API design and developer relations than to growth marketing.

For anyone building a service today, this is the real question. If an agent were the primary consumer of what you ship, what would you build differently? Most teams have not asked themselves yet.

## What Moves Around the Loop

If you are building a harness for this world, the core loop is boring and stays boring. Send a message, execute any tool calls, feed results back, repeat until done. Every decent framework gives you that in fifty lines. The real engineering moves to three layers around the loop.

**Tools stop being a static list and become infrastructure.** Most harnesses today ship a hardcoded JSON array of tools into the system prompt. That works until you have a hundred tools, or tools owned by different teams, or tools you discover at runtime. The tool layer of a serious agent system looks more like DNS plus a package manager plus a reputation system than a config file. Dynamic discovery, capability descriptions, cost and latency metadata, trust signals, versioning, federation across providers. The core loop should not know about specific tools at all. Pi's design, four tools in the core and everything else as extensions, is the early shape of this idea. It reads as minimalism now. In five years it will read as the obvious architecture.

**Context becomes the scarcest resource.** Not tokens. Context. Tokens are a budget; context is what the agent can meaningfully hold at once. As tool use scales, results explode. A real session burns through context windows fast, and the hardest engineering problem becomes deciding what to keep, what to summarize, what to evict, what to refetch. Subagent delegation with isolated contexts is not an elegant pattern chosen for aesthetics. It is a necessity. One agent literally cannot hold the state of a complex task. Context management is where harness quality separates from harness novelty.

**Routing becomes a runtime decision, not a config choice.** Which model handles this turn, which provider serves this tool, what is the budget for this call, what is the acceptable latency. These become first class decisions at dispatch time, not settings in a YAML file. Every harness eventually needs a router that optimizes across models, tools, costs, and latency per request. This is the part people most underestimate. They think they are building an agent framework when they are actually building a small operating system for compute and capability.

## What To Build Now

If you believe this is where things are heading, four things are worth investing in today.

**Expose your own capabilities as tools before you build interfaces for them.** For anything you own where an agent might be a consumer, ship the MCP endpoint before or alongside the UI. Your algorithms, your data, your proprietary logic. Expose them as tools first. Interfaces can be rebuilt. A reputation as the authoritative MCP endpoint in your domain is much harder to rebuild once someone else has it. If you run a service with unique underlying analysis, your moat in 2027 will be less about the dashboard you ship and more about being the endpoint every agent cites when asked about your domain.

**Own your tool registry.** Not just a list of tools your agents are allowed to call. A real registry with capability descriptions, usage examples, cost metadata, health monitoring, version history, and provenance. Treat it as infrastructure. You will thank yourself every time you onboard a new agent, audit a failure, or try to swap a provider.

**Design for federated identity now, even if you cannot solve it yet.** The big unsolved problem of the agentic internet is how your agent acts on your behalf across hundreds of services without you typing passwords into every one. OAuth was designed for apps, not agents. Something new is coming, in the form of scoped capability tokens, auth patterns built for agents, passkeys adapted for machine principals. You do not have to build this yourself. But the harness you build today should assume federated capability tokens arrive within two years, and should not bake per service credential handling so deeply that you cannot move.

**Treat the agent as a distributed system in your observability.** Because it is one. Every tool call is an RPC to a different service with different failure modes, latencies, and trust levels. Logs, traces, replay, deterministic reproduction of sessions. This is table stakes in five years. It is a differentiator today. Pi's JSONL session persistence is the minimum viable shape of this. Anything less is building on sand.

## The Thin Core Wins

The harness that wins the agentic internet will not be the one with the most features. It will be the one with the thinnest core and the richest composition surface. This is the bet Unix made. It is the bet HTTP made. It is the bet Docker made. It is the bet every protocol that outlived its first generation of users made. Compose, do not contain.

The reason is always the same. The ecosystem grows faster than any single vendor can. If your system is composable, the ecosystem extends you. If your system is opinionated, the ecosystem routes around you. Frameworks that try to capture the entire workflow in one abstraction are building the AOL of agents. Thin cores that do almost nothing but let anything plug in are building the HTTP of agents. I know which side I want to be on.

## The Frame That Will Age Well

A lot of what is being called "building an agent framework" today is going to look, in retrospect, like building yet another browser for documents while the actual web being built runs on a different protocol.

The agent harness is the new browser. MCP is the new HTTP. The hard problems have moved from the loop to the tool layer, to context management, and to federated capability. The people building harnesses today who understand that are positioning themselves for the next twenty years of software. The ones building yet another chat wrapper are building for a window that is already closing.

The browser was never the point. It was the shape the network took when the network was documents. The network is becoming capabilities, and the shape it takes will be something else. We get to build that something else now.