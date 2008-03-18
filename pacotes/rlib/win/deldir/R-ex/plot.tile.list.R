### Name: plot.tile.list
### Title: Plot Dirchlet/Voronoi tiles
### Aliases: plot.tile.list
### Keywords: hplot

### ** Examples

  x <- runif(20)
  y <- runif(20)
  z <- deldir(x,y,rw=c(0,1,0,1))
  w <- tile.list(z)
  plot(w)
  ccc <- heat.colors(20) # Or topo.colors(20), or terrain.colors(20)
                         # or cm.colors(20), or rainbox(20).
  plot(w,polycol=ccc,close=TRUE)



