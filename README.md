# Exploring Gerrymandering Through Simulation
Applet by [Skew The Script](https://skewthescript.org/) (applet authors: Max Cembalest, Dashiell Young-Saver, and Chris Olsen) <br>
Simulation powered by [ALARM redist](https://alarm-redist.github.io/redist/) (by Christopher Kenny & Cory McCartan)

View and use the web applet here: [skew-the-script.github.io/Gerrymandering](https://skew-the-script.github.io/Gerrymandering/)

Our web applet uses simulation to find evidence of [gerrymandering](https://en.wikipedia.org/wiki/Gerrymandering) in state redistricting plans. The applet will be used in high school statistics classrooms as a part of the [Skew The Script curriculum](https://skewthescript.org/ap-stats-curriculum). The applet is currently in beta stage.

Our simulations are powered by ALARM's [redist package](https://alarm-redist.github.io/redist/). The R package randomly divides a state into compactly-shaped districts of roughly equal population size (while following all state laws for district drawing). Then, it uses prior election data to find the political lean of the simulated districts. Our applet allows high school students to use this powerful simulation technology, with only a few online button clicks.

We are indebted to ALARM's amazing work. Read more here: McCartan, et al. (2022, Feb. 8). ALARM Project: 50-State Redistricting Simulations. Retrieved from https://doi.org/10.7910/DVN/SLCD3E
