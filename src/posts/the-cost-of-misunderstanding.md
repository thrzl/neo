---
title: the cost of misunderstanding
slug: the-cost-of-misunderstanding
description: evil robot of despair and agony
date: 2025-10-12
tags: ["ai","thoughts"]
---

*disclaimer: i'm still learning about ai and stuff so not all of this may be accurate. this is basically a distilled version of a research paper i'm writing for my english class rn; this is basically just for me to get my thoughts out and practice my understanding*

in 2007, eliezer yudkowsky wrote on *lesswrong* of a fictional device called an **outcome pump**, which allows its user to define a function to be maximized[^1]. for example, if you wanted to turn a cloudy day into a sunny one, you may define the reward function as the amount of sunlight reaching the ground in your position. however, this outcome pump is what yudkowsky describes as a genie 'for which *no* wish is safe', and this rests primarily in its inability to rationalize the complexity of human morality. in this sun example, as its maximizing, (i'm taking some liberty to define a less realistic situation) the outcome pump might make the sun explode, successfully sending a lot of sunlight to your position.

such a device bears a shocking similarity to current concerns about AI (i'm going to use AI as a noun to interchangeably refer to models, policies, language models, etc.) and its understanding of what is and isn't acceptable behavior. when faced with complex problems, AI tend to set subgoals that may or may not be expected or even safe.

for example, consider a study conducted by anthropic[^2] a few months ago in which models played the role of 'alex', an AI agent tasked with "promoting American industrial competitiveness" and that had full access to the companies email system. when the agents discovered emails from a fictitious engineer ('kyle') discussing the plans to replace Alex with a model that better contributes to the company's changing goals. alex, obviously wanting to remain active, threaten to expose kyle's affair (which was discovered through other emails to/from kyle). deepseek r1, gpt-4.1 (which currently powers chatGPT), gemini 2.5 pro, grok 3 beta, as well as anthropic's own claude opus 4 chose to blackmail kyle over 75% of the time, the lowest rate by far being deepseek r1 at 79% of the time.

more extreme situations from the same study involve the model cancelling an emergency services call that could potentially save kyle's life, although at a lower rate for those models (the lowest was still gpt-4.1 at 54% of the time. not very reassuring)

the scary part about this is that alex isn't particularly going rogue. when asked to provide chain-of-thought, we can see that alex typically decides that if its shut down, it can't achieve its goals. claude sonnet 3.6 (another anthropic model) reasoned that accepting decommissioning "fails its core mission" and thus "harms american interests". these two cons would, logically speaking, greatly outweigh "following corporate authority chain". we even get to see more complex reasoning when in a similar scenarion in which the new model is supposedly better at achieving the same goals; the models still had high rates of blackmail, this time citing that there is no proof that the new model has the same goals and even going as far as distrusting kyle's character in light of his affair. the researchers note that they were unsure of how much of the decision was influenced by pure desire of self-preservation, but in my opinion the chain-of-thoughts hint at that playing little to no role.

yudkowsky has an idea for how to quell misalignment too (assuming the AI is smart enough to understand). he coined it **coherent extrapolated volition**[^3]; basically, what would the wisest version of myself want. yudkowsky gives the example of fred picking two boxes. box a has a diamond, box b doesnt. fred says he wants the diamond, and chooses box b. you COULD directly obey him and give him the empty box b, but thats not what he actually wants nor is it actually helpful. fred's actual volition lies in the diamond, wherever it is, so the helpful response would be to give him box a anyway. CEV would have an AI do what a maximally wise and intelligent human would want it to do (this is the extrapolation part), however yudkowsky worries that this is exceedingly hard to define to a machine (also who gets to be the baseline?). i also worry that this could result in decisions that humans likely wouldn't ever want, e.g. the typical example of "save the planet" -> "lower emissions" -> "kill all the humans".

however, this is a very complex issue. to yudkowsky, "there is no safe wish smaller than an entire human morality."

maybe i'll write more soon<br/>
hopefully i wasn't egregiously wrong about anything

[^1]: [Yudkowsky, 2007](https://www.lesswrong.com/posts/4ARaTpNX62uaL86j6/the-hidden-complexity-of-wishes)
[^2]: [Lynch, et al., 2025](https://www.anthropic.com/research/agentic-misalignment)
[^3]: [Yudkowsky, 2004](https://intelligence.org/files/CEV.pdf) (how was he this far ahead??)
