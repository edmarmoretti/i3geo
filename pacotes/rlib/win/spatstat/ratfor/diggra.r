# $Id: diggra.r,v 1.3 2006/10/19 10:22:21 adrian Exp adrian $
subroutine diggra(u,v,ix,x,y,n,par,period,cifval)
#
# Conditional intensity function for a pairwise interaction point
# process with interaction function as given by 
#
#                  e(t) = 0 for t < delta
#                       = (t-delta)/(rho-delta)^kappa for delta <= t < rho
#                       = 1 for t >= rho
#
# (See page 767 of Diggle, Gates, and Stibbard, Biometrika vol. 74,
#  1987, pages 763 -- 770.)
#

implicit double precision(a-h,o-z)
double precision kappa
dimension par(7), x(n), y(n), period(2)
logical per

zero = 0.d0
per  = period(1) > zero

beta  = par(1)
kappa = par(2)
delta = par(3)
rho   = par(4)
d2    = par(5) # delta-squared, calculated ``back in R''
r2    = par(6) # rho-squared, calculated ``back in R''
a     = par(7) # log(rho - delta), calculated ``back in R''

if(n==0) {
	cifval = beta
	return
}

soglum = zero
do j = 1,n {
	if(j == ix) sincr = zero
	else {
		if(per) call dist2(u,v,x(j),y(j),period,t2)
		else t2 = (u-x(j))**2 + (v-y(j))**2
		if(t2 < d2) {
			cifval = zero
			return
		}
		if(t2 < r2) sincr = log(sqrt(t2) - delta) - a
		else sincr = zero
	}
	soglum = soglum + sincr
}

cifval = beta*exp(kappa*soglum)

return
end
