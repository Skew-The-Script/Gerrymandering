# Libraries
#Make sure to update before running by using: install.packages('redist')
library(redist)
library(ggplot2)
library(readr)
library(tidyverse)
library(forcats)
library(dplyr)
library(devtools)
# make sure to update before running buy using: devtools::install_github("alarm-redist/ggredist")
library(ggredist)
library(ggrepel)
library(tigris)
library(purrr)
library(sf)
library(scales)
library(patchwork)
library(here)

sf::sf_use_s2(FALSE)


######################################
##Plotting function from redist internal package: https://github.com/alarm-redist/alarm-redist.github.io/blob/main/_fifty-states/fifty-states.R
######################################

PAL_COAST = c("#7BAEA0", "#386276", "#3A4332", "#7A7D6F", "#D9B96E", "#BED4F0")
PAL_LARCH = c("#D2A554", "#626B5D", "#8C8F9E", "#858753", "#A4BADF", "#D3BEAF")
PAL = PAL_COAST[c(5, 1, 2, 4, 3, 6)]
GOP_DEM <- c("#A0442C", "#B25D4C", "#C27568", "#D18E84", "#DFA8A0",
             "#EBC2BC",  "#F6DCD9", "#F9F9F9", "#DAE2F4", "#BDCCEA",
             "#9FB6DE", "#82A0D2", "#638BC6", "#3D77BB", "#0063B1")

ggplot2::theme_set(ggplot2::theme_bw())

lbl_party = function(x) {
  if_else(x == 0.5, "Even",
          paste0(if_else(x < 0.5, "R+", "D+"), number(200*abs(x-0.5), 1)))
}
lbl_party_zero = function(x) {
  if_else(x == 0.0, "Even",
          paste0(if_else(x < 0.0, "D+", "R+"), number(100*abs(x), 1)))
}

scale_fill_party_b <- function(name="Democratic share", midpoint=0.5, limits=0:1,
                               labels=lbl_party, oob=squish, ...) {
  scale_fill_steps2(name=name, ..., low = GOP_DEM[1], high = GOP_DEM[15],
                    midpoint=midpoint, limits=limits, labels=labels, oob=oob)
}
scale_fill_party_c <- function(name="Democratic share", midpoint=0.5, limits=0:1,
                               labels=lbl_party, oob=squish, ...) {
  scale_fill_gradient2(name=name, ..., low = GOP_DEM[1], high = GOP_DEM[15],
                       midpoint=midpoint, limits=limits, labels=labels, oob=oob)
}
scale_color_party_c <- function(name="Democratic share", midpoint=0.5, limits=0:1,
                                labels=lbl_party, oob=squish, ...) {
  scale_color_gradient2(name=name, ..., low = GOP_DEM[1], high = GOP_DEM[15],
                        midpoint=midpoint, limits=limits, labels=labels, oob=oob)
}
scale_color_party_d = function(...) {
  scale_color_manual(..., values=c(GOP_DEM[2], GOP_DEM[14]),
                     labels=c("Rep.", "Dem."))
}

qile_english = function(x, ref, extra="") {
  qile = mean(ref <= x)
  if (diff(range(ref)) == 0) {
    "in line with the"
  } else if (qile < 0.35) {
    str_glue("less {extra}than {percent(1 - qile)} of all")
  } else if (qile > 0.65) {
    str_glue("more {extra}than {percent(qile)} of all")
  } else {
    "in line with the"
  }
}



plot_cds = function(map, pl, county, abbr, qty="plan", city=FALSE, coverage=TRUE) {
  if (n_distinct(pl) > 6)
    plan = redist:::color_graph(get_adj(map), as.integer(pl))
  else
    plan = pl
  places = suppressMessages(tigris::places(abbr, cb=TRUE))
  if (city) {
    cities = arrange(places, desc(ALAND)) %>%
      filter(LSAD == "25") %>%
      head(4) %>%
      st_centroid() %>%
      suppressWarnings()
  }
  
  if (qty == "dem") {
    qty = expr(dem)
    scale = scale_fill_party_b("Two-party\nvote margin", limits=c(0.35, 0.65))
  } else {
    qty = expr(.plan)
    scale = scale_fill_manual(values=PAL, guide="none")
  }
  
  cty_val = rlang::eval_tidy(rlang::enquo(county), map)
  if (n_distinct(cty_val) == nrow(map)) county = 1L
  
  counties = map %>%
    as_tibble() %>%
    st_as_sf() %>%
    group_by({{ county }}) %>%
    summarize(is_coverage=coverage)
  map %>%
    mutate(.plan = as.factor(plan),
           .distr = as.integer(pl),
           dvote = map$ndv,
           rvote = map$nrv) %>%
    as_tibble() %>%
    st_as_sf() %>%
    group_by(.distr) %>%
    summarize(.plan = .plan[1],
              dem = 1 / (1 + sum(rvote, na.rm=T) / sum(dvote, na.rm=T)),
              is_coverage=coverage) %>%
    ggplot(aes(fill={{ qty }})) +
    geom_sf(size=0.0) +
    geom_sf(data=places, inherit.aes=FALSE, fill="#00000033", color=NA) +
    geom_sf(fill=NA, size=0.4, color="black") +
    geom_sf(data=counties, inherit.aes=FALSE, fill=NA, size=0.45, color="#ffffff2A") +
    {if (city) ggrepel::geom_text_repel(aes(label=NAME, geometry=geometry),
                                        data=cities, color="#000000", fontface="bold",
                                        size=3.5, inherit.aes=FALSE, stat="sf_coordinates")} +
    scale +
    theme_void() +
    theme(legend.key.size=unit(0.75, "cm"))
}


############################################
#### Plotting based on 'download_dataverse' function from: https://github.com/alarm-redist/alarm-redist.github.io/blob/main/_fifty-states/fifty-states.R
############################################

#### Set to states you'd like to plot abbr
abbrs <- c("AL","AR","AZ","CA","CO","CT","FL","GA","HI","IA","ID","IL",
           "IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC",
           "NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","TN",
           "TX","UT","VA","WA","WI","WV")

#### Set to states you'd like to plot abbr
abbrs <- c("ID","IL",
           "IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC",
           "NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","TN",
           "TX","UT","VA","WA","WI","WV")


### Inner function to plot data for a state
# idx: index of simulations to plot (an integer, with the except of the enacted map, which has index 'cd_2020')
# map, plans -> data files for state
make_maps <- function(i, map, m, abbr){
  
  # set coverage to false if Florida, as shown in render_state_page function in https://github.com/alarm-redist/alarm-redist.github.io/blob/main/_fifty-states/fifty-states.R
  if (abbr == "FL"){
    cover = FALSE
  }
  
  else{
    cover = TRUE
  }
  
  # plot enacted map
  if (i == 1){
    enacted <- plot_cds(map, m[, i], county, abbr, "dem", coverage = cover)
    ggsave(enacted, file=here("../maps",paste(abbr,"_enacted.png", sep = "")))
  }
  
  # plot simulated map
  else {
    plot_i <- plot_cds(map, m[, i], county, abbr, "dem", coverage = cover)
    ggsave(plot_i, file=here("../maps",paste(abbr,"_draw_",i,".png", sep = "")))
  }
  
}


### Outer function to gather data for a state and initiate plotting
# abbr: state's abbreviation. e.g. California = "CA"
# idxs: index of simulations to plot (an integer, with the except of the enacted map, which has index 'cd_2020')
make_all_maps <- function(abbr, idx){
  
  # gather data for state, source: part of 'download_dataverse' function from: https://github.com/alarm-redist/alarm-redist.github.io/blob/main/_fifty-states/fifty-states.R
  map <- read_rds(here("../data",paste(abbr,"_cd_2020_map.rds", sep="")))
  map$geometry = sf::st_make_valid(map$geometry) # make_valid stuff needed for FL and other states, as shown here: https://github.com/alarm-redist/alarm-redist.github.io/blob/main/_fifty-states/template.Rmd
  map$geometry = sf::st_buffer(map$geometry, 0)
  
  
  plans <- read_rds(here("../data",paste(abbr,"_cd_2020_plans.rds", sep="")))
  if (is.ordered(plans$district))
    plans$district = as.integer(plans$district)
  if (is.character(plans$draw))
    plans$draw = forcats::fct_inorder(plans$draw)
  if ("pop_overlap" %in% names(plans))
    plans$pop_overlap = NULL
  #plans$district <- as.integer(plans$district)
  
  stats <- read.csv(here("../data",paste(abbr,"_cd_2020_stats.csv", sep="")))
  # stats$total_pop <- as.integer(stats$total_pop) # use this only for Wisconsin (WI)
  
  print(abbr)
  
  # set up data for mapping
  state_plans <- left_join(plans, stats, by=c("draw", "district", "chain", "total_pop"))
  m <- as.matrix(state_plans)
  n_ref = redist:::get_n_ref(state_plans)
  N = ncol(m) - n_ref

  # call inner mapping function
  lapply(idx,make_maps,map = map, m = m, abbr = abbr)
  
}
           

### Indeces 1 - 301 (1 is the enacted map, so we get enacted + 300 simulations)
idxs <- 1:301


lapply(abbrs, make_all_maps, idx = idxs)











#### Defunct Code, when used slower for loop####
### Loop over each state
for (abbr in abbrs){
  
  # Data for state, source: https://github.com/alarm-redist/fifty-states
  map <- read_rds(here("../data",paste(abbr,"_cd_2020_map.rds", sep="")))
  plans <- read_rds(here("../data",paste(abbr,"_cd_2020_plans.rds", sep="")))
  stats <- read.csv(here("../data",paste(abbr,"_cd_2020_stats.csv", sep="")))
  
  # set up data for mapping
  state_plans <- left_join(plans, stats, by = c("draw","district","total_pop"))
  m <- as.matrix(state_plans)
  n_ref = redist:::get_n_ref(state_plans)
  N = ncol(m) - n_ref
  
  # plot 2020 enacted plan
  enacted <- plot_cds(map, map$cd_2020, county, abbr, "dem")
  ggsave(enacted, file=here("../maps",paste(abbr,"_enacted.png", sep = "")))
  
  # plot first 300 simulations (ignore first one, which is enacted map)
  idxs = 2:301
  for (i in idxs){
    plot_i <- plot_cds(map, m[, i], county, abbr, "dem")
    ggsave(plot_i, file=here("../maps",paste(abbr,"_draw_",i,".png", sep = "")))
  }
  
}

