**Table of Contents**

- [Info page](#user-content-info-page)
- [Introduction](#user-content-introduction)
- [Model](#user-content-model)
	- [Model Overview](#user-content-model-overview)
	- [Model Entities](#user-content-model-entities)
		- [User Story](#user-content-user-story)
		- [Task](#user-content-task)
		- [Worker](#user-content-worker)
		- [Manager](#user-content-manager)
	- [Model variables](#user-content-model-variables)
- [Application](#user-content-application)
	- [Libraries](#user-content-libraries)
		- [Sim.JS](#user-content-simjs)
		- [Lo-Dash](#user-content-lo-dash)
		- [jQuery](#user-content-jquery)
		- [Mustache](#user-content-mustache)
		- [Bootstrap](#user-content-bootstrap)
		- [RequireJS](#user-content-requirejs)
		- [Grunt](#user-content-grunt)
	- [Structure](#user-content-structure)
- [Game](#user-content-game)
	- [User Story](#user-content-user-story-1)
	- [Random Events](#user-content-random-events)
- [Conclusions](#user-content-conclusions)
- [References](#user-content-references)

---

# Info page



---

# Introduction

Software development is a complex process that is constantly influenced by decisions and events that happen during it. As methods mature higher quality and faster development is demanded from resulting projects. However as found by McKinsey and the BT Centre for Major Programme Management at the University of Oxford [^1], 66% of software projects cost more than budgeted, and 33% of software projects overrun their schedule.

[[TODO]]

* Problem with software projects (going over time/budget)
* Why simulation game (compare with flight simulators?)
* Previous implementations
  * "Design and Implementation of a Scenario for Simulation-based Learning in the Domain of Software-Engineering" (proper reference?)

[^1]: http://www.mckinsey.com/insights/business_technology/delivering_large-scale_it_projects_on_time_on_budget_and_on_value "McKinsey & Company in collaboration with the University of Oxford, 2012. Delivering large-scale IT projects on time, on budget, and on value"

# Model

## Model Overview

The game is built around a model that represents software development. It is based on agile software development, where the development is composed of sprints (1~2 week periods where a subset of user stories are developed into the product).

## Model Entities

[[TODO]] *Explanations of objects used in the model (eg. Worker, Manager, User story, Task)*

### User Story

[[TODO]] (Requirement that the project must complete. Composes of tasks)

### Task

[[TODO]] (A task that must be completed by a worker as part of implementing the user story)

### Worker

[[TODO]] (Employee who completes tasks)

### Manager

[[TODO]] (The in-game representation of the player?)

## Model variables

[[TODO]] *Explanation of the variables in the model that can be changed to modify the output*

# Application

[[TODO]] *Explains the complete side of the project: Implementation of the project and the game.*

## Libraries

[[TODO]] *Explanations of which frameworks and libraries are used in the project: How they are used and why they are used.*

### Sim.JS

[[TODO]] (Used for constructing the simulation model)

### Lo-Dash

[[TODO]] (Used for utility functions while ensuring cross-browser (and environment) support)

### jQuery

[[TODO]] (Used for front-end code)

### Mustache

[[TODO]] (Used for rendering templates on the front-end)

### Bootstrap

[[TODO]] (Front-end looks, mainly because I'm not good at design and every new site seems to use it)

### RequireJS

[[TODO]] (Used for modular loading of the code)

[[TODO]] (Also used RequireJS text module for template loading)

### Grunt

[[TODO]] (Build tool, used for a simple development server and compressing the code that is ready to be served)

## Structure

[[TODO]] *Explanation on how the code is structured, how the model is represented in the code, how the game UI interfaces with it, etc...*

# Game

## User Story

[[TODO]] *Overview of the game from the player's perspective.*

## Random Events

[[TODO]] *List of random events that the player needs to decide on, explanations of what decisions change.*


# Conclusions

[[TODO]] *Something something how great it is?*

*For possible future expansions:*

* Tracking player's choices
* Online leaderboards to find out best decisions.


