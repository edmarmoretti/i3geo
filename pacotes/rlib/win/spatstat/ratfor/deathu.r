# 1 "death.template"
# 1 "<built-in>"
# 1 "<command line>"
# 1 "death.template"
## $Id: deathu.r,v 1.1 2006/10/19 10:22:21 adrian Exp adrian $

# 1 "death.h" 1
# 4 "death.template" 2

subroutine deathu(x,y,npts,ix)
implicit double precision(a-h,o-z)
dimension x(1), y(1)





npts = npts-1
if(ix > npts) return
do j = ix,npts {
 x(j) = x(j+1)
 y(j) = y(j+1)



}

return
end
