subroutine qtest1(h,i,j,k,x,y,ntot,eps,shdswp,nerror)

# The Lee-Schacter test for the LOP (all points are
# real, i.e. non-ideal).  If the LOP is ***not***
# satisfied then the diagonals should be swapped,
# i.e. shdswp ("should-swap") is true.
# Called by qtest.

implicit double precision(a-h,o-z)
dimension x(-3:ntot), y(-3:ntot)
integer h
logical shdswp

# The vertices of the quadrilateral are labelled
# h, i, j, k in the anticlockwise direction, h
# being the point of central interest.

# Make sure the quadrilateral is convex, so that
# it makes sense to swap the diagonal.
call acchk(i,j,k,shdswp,x,y,ntot,eps)
if(!shdswp) return

# Get the coordinates of vertices h and j.
xh = x(h)
yh = y(h)
xj = x(j)
yj = y(j)

# Find the centre of the circumcircle of vertices h, i, k.
call circen(h,i,k,x0,y0,x,y,ntot,eps,shdswp,nerror)
if(nerror>0) return
if(shdswp) return # The points h, i, and k are colinear, so
                  # the circumcircle has `infinite radius', so
                  # (xj,yj) is definitely inside.

# Check whether (xj,yj) is inside the circle of centre
# (x0,y0) and radius r = dist[(x0,y0),(xh,yh)]

a = x0-xh
b = y0-yh
r2 = a*a+b*b
a = x0-xj
b = y0-yj
ch = a*a+b*b
if(ch<r2) shdswp = .true.
else shdswp = .false.

return
end
