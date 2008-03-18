### Name: deldir
### Title: Construct the Delaunay triangulation and the Dirichlet (Voronoi)
###   tessellation of a planar point set.
### Aliases: deldir
### Keywords: spatial

### ** Examples

x   <- c(2.3,3.0,7.0,1.0,3.0,8.0)
y   <- c(2.3,3.0,2.0,5.0,8.0,9.0)
try <- deldir(x,y,list(ndx=2,ndy=2),c(0,10,0,10))
# Puts dummy points at the corners of the rectangular
# window, i.e. at (0,0), (10,0), (10,10), and (0,10)
## Not run: 
##D try <- deldir(x,y,list(ndx=2,ndy=2),c(0,10,0,10),plot=TRUE,wl='tr')
## End(Not run)
# Plots the triangulation which was created (but not the tesselation).



