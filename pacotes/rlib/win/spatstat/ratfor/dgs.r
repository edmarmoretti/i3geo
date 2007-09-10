# $Id: dgs.r,v 1.3 2006/10/19 10:22:21 adrian Exp adrian $
subroutine dgs(u,v,ix,x,y,n,par,period,cifval)
#
# Conditional intensity function for a pairwise interaction point
# process with interaction function as given by 
#
#                  e(t) = sin^2(pi*t/2*rho) for t < rho
#                       = 1 for t >= rho
#
# (See page 767 of Diggle, Gates, and Stibbard, Biometrika vol. 74,
#  1987, pages 763 -- 770.)
#


implicit double precision(a-h,o-z)
dimension par(3), x(n), y(n), period(2)
logical per

zero = 0.d0
one  = 1.d0
two  = 2.d0
per  = period(1) > zero

beta  = par(1)
rho   = par(2)
r2    = par(3) # rho-squared --- calculated ``back in R''
a     = two*atan(one)/rho

if(n==0) {
	cifval = beta
	return
}

soglum = zero
do j = 1,n {
	if(j == ix) sincr = zero
	else {
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		if(d2 < r2) sincr = two*log(sin(a*sqrt(d2)))
		else sincr = zero
	}
	soglum = soglum + sincr
}

cifval = beta*exp(soglum)

return
end
